/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { SeparatorBuilder } from "discord.js"
import type { Separator } from "../../types/component/separator.mts"

export function separator(): Separator {
  return {
    builder: new SeparatorBuilder(),
    id(id) {
      this.builder.setId(id)
      return this
    },
    divider() {
      this.builder.setDivider(true)
      return this
    },
    spacing(spacing) {
      this.builder.setSpacing(spacing)
      return this
    },
    build() {
      return this.builder.toJSON()
    },
  }
}
