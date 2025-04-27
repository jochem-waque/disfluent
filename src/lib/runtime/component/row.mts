/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ActionRowBuilder, type AnyComponentBuilder } from "discord.js"
import type { Row } from "../../external.mts"

export function row<Type extends AnyComponentBuilder>(
  ...components: Type[]
): Row<Type> {
  return {
    builder: new ActionRowBuilder<Type>().setComponents(components),
    build() {
      return this.builder.toJSON()
    },
  }
}
