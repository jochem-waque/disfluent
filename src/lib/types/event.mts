/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { ClientEvents } from "discord.js"
import type { Unwrap } from "./util.mts"

export type EventHandler<
  Event extends keyof ClientEvents,
  Keys extends keyof EventHandler<Event> | "" = "",
> = Unwrap<
  Omit<
    {
      readonly event: Event
      once(): EventHandler<Event, Keys | "once">
      handler(
        handler: (...params: ClientEvents[Event]) => void | Promise<void>,
      ): EventHandler<Event, Exclude<Keys, "handle"> | "handler">
      handle(...params: ClientEvents[Event]): void | Promise<void>
    },
    Keys
  >
>

export type CompletedEventHandler = EventHandler<
  keyof ClientEvents,
  "handler" | "once"
> & { readonly once?: unknown }
