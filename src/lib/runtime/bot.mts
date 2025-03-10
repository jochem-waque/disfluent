/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  Client,
  ClientOptions,
  RESTPutAPIApplicationCommandsResult,
  Routes,
} from "discord.js"
import { Bot, CompletedCommand, InternalError } from "../external.mjs"

export function bot(options: ClientOptions, register?: true): Bot {
  const client = new Client(options)

  const commands = new Map<string, CompletedCommand>()
  const registeredCommands = new Map<string, CompletedCommand>()

  client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
      const command = registeredCommands.get(interaction.commandId)
      if (!command || command.type !== interaction.commandType) {
        return
      }

      command.handle(interaction as never).catch(console.error)

      return
    }

    if (interaction.isAutocomplete()) {
      const command = registeredCommands.get(interaction.commandId)
      if (!command || !("autocomplete" in command)) {
        return
      }

      command.autocomplete(interaction).catch(console.error)
      return
    }
  })

  if (register) {
    client.once("ready", (client) => {
      client.rest
        .put(Routes.applicationCommands(client.application.id), {
          body: [...commands.values()],
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
        .catch(console.error)
    })
  }

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
            promise.catch(console.error)
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
  }
}
