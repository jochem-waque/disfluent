/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { SectionBuilder } from "discord.js"
import type { Section } from "../../types/component/section.mts"
import type { Text } from "../../types/component/text.mts"

export function section(...components: Text[]): Section {
  return {
    builder: new SectionBuilder().addTextDisplayComponents(
      ...components.map((text) => text.builder),
    ),
    accessory(accessory) {
      this.builder.setButtonAccessory(accessory.builder)
      return this
    },
    build() {
      return this.builder.toJSON()
    },
  }
}
