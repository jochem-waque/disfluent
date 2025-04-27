/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  ButtonBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
} from "discord.js"
import type { Accessory, Section } from "../../types/component/section.mts"
import type { Text } from "../../types/component/text.mts"

export function section(
  text: Pick<Text, "builder">,
  accessory: Accessory,
): Section
export function section(
  text: Pick<Text, "builder">,
  text2: Pick<Text, "builder">,
  accessory: Accessory,
): Section
export function section(
  text: Pick<Text, "builder">,
  text2: Pick<Text, "builder">,
  text3: Pick<Text, "builder">,
  accessory: Accessory,
): Section
export function section(
  ...components: (Pick<Text, "builder"> | Accessory)[]
): Section {
  const builder = new SectionBuilder().addTextDisplayComponents(
    ...components
      .filter((component) => "builder" in component)
      .map((component) => component.builder)
      .filter((builder) => builder instanceof TextDisplayBuilder),
  )

  const last = components.at(-1)
  switch (true) {
    case last instanceof ButtonBuilder:
      builder.setButtonAccessory(last)
      break
    case last && "builder" in last && last.builder instanceof ThumbnailBuilder:
      builder.setThumbnailAccessory(last.builder)
  }

  return {
    builder,
    id(id) {
      this.builder.setId(id)
      return this
    },
    build() {
      return this.builder.toJSON()
    },
  }
}
