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

export type SlashCommand<
  Options extends
    | Record<Lowercase<string>, PartialOption>
    | undefined = undefined,
  Keys extends keyof SlashCommand | "" = "",
> = Unwrap<
  Omit<
    {
      readonly "~options": Options
      readonly name: string
      readonly builder: SlashCommandBuilder
      readonly type: ApplicationCommandType.ChatInput
      nameLocalizations(
        localizations: Partial<Record<Locale, Lowercase<string>>>,
      ): SlashCommand<Options, Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<Locale, string>>,
      ): SlashCommand<Options, Keys | "descriptionLocalizations">
      contexts(
        ...contexts: InteractionContextType[]
      ): SlashCommand<Options, Keys | "contexts">
      defaultMemberPermissions(
        permissions: Permissions | bigint,
      ): SlashCommand<Options, Keys | "defaultMemberPermissions">
      integrationTypes(
        ...types: ApplicationIntegrationType[]
      ): SlashCommand<Options, Keys | "integrationTypes">
      nsfw(): SlashCommand<Options, Keys | "nsfw">
      options<NewOptions extends Record<string, PartialOption>>(
        options: NotEmpty<LowercaseKeys<NewOptions>>,
      ): SlashCommand<
        NotEmpty<LowercaseKeys<NewOptions>>,
        Keys | "options" | "subcommands" | "subcommandGroups"
      >
      handler(
        handler: Options extends Record<Lowercase<string>, PartialOption>
          ? (
              interaction: ChatInputCommandInteraction,
              values: OptionValues<Options>,
            ) => Promise<void>
          : (interaction: ChatInputCommandInteraction) => Promise<void>,
      ): SlashCommand<
        Options,
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
        Options,
        | Exclude<Keys, "handle" | "autocomplete">
        | "options"
        | "handler"
        | "subcommands"
      >
      subcommandGroups<T extends Record<string, PartialSubcommandGroup>>(
        groups: NotEmpty<LowercaseKeys<T>>,
      ): SlashCommand<
        Options,
        | Exclude<Keys, "handle" | "autocomplete">
        | "options"
        | "handler"
        | "subcommandGroups"
      >
    },
    Keys
  >
>
