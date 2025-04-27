/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { TextDisplayBuilder } from "discord.js"
import type { Text } from "../../types/component/text.mts"

export function text(content: string): Text {
  return {
    builder: new TextDisplayBuilder().setContent(content),
    build() {
      return this.builder.toJSON()
    },
  }
}
