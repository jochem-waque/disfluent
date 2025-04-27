/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ApplicationCommandOptionType } from "discord.js"
import assert from "node:assert"
import { suite, test } from "node:test"
import d, { type OptionValue } from "../../index.mts"
import type { Equal } from "../util.mts"

await suite("testBoolean", async () => {
  await test("base", () => {
    const description = "Option description"

    const option = d.option(description).boolean()

    assert.strictEqual(
      option.builder.type,
      ApplicationCommandOptionType.Boolean,
    )

    assert.strictEqual(option.builder.description, description)

    const pass: Equal<boolean | undefined, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("required", () => {
    const option = d.option("Description").boolean().required()

    assert.ok(option.builder.required)

    const pass: Equal<boolean, OptionValue<typeof option>> = true

    assert.ok(pass)
  })
})
