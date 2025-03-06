/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { CompletedCommand, Module } from "../external.mjs"

export function module(name: string): Module {
  const commands = new Map<string, CompletedCommand>()

  return {
    name,
    commands,
    addCommand(command) {
      commands.set(command.name, command)
      return this
    },
  }
}
