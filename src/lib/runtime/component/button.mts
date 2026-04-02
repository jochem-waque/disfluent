/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ButtonBuilder, ButtonStyle } from "discord.js"
import type { Button } from "../../types/component/button.mts"
import { InternalError } from "../error.mts"
import { Components } from "../internal.mts"

export function button(style: ButtonStyle.Link): Button<"customId" | "handler">
export function button(
  style: Exclude<ButtonStyle, ButtonStyle.Link>,
): Button<"url" | "handler">
export function button(style: ButtonStyle) {
  if (style === ButtonStyle.Link) {
    return {
      builder: new ButtonBuilder().setStyle(style),
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
      url(url) {
        this.builder.setURL(url.toString())
        return this.builder
      },
    } satisfies Button<"customId" | "handler"> as Button<"customId" | "handler">
  }

  return {
    builder: new ButtonBuilder().setStyle(style),
    customId(id) {
      this.builder.setCustomId(id)

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

          Components.set(id, component)

          return component
        },
      }
    },
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
  } satisfies Button<"url" | "handler"> as Button<"url" | "handler">
}
