/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { ClientEvents } from "discord.js"
import type { EventHandler } from "../external.mts"

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
