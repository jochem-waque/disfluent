/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type {
  APIActionRowComponent,
  APIActionRowComponentTypes,
  APIButtonComponent,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentEmojiResolvable,
  ComponentType,
} from "discord.js"
import type { Unwrap } from "./util.mts"

type InteractionMap = {
  [ComponentType.Button]: ButtonInteraction
}

type DataMap = {
  [ComponentType.Button]: APIButtonComponent
}

type ComponentHandler<
  Type extends keyof InteractionMap,
  Arguments extends readonly string[],
> = (interaction: InteractionMap[Type], ...args: Arguments) => Promise<void>

export type CompletedComponent<
  Type extends keyof InteractionMap = keyof InteractionMap,
  Arguments extends readonly string[] = string[],
> = {
  id: string
  type: Type
  build(...args: Arguments): DataMap[Type]
  handle(interaction: InteractionMap[Type], ...args: Arguments): Promise<void>
}

export type ComponentSelector = {
  row<Type extends APIActionRowComponentTypes>(
    component: Type,
    ...rest: Type[]
  ): APIActionRowComponent<Type>
  button(style: ButtonStyle): Button<"handler">
}

export type Button<Keys extends keyof Button | "" = ""> = Unwrap<
  Omit<
    {
      builder: ButtonBuilder
      id(id: string): Button<Exclude<Keys, "handler"> | "id" | "url">
      disabled(): Button<Keys | "disabled">
      emoji(emoji: ComponentEmojiResolvable): Button<Keys | "emoji">
      label(label: string): Button<Keys | "label">
      url(url: URL): DataMap[ComponentType.Button]
      handler<Arguments extends readonly string[]>(
        handler: ComponentHandler<ComponentType.Button, Arguments>,
      ): CompletedComponent<ComponentType.Button, Arguments>
    },
    Keys
  >
>

export type Row<Keys extends keyof Row | "" = ""> = Unwrap<
  Omit<
    {
      components(): Row<Keys | "components">
      button(): Button
    },
    Keys
  >
>
