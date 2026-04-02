/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ButtonBuilder, ButtonStyle } from "discord.js"
import type { Button } from "../../types/component/button.mts"
import { InternalError } from "../error.mts"
import { Components } from "../internal.mts"

export function button(url: URL): Button<"style" | "url" | "handler">
export function button(customId: string): Button<"url" | "handler">

export function button(urlOrCustomId: string | URL) {
  if (urlOrCustomId instanceof URL) {
    return {
      builder: new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(urlOrCustomId.toString()),
      id(id) {
        this.builder.setId(id)
        return this
      },
      disabled() {
        this.builder.setDisabled(true)
        return this
      },
      emoji(emoji) {
        this.builder.setEmoji(emoji)
        return this
      },
      label(label) {
        this.builder.setLabel(label)
        return this
      },
    } satisfies Button<"style" | "url" | "handler"> as Button<
      "style" | "url" | "handler"
    >
  }

  return {
    builder: new ButtonBuilder().setCustomId(urlOrCustomId),
    id(id) {
      this.builder.setId(id)
      return this
    },
    style(style) {
      this.builder.setStyle(style)

      return {
        ...this,
        id(id) {
          this.builder.setId(id)
          return this
        },
        disabled() {
          this.builder.setDisabled(true)
          return this
        },
        emoji(emoji) {
          this.builder.setEmoji(emoji)
          return this
        },
        label(label) {
          this.builder.setLabel(label)
          return this
        },
        handler(handle) {
          const base = this.builder.toJSON()
          if (!("custom_id" in base) || !base.custom_id) {
            throw new InternalError(
              "missing_custom_id",
              "Can't set handler for button component without a custom ID",
            )
          }

          const component = {
            id: base.custom_id,
            type: base.type,
            with(...args: readonly string[]) {
              return new ButtonBuilder(base).setCustomId(
                [base.custom_id, ...args].join(":"),
              )
            },
            handle,
          }

          Components.set(urlOrCustomId, component)

          return component
        },
      }
    },
    disabled() {
      this.builder.setDisabled(true)
      return this
    },
    emoji(emoji) {
      this.builder.setEmoji(emoji)
      return this
    },
    label(label) {
      this.builder.setLabel(label)
      return this
    },
  } satisfies Button<"url" | "handler">
}
