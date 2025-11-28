/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  ActionRowBuilder,
  ButtonBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js"
import type { Row } from "../../external.mts"

export function row(
  ...components:
    | [MessageActionRowComponentBuilder]
    | [ButtonBuilder, ButtonBuilder]
    | [ButtonBuilder, ButtonBuilder, ButtonBuilder]
    | [ButtonBuilder, ButtonBuilder, ButtonBuilder, ButtonBuilder]
    | [
        ButtonBuilder,
        ButtonBuilder,
        ButtonBuilder,
        ButtonBuilder,
        ButtonBuilder,
      ]
): Row {
  return {
    builder:
      new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(
        components,
      ),
    id(id) {
      this.builder.setId(id)
      return this
    },
    build() {
      return this.builder.toJSON()
    },
  }
}
