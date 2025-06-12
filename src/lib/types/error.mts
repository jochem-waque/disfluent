/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type {
  AutocompleteInteraction,
  CommandInteraction,
  ComponentType,
} from "discord.js"
import type {
  ComponentBuilder,
  ComponentInteraction,
} from "./component/shared.mts"
import type { CompletedEventHandler } from "./event.mts"
import type { CompletedCommand } from "./module.mts"

export type ErrorContext =
  | {
      error: unknown
      interaction: CommandInteraction | AutocompleteInteraction
      command: CompletedCommand
    }
  | {
      error: unknown
      interaction: ComponentInteraction<ComponentType>
      component: ComponentBuilder
    }
  | {
      error: unknown
      handler: CompletedEventHandler
      handlerParameters: unknown[]
    }
  | { error: unknown }

export type ErrorCode =
  | "command_not_autocompletable"
  | "option_not_autocompletable"
  | "option_not_found"
  | "subcommand_group_not_found"
  | "subcommand_not_found"
  | "unsupported_option_type"
  | "could_not_register"
  | "missing_custom_id"
  | "duplicate_custom_id"
  | "client_not_ready"
