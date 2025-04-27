/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type {
  APISectionComponent,
  ButtonBuilder,
  SectionBuilder,
} from "discord.js"
import type { Unwrap } from "../util.mts"
import type { Thumbnail } from "./thumbnail.mts"

export type Accessory = ButtonBuilder | Pick<Thumbnail, "builder">

export type Section<Keys extends keyof Section | "" = ""> = Unwrap<
  Omit<
    {
      builder: SectionBuilder
      id(id: number): Section<Keys | "id">
      build(): APISectionComponent
    },
    Keys
  >
>
