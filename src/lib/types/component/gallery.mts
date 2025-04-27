/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { APIMediaGalleryComponent, MediaGalleryBuilder } from "discord.js"
import type { Unwrap } from "../util.mts"

export type Gallery<Keys extends keyof Gallery | "" = ""> = Unwrap<
  Omit<
    {
      builder: MediaGalleryBuilder
      build(): APIMediaGalleryComponent
    },
    Keys
  >
>
