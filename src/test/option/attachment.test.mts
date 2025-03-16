/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ApplicationCommandOptionType, Attachment } from "discord.js"
import assert from "node:assert"
import { suite, test } from "node:test"
import d, { type OptionValue } from "../../index.mts"
import type { Equal } from "../util.mts"

await suite("testAttachment", async () => {
  await test("base", () => {
    const description = "Option description"

    const option = d.option(description).attachment()

    assert.strictEqual(
      option.builder.type,
      ApplicationCommandOptionType.Attachment,
    )

    assert.strictEqual(option.builder.description, description)

    const pass: Equal<Attachment | undefined, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("required", () => {
    const option = d.option("description").attachment().required()

    assert.ok(option.builder.required)

    const pass: Equal<Attachment, OptionValue<typeof option>> = true

    assert.ok(pass)
  })
})
