/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  ComponentType,
  type APIActionRowComponent,
  type APIComponentInActionRow,
} from "discord.js"

export function row<Type extends APIComponentInActionRow>(
  ...components: Type[]
): APIActionRowComponent<Type> {
  return {
    type: ComponentType.ActionRow,
    components,
  }
}
