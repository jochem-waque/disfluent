/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type {
  APIFileComponent,
  ChatInputCommandInteraction,
  FileBuilder,
} from "discord.js"
import { container } from "../../runtime/component/container.mts"
import type { Unwrap } from "../util.mts"

export type File<Keys extends keyof File | "" = ""> = Unwrap<
  Omit<
    {
      builder: FileBuilder
      spoiler(): File<Keys | "spoiler">
      build(): APIFileComponent
    },
    Keys
  >
>

const test: ChatInputCommandInteraction =
  {} as unknown as ChatInputCommandInteraction
await test.reply({
  components: [container([]).builder.toJSON()],
})
