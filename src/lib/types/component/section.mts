/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { APISectionComponent, SectionBuilder } from "discord.js"
import type { Unwrap } from "../util.mts"
import type { Button } from "./button.mts"

type Accessory = Button

export type Section<Keys extends keyof Section | "" = ""> = Unwrap<
  Omit<
    {
      builder: SectionBuilder
      accessory(accessory: Accessory): Section<Keys | "accessory">
      build(): APISectionComponent
    },
    Keys
  >
>
