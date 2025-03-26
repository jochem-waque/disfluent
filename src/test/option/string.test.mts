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

await suite("testString", async () => {
  await test("base", () => {
    const description = "Option description"

    const option = d.option(description).string()

    assert.strictEqual(option.builder.type, ApplicationCommandOptionType.String)

    assert.strictEqual(option.builder.description, description)

    const pass: Equal<string | undefined, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("required", () => {
    const option = d.option("Description").string().required()

    assert.ok(option.builder.required)

    const pass: Equal<string, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("choices", () => {
    const choices = { 1: "first", 2: "second" } as const

    const option = d.option("Description").string().choices(choices)

    assert.deepStrictEqual(
      option.builder.choices?.reduce((prev, cur) => {
        return { ...prev, [cur.name]: cur.value }
      }, {}),
      choices,
    )

    const pass: Equal<
      "first" | "second" | undefined,
      OptionValue<typeof option>
    > = true

    assert.ok(pass)
  })

  await test("choicesRequired", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const option = d
      .option("Description")
      .string()
      .choices({ 1: "first", 2: "second" })
      .required()

    const pass: Equal<"first" | "second", OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("maxLength", () => {
    const value = 10

    const option = d.option("Description").string().maxLength(value)

    assert.strictEqual(option.builder.max_length, value)
  })

  await test("minLength", () => {
    const value = 10

    const option = d.option("Description").string().minLength(value)

    assert.strictEqual(option.builder.min_length, value)
  })
})
