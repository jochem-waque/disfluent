/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type {
  ClientOptions,
  RESTPutAPIApplicationCommandsResult,
  User,
  Webhook,
  WebhookMessageCreateOptions,
  WebhookType,
} from "discord.js"
import { Client, MessageFlags, Routes } from "discord.js"
import {
  type Bot,
  type CompletedCommand,
  type ErrorContext,
  type ErrorHandler,
  InternalError,
} from "../external.mts"
import { errorMessageComponents } from "./errorMessage.mts"
import { Components } from "./internal.mts"

let instantiated = false
let errorHandler: ErrorHandler | undefined
let clientUser: User | undefined
const webhooks: Webhook<WebhookType.Incoming>[] = []

export function log(context: ErrorContext) {
  try {
    if (errorHandler) {
      errorHandler(context)
    }

    if (webhooks.length === 0) {
      console.error(context)
      return
    }

    const options: WebhookMessageCreateOptions = {
      flags: MessageFlags.IsComponentsV2,
      components: errorMessageComponents(context),
      withComponents: true,
    }

    if (clientUser) {
      options.username = clientUser.displayName
      options.avatarURL = clientUser.displayAvatarURL()
    }

    for (const webhook of webhooks.values()) {
      webhook.send(options).catch(console.error)
    }
  } catch (e) {
    console.error(e)
  }
}

export function bot(options: ClientOptions): Bot {
  if (instantiated) {
    throw new Error("Bot is a singleton and can only be instantiated once")
  }

  instantiated = true

  const client = new Client(options)

  const commands = new Map<string, CompletedCommand>()
  const registeredCommands = new Map<string, CompletedCommand>()

  const webhookURLs = new Set<string>()

  client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
      const command = registeredCommands.get(interaction.commandId)
      if (!command || command.type !== interaction.commandType) {
        return
      }

      command.handle(interaction as never).catch((error: unknown) => {
        log({ error, interaction, command })
      })

      return
    }

    if (interaction.isAutocomplete()) {
      const command = registeredCommands.get(interaction.commandId)
      if (!command || !("autocomplete" in command)) {
        return
      }

      command.autocomplete(interaction).catch((error: unknown) => {
        log({ error, interaction, command })
      })
      return
    }

    if (interaction.isMessageComponent()) {
      const split = interaction.customId.split(":")
      if (!split[0]) {
        return
      }

      const component = Components.get(split[0])
      if (!component) {
        return
      }

      if (component.type !== interaction.componentType) {
        return
      }

      component
        .handle(interaction as never, ...split.slice(1))
        .catch((error: unknown) => {
          log({ error, interaction, component })
        })
    }
  })

  client.on("clientReady", (client) => {
    async function fetchWebhook(url: string) {
      const [id, token] = url.slice(33).split("/")
      if (!id || !token) {
        throw new InternalError("invalid_webhook_url")
      }

      const webhook = await client.fetchWebhook(id, token)
      if (!webhook.isIncoming()) {
        throw new InternalError("invalid_webhook_type")
      }

      return webhook
    }

    Promise.allSettled([...webhookURLs.values()].map(fetchWebhook))
      .then((results) => {
        for (const result of results) {
          switch (result.status) {
            case "rejected":
              console.error(result.reason)
              break
            case "fulfilled":
              webhooks.push(result.value)
              break
          }
        }
      })
      .catch(console.error)
  })

  return {
    "~client": client,
    addModule(module) {
      for (const command of module.commands.values()) {
        commands.set(command.name, command)
      }

      for (const handler of module.events) {
        const wrapped = (...params: Parameters<typeof handler.handle>) => {
          try {
            handler.handle(...params)?.catch((error: unknown) => {
              log({ error, handler, handlerParameters: params })
            })
          } catch (error) {
            log({ error, handler, handlerParameters: params })
          }
        }

        if (handler.once === true) {
          client.once(handler.event, wrapped)
          continue
        }

        client.on(handler.event, wrapped)
      }

      return this
    },
    errorHandler(handler) {
      errorHandler = handler
      return this
    },
    addErrorWebhook(url) {
      webhookURLs.add(url.toString())
      return this
    },
    register() {
      client.once("clientReady", (client) => {
        client.rest
          .put(Routes.applicationCommands(client.application.id), {
            body: [...commands.values()].map((command) =>
              command.builder.toJSON(),
            ),
          })
          .then((data) => {
            for (const registration of data as RESTPutAPIApplicationCommandsResult) {
              const command = commands.get(registration.name)
              if (!command) {
                throw new InternalError(
                  "could_not_register",
                  `Could not correctly register command "${registration.name} (${registration.id})"`,
                )
              }

              registeredCommands.set(registration.id, command)
              command.id = registration.id
            }
          })
          .catch((error: unknown) => {
            log({ error })
          })
      })
      return this
    },
    async login(token) {
      await client.login(token)
    },
  }
}
