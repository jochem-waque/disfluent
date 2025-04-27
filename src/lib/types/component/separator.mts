/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type {
  APISeparatorComponent,
  SeparatorBuilder,
  SeparatorSpacingSize,
} from "discord.js"
import type { Unwrap } from "../util.mts"

export type Separator<Keys extends keyof Separator | "" = ""> = Unwrap<
  Omit<
    {
      builder: SeparatorBuilder
      id(id: number): Separator<Keys | "id">
      divider(): Separator<Keys | "divider">
      spacing(spacing: SeparatorSpacingSize): Separator<Keys | "spacing">
      build(): APISeparatorComponent
    },
    Keys
  >
>
