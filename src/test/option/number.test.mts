/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ApplicationCommandOptionType } from "discord.js"
import assert from "node:assert"
import { suite, test } from "node:test"
import d, { type OptionValue } from "../../index.mts"
import type { Equal } from "../util.mts"

await suite("testNumber", async () => {
  await test("base", () => {
    const description = "Option description"

    const option = d.option(description).number()

    assert.strictEqual(option.builder.type, ApplicationCommandOptionType.Number)

    assert.strictEqual(option.builder.description, description)

    const pass: Equal<number | undefined, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("required", () => {
    const option = d.option("Description").number().required()

    assert.ok(option.builder.required)

    const pass: Equal<number, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("choices", () => {
    const choices = { first: 1, second: 2 } as const

    const option = d.option("Description").number().choices(choices)

    assert.deepStrictEqual(
      option.builder.choices?.reduce((prev, cur) => {
        return { ...prev, [cur.name]: cur.value }
      }, {}),
      choices,
    )

    const pass: Equal<1 | 2 | undefined, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("choicesRequired", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const option = d
      .option("Description")
      .number()
      .choices({ first: 1, second: 2 })
      .required()

    const pass: Equal<1 | 2, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("maxValue", () => {
    const value = 10

    const option = d.option("Description").number().maxValue(value)

    assert.strictEqual(option.builder.max_value, value)
  })

  await test("minValue", () => {
    const value = 10

    const option = d.option("Description").number().minValue(value)

    assert.strictEqual(option.builder.min_value, value)
  })
})
