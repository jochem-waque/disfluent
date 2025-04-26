/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { SlashCommandSubcommandGroupBuilder } from "discord.js"
import type { PartialSubcommand } from "../types/subcommand.mts"
import type { SubcommandGroup } from "../types/subcommandGroup.mts"

export function subcommandGroup(
  description: string,
): SubcommandGroup<undefined, "~subcommands"> {
  return {
    builder: new SlashCommandSubcommandGroupBuilder().setDescription(
      description,
    ),
    nameLocalizations(localizations) {
      this.builder.setNameLocalizations(localizations)
      return this
    },
    descriptionLocalizations(localizations) {
      this.builder.setDescriptionLocalizations(localizations)
      return this
    },
    subcommands(subcommands) {
      for (const [name, { builder }] of Object.entries(
        subcommands as Record<Lowercase<string>, PartialSubcommand>,
      )) {
        builder.setName(name)
        this.builder.addSubcommand(builder)
      }

      return {
        ...this,
        "~subcommands": subcommands,
        nameLocalizations(localizations) {
          this.builder.setNameLocalizations(localizations)
          return this
        },
        descriptionLocalizations(localizations) {
          this.builder.setDescriptionLocalizations(localizations)
          return this
        },
      }
    },
  }
}
