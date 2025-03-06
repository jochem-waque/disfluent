/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ClientEvents } from "discord.js"
import { EventHandler } from "../external.mjs"

export function event<Event extends keyof ClientEvents>(
  event: Event,
): EventHandler<Event, "handle"> {
  return {
    event,
    once() {
      return {
        ...this,
        once: true,
      }
    },
    handler(fn) {
      return {
        ...this,
        handle: fn,
        once() {
          return {
            ...this,
            once: true,
          }
        },
      }
    },
  }
}
