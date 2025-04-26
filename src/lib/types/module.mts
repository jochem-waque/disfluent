/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  ApplicationCommandType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js"
import type { ComponentBuilder } from "./component/shared.mts"
import type { CompletedEventHandler } from "./event.mts"
import type { Unwrap } from "./util.mts"

export type Module<Keys extends keyof Module | "" = ""> = Unwrap<
  Omit<
    {
      readonly name: string
      readonly commands: ReadonlyMap<string, CompletedCommand>
      readonly events: readonly CompletedEventHandler[]
      readonly components: readonly ComponentBuilder[]
      addCommand(command: CompletedCommand): Module<Keys>
      addEventHandler(handler: CompletedEventHandler): Module<Keys>
      addComponent(component: ComponentBuilder): Module<Keys>
    },
    Keys
  >
>

export type CompletedCommand = {
  readonly name: string
} & (
  | {
      id?: string
      readonly builder: SlashCommandBuilder
      readonly type: ApplicationCommandType.ChatInput
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
      autocomplete: (interaction: AutocompleteInteraction) => Promise<void>
    }
  | {
      id?: string
      readonly builder: ContextMenuCommandBuilder
      readonly type: ApplicationCommandType.User
      handle: (interaction: UserContextMenuCommandInteraction) => Promise<void>
    }
  | {
      id?: string
      readonly builder: ContextMenuCommandBuilder
      readonly type: ApplicationCommandType.Message
      handle: (
        interaction: MessageContextMenuCommandInteraction,
      ) => Promise<void>
    }
)
