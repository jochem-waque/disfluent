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
  Locale,
  Permissions,
  SlashCommandBuilder,
} from "discord.js"
import { OptionValues, PartialOption } from "./option.mjs"
import { PartialSubcommand } from "./subcommand.mjs"
import { PartialSubcommandGroup } from "./subcommandGroup.mjs"
import { LowercaseKeys, NotEmpty, Unwrap } from "./util.mjs"

// TODO separate Handler into Subcommands and regular Handler
export type SlashCommand<Keys extends keyof SlashCommand | "" = ""> = Unwrap<
  Omit<
    {
      builder: SlashCommandBuilder
      type: ApplicationCommandType.ChatInput
      nameLocalizations(
        localizations: Partial<Record<Locale, Lowercase<string>>>,
      ): SlashCommand<Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<Locale, string>>,
      ): SlashCommand<Keys | "descriptionLocalizations">
      contexts(
        context: InteractionContextType,
        ...rest: InteractionContextType[]
      ): SlashCommand<Keys | "contexts">
      defaultMemberPermissions(
        permissions: Permissions | bigint,
      ): SlashCommand<Keys | "defaultMemberPermissions">
      integrationTypes(
        type: ApplicationIntegrationType,
        ...rest: ApplicationIntegrationType[]
      ): SlashCommand<Keys | "integrationTypes">
      nsfw(): SlashCommand<Keys | "nsfw">
      options<T extends Record<string, PartialOption>>(
        options: NotEmpty<LowercaseKeys<T>>,
      ): SlashCommandWithOptions<
        NotEmpty<LowercaseKeys<T>>,
        Keys | "options" | "subcommands" | "subcommandGroups"
      >
      handler(
        handler: (interaction: ChatInputCommandInteraction) => Promise<void>,
      ): SlashCommand<
        | Exclude<Keys, "handle" | "autocomplete">
        | "handler"
        | "options"
        | "subcommandGroups"
        | "subcommands"
      >
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
      autocomplete: (interaction: AutocompleteInteraction) => Promise<void>
      subcommands<T extends Record<string, PartialSubcommand>>(
        subcommands: NotEmpty<LowercaseKeys<T>>,
      ): SlashCommand<
        | Exclude<Keys, "handle" | "autocomplete">
        | "options"
        | "handler"
        | "subcommands"
      >
      subcommandGroups<T extends Record<string, PartialSubcommandGroup>>(
        groups: NotEmpty<LowercaseKeys<T>>,
      ): SlashCommand<
        | Exclude<Keys, "handle" | "autocomplete">
        | "options"
        | "handler"
        | "subcommandGroups"
      >
    },
    Keys
  >
>

type SlashCommandWithOptions<
  Options extends Record<Lowercase<string>, PartialOption>,
  Keys extends keyof SlashCommand | "" = "",
> = Unwrap<
  Omit<
    {
      builder: SlashCommandBuilder
      type: ApplicationCommandType.ChatInput
      options: Options
      nameLocalizations(
        localizations: Partial<Record<Locale, Lowercase<string>>>,
      ): SlashCommandWithOptions<Options, Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<Locale, string>>,
      ): SlashCommandWithOptions<Options, Keys | "descriptionLocalizations">
      contexts(
        context: InteractionContextType,
        ...rest: InteractionContextType[]
      ): SlashCommandWithOptions<Options, Keys | "contexts">
      defaultMemberPermissions(
        permissions: Permissions | bigint,
      ): SlashCommandWithOptions<Options, Keys | "defaultMemberPermissions">
      integrationTypes(
        type: ApplicationIntegrationType,
        ...rest: ApplicationIntegrationType[]
      ): SlashCommandWithOptions<Options, Keys | "integrationTypes">
      nsfw(): SlashCommandWithOptions<Options, Keys | "nsfw">
      handler(
        handler: (
          interaction: ChatInputCommandInteraction,
          values: OptionValues<Options>,
        ) => Promise<void>,
      ): SlashCommandWithOptions<
        Options,
        Exclude<Keys, "handle" | "autocomplete"> | "handler" | "options"
      >
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
      autocomplete: (interaction: AutocompleteInteraction) => Promise<void>
    },
    Keys
  >
>
