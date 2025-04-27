/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { FileBuilder } from "discord.js"
import type { File } from "../../types/component/file.mts"

export function file(url: `attachment://${string}`): File {
  return {
    builder: new FileBuilder().setURL(url),
    spoiler() {
      this.builder.setSpoiler(true)
      return this
    },
    build() {
      return this.builder.toJSON()
    },
  }
}
