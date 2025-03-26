/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type {
  APIActionRowComponent,
  APIActionRowComponentTypes,
  APIMessageComponent,
  ButtonBuilder,
  ButtonStyle,
  ComponentEmojiResolvable,
  ComponentType,
  MessageComponentInteraction,
} from "discord.js"
import type { Unwrap } from "./util.mts"

type ComponentInteraction<Type extends ComponentType> =
  MessageComponentInteraction & { componentType: Type }

type APIComponent<Type extends ComponentType> = APIMessageComponent & {
  type: Type
}

type ComponentHandler<
  Type extends ComponentType,
  Arguments extends readonly string[],
> = (
  interaction: ComponentInteraction<Type>,
  ...args: Arguments
) => Promise<void>

export type CompletedComponent<
  Type extends ComponentType = ComponentType,
  Arguments extends readonly string[] = string[],
> = {
  readonly id: string
  readonly type: Type
  build(...args: Arguments): APIComponent<Type>
  handle(
    interaction: ComponentInteraction<Type>,
    ...args: Arguments
  ): Promise<void>
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
      readonly builder: ButtonBuilder
      id(id: string): Button<Exclude<Keys, "handler"> | "id" | "url">
      disabled(): Button<Keys | "disabled">
      emoji(emoji: ComponentEmojiResolvable): Button<Keys | "emoji">
      label(label: string): Button<Keys | "label">
      url(url: URL): APIComponent<ComponentType.Button>
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
