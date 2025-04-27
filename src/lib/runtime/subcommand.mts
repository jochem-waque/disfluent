/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { SlashCommandSubcommandBuilder } from "discord.js"
import type { OptionValues } from "../types/option.mts"
import type { Subcommand } from "../types/subcommand.mts"
import { applyOptions, getOptionValue } from "./internal.mts"

export function subcommand(
  description: string,
): Subcommand<undefined, "handle" | "~options"> {
  return {
    builder: new SlashCommandSubcommandBuilder().setDescription(description),
    nameLocalizations(localizations) {
      this.builder.setNameLocalizations(localizations)
      return this
    },
    descriptionLocalizations(localizations) {
      this.builder.setDescriptionLocalizations(localizations)
      return this
    },
    options(options) {
      applyOptions(this.builder, options)

      return {
        ...this,
        "~options": options,
        handler(handler) {
          return {
            ...this,
            async handle(interaction) {
              const values = Object.fromEntries(
                Object.entries(options).map(([key, option]) => [
                  key,
                  getOptionValue(interaction, option),
                ]),
              ) as OptionValues<typeof options>
              await handler(interaction, values)
            },
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
    handler(handler) {
      return {
        ...this,
        handle: handler,
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
