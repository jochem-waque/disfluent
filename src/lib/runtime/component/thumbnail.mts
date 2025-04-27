/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ThumbnailBuilder } from "discord.js"
import type { Thumbnail } from "../../types/component/thumbnail.mts"

export function thumbnail(url: string): Thumbnail {
  return {
    builder: new ThumbnailBuilder().setURL(url),
    id(id) {
      this.builder.setId(id)
      return this
    },
    description(description) {
      this.builder.setDescription(description)
      return this
    },
    spoiler() {
      this.builder.setSpoiler(true)
      return this
    },
  }
}
