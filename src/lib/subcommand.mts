/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js"
import {
  Subcommand,
  OptionValues,
  SubcommandGroup,
  PartialSubcommand,
  getOptionValue,
} from "./internal.mjs"

export function subcommand(description: string): Subcommand {
  return {
    builder: new SlashCommandSubcommandBuilder().setDescription(description),
    options(options) {
      return {
        ...this,
        options,
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
          }
        },
      }
    },
    handler(handler) {
      return { ...this, handle: handler }
    },
  }
}

export function subcommandGroup(description: string): SubcommandGroup {
  return {
    builder: new SlashCommandSubcommandGroupBuilder().setDescription(
      description,
    ),
    subcommands(subcommands: Record<Lowercase<string>, PartialSubcommand>) {
      for (const [name, { builder }] of Object.entries(subcommands)) {
        builder.setName(name)
        this.builder.addSubcommand(builder)
      }

      return {
        ...this,
        subcommands,
      }
    },
  }
}
