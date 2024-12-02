/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { LocaleString, SlashCommandSubcommandGroupBuilder } from "discord.js"
import { PartialSubcommand } from "./subcommand.mjs"
import { LowercaseKeys, NotEmpty, Unwrap } from "./util.mjs"

export type SubcommandGroup<
  Keys extends keyof SubcommandGroup | "" = "",
  Subcommands extends boolean = false,
> = Unwrap<
  Omit<
    {
      builder: SlashCommandSubcommandGroupBuilder
      nameLocalizations(
        localizations: Partial<Record<LocaleString, Lowercase<string>>>,
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

export type PartialSubcommandGroup = Pick<
  SubcommandGroup<"", true>,
  "builder" | "subcommands"
>
