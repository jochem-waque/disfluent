/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Locale, SlashCommandSubcommandGroupBuilder } from "discord.js"
import type { PartialSubcommand } from "./subcommand.mts"
import type { LowercaseKeys, NotEmpty, Unwrap } from "./util.mts"

export type SubcommandGroup<
  Subcommands extends Record<string, PartialSubcommand> | undefined = undefined,
  Keys extends keyof SubcommandGroup | "" = "",
> = Unwrap<
  Omit<
    {
      readonly "~subcommands": Subcommands
      readonly builder: SlashCommandSubcommandGroupBuilder
      nameLocalizations(
        localizations: Partial<Record<Locale, Lowercase<string>>>,
      ): SubcommandGroup<Subcommands, Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<Locale, string>>,
      ): SubcommandGroup<Subcommands, Keys | "descriptionLocalizations">
      subcommands<NewSubcommands extends Record<string, PartialSubcommand>>(
        subcommands: NotEmpty<LowercaseKeys<NewSubcommands>>,
      ): SubcommandGroup<
        NotEmpty<LowercaseKeys<NewSubcommands>>,
        Exclude<Keys, "~subcommands"> | "subcommands"
      >
    },
    Keys
  >
>

export type PartialSubcommandGroup = Pick<
  SubcommandGroup<Record<string, PartialSubcommand>>,
  "builder" | "~subcommands"
>
