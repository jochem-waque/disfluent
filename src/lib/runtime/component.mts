/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ButtonBuilder, ButtonStyle, ComponentType } from "discord.js"
import type { Button, ComponentSelector } from "../types/component.mts"
import { InternalError } from "./error.mts"

export function component(): ComponentSelector {
  return {
    row(component, ...rest) {
      return {
        type: ComponentType.ActionRow,
        components: [component, ...rest],
      }
    },
    button,
  }
}

function button(style: ButtonStyle): Button<"handler"> {
  return {
    builder: new ButtonBuilder().setStyle(style),
    id(id) {
      this.builder.setCustomId(id)
      return {
        ...this,
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
            build(...args: readonly string[]) {
              return new ButtonBuilder(base)
                .setCustomId(base.custom_id + ":" + args.join(":"))
                .toJSON()
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
      return this.builder.setURL(url.toString()).toJSON()
    },
  }
}

// function input() {}

// function select() {
//   return {
//     string,
//     user,
//     mentionable,
//     channel,
//   }
// }

// function string() {}
// function user() {}
// function mentionable() {}
// function channel() {}
