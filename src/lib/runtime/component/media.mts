/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { MediaGalleryItemBuilder } from "discord.js"
import type { Media } from "../../types/component/media.mts"

export function media(url: string): Media {
  return {
    builder: new MediaGalleryItemBuilder().setURL(url),
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
