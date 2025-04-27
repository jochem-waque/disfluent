/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type {
  APIContainerComponent,
  ContainerBuilder,
  ContainerComponentBuilder,
  RGBTuple,
} from "discord.js"
import type { Unwrap } from "../util.mts"

export type ContainerComponent = {
  builder: ContainerComponentBuilder
}

export type Container<Keys extends keyof Container | "" = ""> = Unwrap<
  Omit<
    {
      builder: ContainerBuilder
      accent(color: RGBTuple | number): Container<Keys | "accent">
      spoiler(): Container<Keys | "spoiler">
      build(): APIContainerComponent
    },
    Keys
  >
>
