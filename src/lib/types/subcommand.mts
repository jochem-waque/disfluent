/**
 * Copyright (C) 2024  Jochem Waqué
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

export type Subcommand<
  Options extends
    | Record<Lowercase<string>, PartialOption>
    | undefined = undefined,
  Keys extends keyof Subcommand | "" = "",
> = Unwrap<
  Omit<
    {
      readonly "~options": Options
      readonly builder: SlashCommandSubcommandBuilder
      nameLocalizations(
        localizations: Partial<Record<Locale, Lowercase<string>>>,
      ): Subcommand<Options, Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<Locale, string>>,
      ): Subcommand<Options, Keys | "descriptionLocalizations">
      options<NewOptions extends Record<string, PartialOption>>(
        options: NotEmpty<LowercaseKeys<NewOptions>>,
      ): Subcommand<
        NotEmpty<LowercaseKeys<NewOptions>>,
        Exclude<Keys, "~options"> | "options"
      >
      handler: (
        handler: Options extends Record<Lowercase<string>, PartialOption>
          ? (
              interaction: ChatInputCommandInteraction,
              values: OptionValues<Options>,
            ) => Promise<void>
          : (interaction: ChatInputCommandInteraction) => Promise<void>,
      ) => Subcommand<Options, Exclude<Keys, "handle"> | "options" | "handler">
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
    },
    Keys
  >
>

export type PartialSubcommand = Pick<
  Subcommand<Record<Lowercase<string>, PartialOption> | undefined>,
  "builder" | "handle"
>
