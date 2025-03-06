/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  ApplicationCommandType,
  AutocompleteInteraction,
  CommandInteraction,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
} from "discord.js"
import { CompletedEventHandler } from "./event.mjs"
import { Unwrap } from "./util.mjs"

export type Module<Keys extends keyof Module | "" = ""> = Unwrap<
  Omit<
    {
      readonly name: string
      readonly commands: ReadonlyMap<string, CompletedCommand>
      readonly events: readonly CompletedEventHandler[]
      addCommand(command: CompletedCommand): Module<Keys>
      addEventHandler(handler: CompletedEventHandler): Module<Keys>
    },
    Keys
  >
>

export type CompletedCommand = {
  name: string
  builder: SlashCommandBuilder | ContextMenuCommandBuilder
  type: ApplicationCommandType
  handle: (interaction: CommandInteraction) => Promise<void>
  autocomplete: (interaction: AutocompleteInteraction) => Promise<void>
}
