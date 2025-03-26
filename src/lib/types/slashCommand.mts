/**
 * Copyright (C) 2024  Jochem Waqué
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
  type Permissions,
  SlashCommandBuilder,
} from "discord.js"
import type { OptionValues, PartialOption } from "./option.mts"
import type { PartialSubcommand } from "./subcommand.mts"
import type { PartialSubcommandGroup } from "./subcommandGroup.mts"
import type { LowercaseKeys, NotEmpty, Unwrap } from "./util.mts"

// TODO separate Handler into Subcommands and regular Handler
export type SlashCommand<Keys extends keyof SlashCommand | "" = ""> = Unwrap<
  Omit<
    {
      readonly name: string
      readonly builder: SlashCommandBuilder
      readonly type: ApplicationCommandType.ChatInput
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
      readonly name: string
      readonly builder: SlashCommandBuilder
      readonly type: ApplicationCommandType.ChatInput
      readonly options: Options
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
