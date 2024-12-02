/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  ChatInputCommandInteraction,
  LocaleString,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js"
import { OptionValues, PartialOption } from "./option.mjs"
import { InvertedPartialize, LowercaseKeys, NotEmpty, Unwrap } from "./util.mjs"

export type Subcommand<Keys extends keyof Subcommand | "" = ""> = Unwrap<
  Omit<
    {
      builder: SlashCommandSubcommandBuilder
      nameLocalizations(
        localizations: Partial<Record<LocaleString, string>>,
      ): Subcommand<Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<LocaleString, string>>,
      ): Subcommand<Keys | "descriptionLocalizations">
      options<T extends Record<string, PartialOption>>(
        options: NotEmpty<LowercaseKeys<T>>,
      ): SubcommandWithOptions<NotEmpty<LowercaseKeys<T>>, Keys | "options">
      handler: (
        handler: (interaction: ChatInputCommandInteraction) => Promise<void>,
      ) => Subcommand<Exclude<Keys, "handle"> | "options" | "handler">
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
    },
    Keys
  >
>

export type PartialSubcommand = Pick<Subcommand, "builder" | "handle"> & {
  options?: () => unknown
}

export type SubcommandWithOptions<
  Options extends Record<Lowercase<string>, PartialOption>,
  Keys extends keyof Subcommand | "" = "",
> = Unwrap<
  Omit<
    {
      builder: SlashCommandSubcommandBuilder
      options: Options
      nameLocalizations(
        localizations: Partial<Record<LocaleString, string>>,
      ): SubcommandWithOptions<Options, Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<LocaleString, string>>,
      ): SubcommandWithOptions<Options, Keys | "descriptionLocalizations">
      handler: (
        handler: (
          interaction: ChatInputCommandInteraction,
          values: OptionValues<Options>,
        ) => Promise<void>,
      ) => SubcommandWithOptions<Options, Exclude<Keys, "handle"> | "handler">
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
    },
    Keys
  >
>

export type SubcommandGroup<
  Keys extends keyof SubcommandGroup | "" = "",
  Subcommands extends boolean = false,
> = Unwrap<
  Omit<
    {
      builder: SlashCommandSubcommandGroupBuilder
      nameLocalizations(
        localizations: Partial<Record<LocaleString, string>>,
      ): SubcommandGroup<Keys, Subcommands>
      descriptionLocalizations(
        localizations: Partial<Record<LocaleString, string>>,
      ): SubcommandGroup<Keys, Subcommands>
    } & (Subcommands extends true
      ? {
          subcommands: Record<Lowercase<string>, PartialSubcommand>
        }
      : {
          subcommands<T extends Record<string, PartialSubcommand>>(
            subcommands: NotEmpty<LowercaseKeys<T>>,
          ): SubcommandGroup<Keys, true>
        }),
    Keys
  >
>

export type PartialSubcommandGroup = InvertedPartialize<
  SubcommandGroup<"", true>,
  "builder" | "subcommands"
>
