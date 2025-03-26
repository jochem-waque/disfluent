/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { Locale, SlashCommandSubcommandGroupBuilder } from "discord.js"
import type { PartialSubcommand } from "./subcommand.mts"
import type { LowercaseKeys, NotEmpty, Unwrap } from "./util.mts"

export type SubcommandGroup<Keys extends keyof SubcommandGroup | "" = ""> =
  Unwrap<
    Omit<
      {
        readonly builder: SlashCommandSubcommandGroupBuilder
        nameLocalizations(
          localizations: Partial<Record<Locale, Lowercase<string>>>,
        ): SubcommandGroup<Keys | "nameLocalizations">
        descriptionLocalizations(
          localizations: Partial<Record<Locale, string>>,
        ): SubcommandGroup<Keys | "descriptionLocalizations">
        subcommands<T extends Record<string, PartialSubcommand>>(
          subcommands: NotEmpty<LowercaseKeys<T>>,
        ): SubcommandGroupWithSubcommands<Keys>
      },
      Keys
    >
  >

export type SubcommandGroupWithSubcommands<
  Keys extends keyof SubcommandGroup | "" = "",
> = Unwrap<
  Omit<
    {
      readonly builder: SlashCommandSubcommandGroupBuilder
      readonly subcommands: Record<Lowercase<string>, PartialSubcommand>
      nameLocalizations(
        localizations: Partial<Record<Locale, Lowercase<string>>>,
      ): SubcommandGroupWithSubcommands<Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<Locale, string>>,
      ): SubcommandGroupWithSubcommands<Keys | "descriptionLocalizations">
    },
    Keys
  >
>

export type PartialSubcommandGroup = Pick<
  SubcommandGroupWithSubcommands,
  "builder" | "subcommands"
>
