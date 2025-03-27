/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type {
  ClientOptions,
  RESTPutAPIApplicationCommandsResult,
} from "discord.js"
import { Client, Routes } from "discord.js"
import {
  type Bot,
  type CompletedCommand,
  type ComponentBuilder,
  InternalError,
} from "../external.mts"

export function bot(options: ClientOptions): Bot {
  const client = new Client(options)

  const commands = new Map<string, CompletedCommand>()
  const registeredCommands = new Map<string, CompletedCommand>()

  const components = new Map<string, ComponentBuilder>()

  let errorHandler = console.error

  client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
      const command = registeredCommands.get(interaction.commandId)
      if (!command || command.type !== interaction.commandType) {
        return
      }

      command.handle(interaction as never).catch(errorHandler)

      return
    }

    if (interaction.isAutocomplete()) {
      const command = registeredCommands.get(interaction.commandId)
      if (!command || !("autocomplete" in command)) {
        return
      }

      command.autocomplete(interaction).catch(errorHandler)
      return
    }

    if (interaction.isMessageComponent()) {
      const split = interaction.customId.split(":")
      if (!split[0]) {
        return
      }

      const component = components.get(split[0])
      if (!component) {
        return
      }

      if (component.type !== interaction.componentType) {
        return
      }

      component
        .handle(interaction as never, ...split.slice(0))
        .catch(errorHandler)
    }
  })

  return {
    client,
    addModule(module) {
      for (const command of module.commands.values()) {
        commands.set(command.name, command)
      }

      for (const handler of module.events) {
        const wrapped = (...params: Parameters<typeof handler.handle>) => {
          const promise = handler.handle(...params)
          if (promise) {
            promise.catch(errorHandler)
          }
        }

        if (handler.once === true) {
          client.once(handler.event, wrapped)
          continue
        }

        client.on(handler.event, wrapped)
      }

      for (const component of module.components) {
        if (components.has(component.id)) {
          throw new InternalError(
            "duplicate_custom_id",
            `The custom ID "${component.id}" is already in use`,
          )
        }

        components.set(component.id, component)
      }

      return this
    },
    errorHandler(handler) {
      errorHandler = handler
      return this
    },
    register() {
      client.once("ready", (client) => {
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
            }
          })
          .catch(errorHandler)
      })
      return this
    },
  }
}
