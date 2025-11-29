/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type {
  CompletedCommand,
  CompletedEventHandler,
  Module,
} from "../external.mts"

export function module(name: string): Module {
  const commands = new Map<string, CompletedCommand>()
  const events: CompletedEventHandler[] = []

  return {
    name,
    commands,
    events,
    addCommand(command) {
      commands.set(command.name, command)
      return this
    },
    addEventHandler(handler) {
      events.push(handler)
      return this
    },
  }
}
