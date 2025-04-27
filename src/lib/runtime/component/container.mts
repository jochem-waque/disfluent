/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ContainerBuilder } from "discord.js"
import type {
  Container,
  ContainerComponent,
} from "../../types/component/container.mts"

export function container(components: ContainerComponent[]): Container {
  return {
    builder: new ContainerBuilder().spliceComponents(
      0,
      0,
      ...components.map((component) => component.builder),
    ),
    accent(color) {
      this.builder.setAccentColor(color)
      return this
    },
    spoiler() {
      this.builder.setSpoiler(true)
      return this
    },
    build() {
      return this.builder.toJSON()
    },
  }
}
