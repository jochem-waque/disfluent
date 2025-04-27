/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { APITextDisplayComponent, TextDisplayBuilder } from "discord.js"
import type { Unwrap } from "../util.mts"

export type Text<Keys extends keyof Text | "" = ""> = Unwrap<
  Omit<
    {
      builder: TextDisplayBuilder
      id(id: number): Text<Keys | "id">
      build(): APITextDisplayComponent
    },
    Keys
  >
>
