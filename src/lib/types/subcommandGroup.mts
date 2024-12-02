/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { LocaleString, SlashCommandSubcommandGroupBuilder } from "discord.js"
import { PartialSubcommand } from "./subcommand.mjs"
import { LowercaseKeys, NotEmpty, Unwrap } from "./util.mjs"

export type SubcommandGroup<Keys extends keyof SubcommandGroup | "" = ""> =
  Unwrap<
    Omit<
      {
        builder: SlashCommandSubcommandGroupBuilder
        nameLocalizations(
          localizations: Partial<Record<LocaleString, Lowercase<string>>>,
        ): SubcommandGroup<Keys | "nameLocalizations">
        descriptionLocalizations(
          localizations: Partial<Record<LocaleString, string>>,
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
      builder: SlashCommandSubcommandGroupBuilder
      subcommands: Record<Lowercase<string>, PartialSubcommand>
      nameLocalizations(
        localizations: Partial<Record<LocaleString, Lowercase<string>>>,
      ): SubcommandGroupWithSubcommands<Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<LocaleString, string>>,
      ): SubcommandGroupWithSubcommands<Keys | "descriptionLocalizations">
    },
    Keys
  >
>

export type PartialSubcommandGroup = Pick<
  SubcommandGroupWithSubcommands,
  "builder" | "subcommands"
>
