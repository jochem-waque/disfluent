/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { MediaGalleryItemBuilder } from "discord.js"
import type { Unwrap } from "../util.mts"

export type Media<Keys extends keyof Media | "" = ""> = Unwrap<
  Omit<
    {
      builder: MediaGalleryItemBuilder
      description(description: string): Media<Keys | "description">
      spoiler(): Media<Keys | "spoiler">
    },
    Keys
  >
>
