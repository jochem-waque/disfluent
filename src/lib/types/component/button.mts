/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { ComponentEmojiResolvable, ComponentType } from "discord.js"
import type { Unwrap } from "../util.mts"
import type {
  APIComponent,
  BuilderMap,
  ComponentBuilder,
  ComponentHandler,
} from "./shared.mts"

export type Button<Keys extends keyof Button | "" = ""> = Unwrap<
  Omit<
    {
      readonly builder: BuilderMap<ComponentType.Button>
      id(id: number): Button<Keys | "id">
      customId(
        customId: string,
      ): Button<Exclude<Keys, "handler"> | "customId" | "url">
      disabled(): Button<Keys | "disabled">
      emoji(emoji: ComponentEmojiResolvable): Button<Keys | "emoji">
      label(label: string): Button<Keys | "label">
      url(url: URL): APIComponent<ComponentType.Button>
      handler<Arguments extends readonly string[]>(
        handler: ComponentHandler<ComponentType.Button, undefined, Arguments>,
      ): ComponentBuilder<ComponentType.Button, undefined, Arguments>
    },
    Keys
  >
>
