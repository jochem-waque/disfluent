/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  ApplicationCommandType,
  ApplicationIntegrationType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  InteractionContextType,
  Permissions,
  SlashCommandBuilder,
} from "discord.js"
import { OptionValues, PartialOption } from "./option.mjs"
import { PartialSubcommand, PartialSubcommandGroup } from "./subcommand.mjs"
import { LowercaseKeys, NotEmpty, Unwrap } from "./util.mjs"

// TODO separate Handler into Subcommands and regular Handler
export type SlashCommand<
  Keys extends keyof SlashCommand | "" = "",
  Handler extends boolean = false,
> = Unwrap<
  Omit<
    {
      builder: SlashCommandBuilder
      type: ApplicationCommandType.ChatInput
      contexts(
        context: InteractionContextType,
        ...rest: InteractionContextType[]
      ): SlashCommand<Keys | "contexts", Handler>
      defaultMemberPermissions(
        permissions: Permissions | bigint,
      ): SlashCommand<Keys | "defaultMemberPermissions", Handler>
      integrationTypes(
        type: ApplicationIntegrationType,
        ...rest: ApplicationIntegrationType[]
      ): SlashCommand<Keys | "integrationTypes", Handler>
      nsfw(): SlashCommand<Keys | "nsfw", Handler>
      options<T extends Record<string, PartialOption>>(
        options: NotEmpty<LowercaseKeys<T>>,
      ): SlashCommandWithOptions<
        NotEmpty<LowercaseKeys<T>>,
        Keys | "options" | "subcommands" | "subcommandGroups",
        Handler
      >
      handler(
        handler: (interaction: ChatInputCommandInteraction) => Promise<void>,
      ): SlashCommand<
        Keys | "handler" | "options" | "subcommandGroups" | "subcommands",
        true
      >
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
      autocomplete: (interaction: AutocompleteInteraction) => Promise<void>
      subcommands<T extends Record<string, PartialSubcommand>>(
        subcommands: NotEmpty<LowercaseKeys<T>>,
      ): SlashCommand<Keys | "options" | "handler" | "subcommands", true>
      subcommandGroups<T extends Record<string, PartialSubcommandGroup>>(
        groups: NotEmpty<LowercaseKeys<T>>,
      ): SlashCommand<Keys | "options" | "handler" | "subcommandGroups", true>
    },
    Handler extends true
      ? Exclude<Keys, "handle" | "autocomplete">
      : Keys | "handle" | "autocomplete"
  >
>

type SlashCommandWithOptions<
  Options extends Record<Lowercase<string>, PartialOption>,
  Keys extends keyof SlashCommand | "" = "",
  Handler extends boolean = false,
> = Unwrap<
  Omit<
    {
      builder: SlashCommandBuilder
      type: ApplicationCommandType.ChatInput
      options: Options
      contexts(
        context: InteractionContextType,
        ...rest: InteractionContextType[]
      ): SlashCommandWithOptions<Options, Keys | "contexts", Handler>
      defaultMemberPermissions(
        permissions: Permissions | bigint,
      ): SlashCommandWithOptions<
        Options,
        Keys | "defaultMemberPermissions",
        Handler
      >
      integrationTypes(
        type: ApplicationIntegrationType,
        ...rest: ApplicationIntegrationType[]
      ): SlashCommandWithOptions<Options, Keys | "integrationTypes", Handler>
      nsfw(): SlashCommandWithOptions<Options, Keys | "nsfw", Handler>
      handler(
        handler: (
          interaction: ChatInputCommandInteraction,
          values: OptionValues<Options>,
        ) => Promise<void>,
      ): SlashCommandWithOptions<Options, Keys | "handler" | "options", true>
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
      autocomplete: (interaction: AutocompleteInteraction) => Promise<void>
    },
    Handler extends true
      ? Exclude<Keys, "handle" | "autocomplete">
      : Keys | "handle" | "autocomplete"
  >
>
