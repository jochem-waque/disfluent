/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ButtonBuilder, ButtonStyle } from "discord.js"
import type { Button } from "../../types/component/button.mts"
import { InternalError } from "../error.mts"

export function button(customId: string): Button<"handler"> {
  return {
    builder: new ButtonBuilder().setCustomId(customId),
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

          return {
            id: base.custom_id,
            type: base.type,
            with(...args: readonly string[]) {
              return new ButtonBuilder(base).setCustomId(
                [base.custom_id, ...args].join(":"),
              )
            },
            handle,
          }
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
    url(url) {
      return this.builder.setStyle(ButtonStyle.Link).setURL(url.toString())
    },
  }
}
