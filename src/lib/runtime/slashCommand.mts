/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  ApplicationCommandType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js"
import type { OptionValues, PartialOption } from "../types/option.mts"
import type { SlashCommand } from "../types/slashCommand.mts"
import type {
  PartialSubcommand,
  Subcommand,
  SubcommandWithOptions,
} from "../types/subcommand.mts"
import type { PartialSubcommandGroup } from "../types/subcommandGroup.mts"
import { InternalError } from "./error.mts"
import { applyOptions, getOptionValue } from "./internal.mts"

export function slashCommand(
  name: Lowercase<string>,
  description: string,
): SlashCommand<undefined, "handle" | "autocomplete" | "~options"> {
  return {
    name,
    type: ApplicationCommandType.ChatInput,
    builder: new SlashCommandBuilder()
      .setName(name)
      .setDescription(description),
    nameLocalizations(localizations) {
      this.builder.setNameLocalizations(localizations)
      return this
    },
    descriptionLocalizations(localizations) {
      this.builder.setDescriptionLocalizations(localizations)
      return this
    },
    contexts(context, ...rest) {
      this.builder.setContexts(context, ...rest)
      return this
    },
    defaultMemberPermissions(permissions) {
      this.builder.setDefaultMemberPermissions(permissions)
      return this
    },
    integrationTypes(type, ...rest) {
      this.builder.setIntegrationTypes(type, ...rest)
      return this
    },
    nsfw() {
      this.builder.setNSFW(true)
      return this
    },
    options(options) {
      applyOptions(this.builder, options)

      return {
        ...this,
        "~options": options,
        nameLocalizations(localizations) {
          this.builder.setNameLocalizations(localizations)
          return this
        },
        descriptionLocalizations(localizations) {
          this.builder.setDescriptionLocalizations(localizations)
          return this
        },
        handler(handler) {
          return {
            ...this,
            async autocomplete(interaction) {
              const focused = interaction.options.getFocused(true)
              const option = options[focused.name] as PartialOption | undefined
              if (!option) {
                throw new InternalError("option_not_found")
              }

              if (!("handleAutocomplete" in option)) {
                throw new InternalError("option_not_autocompletable")
              }

              await option.handleAutocomplete(interaction)
            },
            async handle(interaction) {
              const values = Object.fromEntries(
                Object.entries(options).map(([key, option]) => [
                  key,
                  getOptionValue(interaction, option),
                ]),
              ) as OptionValues<typeof options>
              await handler(interaction, values)
            },
            nameLocalizations(localizations) {
              this.builder.setNameLocalizations(localizations)
              return this
            },
            descriptionLocalizations(localizations) {
              this.builder.setDescriptionLocalizations(localizations)
              return this
            },
            contexts(context, ...rest) {
              this.builder.setContexts(context, ...rest)
              return this
            },
            defaultMemberPermissions(permissions) {
              this.builder.setDefaultMemberPermissions(permissions)
              return this
            },
            integrationTypes(type, ...rest) {
              this.builder.setIntegrationTypes(type, ...rest)
              return this
            },
            nsfw() {
              this.builder.setNSFW(true)
              return this
            },
          }
        },
        contexts(context, ...rest) {
          this.builder.setContexts(context, ...rest)
          return this
        },
        defaultMemberPermissions(permissions) {
          this.builder.setDefaultMemberPermissions(permissions)
          return this
        },
        integrationTypes(type, ...rest) {
          this.builder.setIntegrationTypes(type, ...rest)
          return this
        },
        nsfw() {
          this.builder.setNSFW(true)
          return this
        },
      }
    },
    handler(handler) {
      return {
        ...this,
        handle: handler,
        nameLocalizations(localizations) {
          this.builder.setNameLocalizations(localizations)
          return this
        },
        descriptionLocalizations(localizations) {
          this.builder.setDescriptionLocalizations(localizations)
          return this
        },
        autocomplete() {
          throw new InternalError("command_not_autocompletable")
        },
        contexts(context, ...rest) {
          this.builder.setContexts(context, ...rest)
          return this
        },
        defaultMemberPermissions(permissions) {
          this.builder.setDefaultMemberPermissions(permissions)
          return this
        },
        integrationTypes(type, ...rest) {
          this.builder.setIntegrationTypes(type, ...rest)
          return this
        },
        nsfw() {
          this.builder.setNSFW(true)
          return this
        },
      }
    },
    subcommands(subcommands: Record<string, PartialSubcommand>) {
      for (const [name, { builder }] of Object.entries(subcommands)) {
        builder.setName(name)
        this.builder.addSubcommand(builder)
      }

      let handle
      if ("handle" in this) {
        const newThis = this as Pick<SlashCommand, "handle">
        handle = async (interaction: ChatInputCommandInteraction) => {
          const group = interaction.options.getSubcommandGroup()
          if (group) {
            await newThis.handle(interaction)
            return
          }

          const name = interaction.options.getSubcommand(
            true,
          ) as Lowercase<string>
          const command = subcommands[name]
          if (!command) {
            throw new InternalError("subcommand_not_found")
          }

          await command.handle(interaction)
        }
      } else {
        handle = async (interaction: ChatInputCommandInteraction) => {
          const name = interaction.options.getSubcommand(
            true,
          ) as Lowercase<string>
          const command = subcommands[name]
          if (!command) {
            throw new InternalError("subcommand_not_found")
          }

          await command.handle(interaction)
        }
      }

      let autocomplete
      if ("autocomplete" in this) {
        const newThis = this as Pick<SlashCommand, "autocomplete">
        autocomplete = async (interaction: AutocompleteInteraction) => {
          const group = interaction.options.getSubcommandGroup()
          if (group) {
            await newThis.autocomplete(interaction)
            return
          }

          const subcommandName = interaction.options.getSubcommand(
            true,
          ) as Lowercase<string>
          const command = subcommands[subcommandName] as
            | PartialSubcommand
            | SubcommandWithOptions<
                Record<Lowercase<string>, PartialOption>,
                Exclude<keyof Subcommand, "options">
              >
            | undefined
          if (!command) {
            throw new InternalError("subcommand_not_found")
          }

          if (!command.options || command.options instanceof Function) {
            throw new InternalError("command_not_autocompletable")
          }

          const { name } = interaction.options.getFocused(true)

          const option = command.options[name as Lowercase<string>]
          if (!option) {
            throw new InternalError("option_not_found")
          }

          if (!("handleAutocomplete" in option)) {
            throw new InternalError("option_not_autocompletable")
          }

          await option.handleAutocomplete(interaction)
        }
      } else {
        autocomplete = async (interaction: AutocompleteInteraction) => {
          const subcommandName = interaction.options.getSubcommand(
            true,
          ) as Lowercase<string>
          const command = subcommands[subcommandName] as
            | PartialSubcommand
            | SubcommandWithOptions<
                Record<Lowercase<string>, PartialOption>,
                Exclude<keyof Subcommand, "options">
              >
            | undefined
          if (!command) {
            throw new InternalError("subcommand_not_found")
          }

          if (!command.options || command.options instanceof Function) {
            throw new InternalError("command_not_autocompletable")
          }

          const { name } = interaction.options.getFocused(true)

          const option = command.options[name as Lowercase<string>]
          if (!option) {
            throw new InternalError("option_not_found")
          }

          if (!("handleAutocomplete" in option)) {
            throw new InternalError("option_not_autocompletable")
          }

          await option.handleAutocomplete(interaction)
        }
      }

      return {
        ...this,
        handle,
        autocomplete,
        nameLocalizations(localizations) {
          this.builder.setNameLocalizations(localizations)
          return this
        },
        descriptionLocalizations(localizations) {
          this.builder.setDescriptionLocalizations(localizations)
          return this
        },
        contexts(context, ...rest) {
          this.builder.setContexts(context, ...rest)
          return this
        },
        defaultMemberPermissions(permissions) {
          this.builder.setDefaultMemberPermissions(permissions)
          return this
        },
        integrationTypes(type, ...rest) {
          this.builder.setIntegrationTypes(type, ...rest)
          return this
        },
        nsfw() {
          this.builder.setNSFW(true)
          return this
        },
      }
    },
    subcommandGroups(subcommandGroups: Record<string, PartialSubcommandGroup>) {
      for (const [name, { builder }] of Object.entries(subcommandGroups)) {
        builder.setName(name)
        this.builder.addSubcommandGroup(builder)
      }

      let handle
      if ("handle" in this) {
        const newThis = this as Pick<SlashCommand, "handle">
        handle = async (interaction: ChatInputCommandInteraction) => {
          const groupName = interaction.options.getSubcommandGroup()
          if (!groupName) {
            await newThis.handle(interaction)
            return
          }

          const group = subcommandGroups[groupName]
          if (!group) {
            throw new InternalError("subcommand_group_not_found")
          }

          const name = interaction.options.getSubcommand(
            true,
          ) as Lowercase<string>
          const command = group["~subcommands"][name]
          if (!command) {
            throw new InternalError("subcommand_not_found")
          }

          await command.handle(interaction)
        }
      } else {
        handle = async (interaction: ChatInputCommandInteraction) => {
          const groupName = interaction.options.getSubcommandGroup(
            true,
          ) as Lowercase<string>
          const group = subcommandGroups[groupName]
          if (!group) {
            throw new InternalError("subcommand_group_not_found")
          }

          const name = interaction.options.getSubcommand(
            true,
          ) as Lowercase<string>
          const command = group["~subcommands"][name]
          if (!command) {
            throw new InternalError("subcommand_not_found")
          }

          await command.handle(interaction)
        }
      }

      let autocomplete
      if ("autocomplete" in this) {
        const newThis = this as Pick<SlashCommand, "autocomplete">
        autocomplete = async (interaction: AutocompleteInteraction) => {
          const groupName = interaction.options.getSubcommandGroup()
          if (!groupName) {
            await newThis.autocomplete(interaction)
            return
          }

          const group = subcommandGroups[groupName]
          if (!group) {
            throw new InternalError("subcommand_group_not_found")
          }

          const subcommandName = interaction.options.getSubcommand(
            true,
          ) as Lowercase<string>
          const command = group["~subcommands"][subcommandName] as
            | PartialSubcommand
            | SubcommandWithOptions<
                Record<Lowercase<string>, PartialOption>,
                Exclude<keyof Subcommand, "options">
              >
            | undefined

          if (!command) {
            throw new InternalError("subcommand_not_found")
          }

          if (!command.options || command.options instanceof Function) {
            throw new InternalError("command_not_autocompletable")
          }

          const { name } = interaction.options.getFocused(true)

          const option = command.options[name as Lowercase<string>]
          if (!option) {
            throw new InternalError("option_not_found")
          }

          if (!("handleAutocomplete" in option)) {
            throw new InternalError("option_not_autocompletable")
          }

          await option.handleAutocomplete(interaction)
        }
      } else {
        autocomplete = async (interaction: AutocompleteInteraction) => {
          const groupName = interaction.options.getSubcommandGroup(true)

          const group = subcommandGroups[groupName]
          if (!group) {
            throw new InternalError("subcommand_group_not_found")
          }

          const subcommandName = interaction.options.getSubcommand(
            true,
          ) as Lowercase<string>
          const command = group["~subcommands"][subcommandName] as
            | PartialSubcommand
            | SubcommandWithOptions<
                Record<Lowercase<string>, PartialOption>,
                Exclude<keyof Subcommand, "options">
              >
            | undefined

          if (!command) {
            throw new InternalError("subcommand_not_found")
          }

          if (!command.options || command.options instanceof Function) {
            throw new InternalError("command_not_autocompletable")
          }

          const { name } = interaction.options.getFocused(true)

          const option = command.options[name as Lowercase<string>]
          if (!option) {
            throw new InternalError("option_not_found")
          }

          if (!("handleAutocomplete" in option)) {
            throw new InternalError("option_not_autocompletable")
          }

          await option.handleAutocomplete(interaction)
        }
      }

      return {
        ...this,
        handle,
        autocomplete,
        nameLocalizations(localizations) {
          this.builder.setNameLocalizations(localizations)
          return this
        },
        descriptionLocalizations(localizations) {
          this.builder.setDescriptionLocalizations(localizations)
          return this
        },
        contexts(context, ...rest) {
          this.builder.setContexts(context, ...rest)
          return this
        },
        defaultMemberPermissions(permissions) {
          this.builder.setDefaultMemberPermissions(permissions)
          return this
        },
        integrationTypes(type, ...rest) {
          this.builder.setIntegrationTypes(type, ...rest)
          return this
        },
        nsfw() {
          this.builder.setNSFW(true)
          return this
        },
      }
    },
  }
}
