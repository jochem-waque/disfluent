/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { ActionRowBuilder, AnyComponentBuilder } from "discord.js"
import type { Unwrap } from "../util.mts"

export type Row<
  Type extends AnyComponentBuilder,
  Keys extends keyof Row<Type> | "" = "",
> = Unwrap<
  Omit<
    {
      builder: ActionRowBuilder<Type>
      id(id: number): Row<Type, Keys | "id">
      build(): ReturnType<ActionRowBuilder<Type>["toJSON"]>
    },
    Keys
  >
>
