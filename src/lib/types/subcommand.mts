/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  ChatInputCommandInteraction,
  Locale,
  SlashCommandSubcommandBuilder,
} from "discord.js"
import type { OptionValues, PartialOption } from "./option.mts"
import type { LowercaseKeys, NotEmpty, Unwrap } from "./util.mts"

export type Subcommand<Keys extends keyof Subcommand | "" = ""> = Unwrap<
  Omit<
    {
      builder: SlashCommandSubcommandBuilder
      nameLocalizations(
        localizations: Partial<Record<Locale, Lowercase<string>>>,
      ): Subcommand<Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<Locale, string>>,
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
        localizations: Partial<Record<Locale, Lowercase<string>>>,
      ): SubcommandWithOptions<Options, Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<Locale, string>>,
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
