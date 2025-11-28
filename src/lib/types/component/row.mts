/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type {
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js"
import type { Unwrap } from "../util.mts"

export type Row<Keys extends keyof Row | "" = ""> = Unwrap<
  Omit<
    {
      builder: ActionRowBuilder<MessageActionRowComponentBuilder>
      id(id: number): Row<Keys | "id">
      build(): ReturnType<
        ActionRowBuilder<MessageActionRowComponentBuilder>["toJSON"]
      >
    },
    Keys
  >
>
