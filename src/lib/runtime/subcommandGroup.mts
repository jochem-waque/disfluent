/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { SlashCommandSubcommandGroupBuilder } from "discord.js"
import { PartialSubcommand } from "../types/subcommand.mjs"
import { SubcommandGroup } from "../types/subcommandGroup.mjs"

export function subcommandGroup(description: string): SubcommandGroup {
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
    subcommands(subcommands: Record<Lowercase<string>, PartialSubcommand>) {
      for (const [name, { builder }] of Object.entries(subcommands)) {
        builder.setName(name)
        this.builder.addSubcommand(builder)
      }

      return {
        ...this,
        subcommands,
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
