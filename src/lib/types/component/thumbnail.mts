/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { ThumbnailBuilder } from "discord.js"
import type { Unwrap } from "../util.mts"

export type Thumbnail<Keys extends keyof Thumbnail | "" = ""> = Unwrap<
  Omit<
    {
      builder: ThumbnailBuilder
      id(id: number): Thumbnail<Keys | "id">
      description(description: string): Thumbnail<Keys | "description">
      spoiler(): Thumbnail<Keys | "spoiler">
    },
    Keys
  >
>
