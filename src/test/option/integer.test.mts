/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import assert from "node:assert"
import { suite, test } from "node:test"
import d, { type OptionValue } from "../../index.mts"
import type { Equal } from "../shared.mts"

await suite("testInteger", async () => {
  await test("base", () => {
    const option = d.option("option").integer()

    const pass: Equal<number | undefined, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("required", () => {
    const option = d.option("option").integer().required()

    const pass: Equal<number, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("choices", () => {
    const option = d.option("option").integer().choices({ first: 1, second: 2 })

    const pass: Equal<1 | 2 | undefined, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("choicesRequired", () => {
    const option = d
      .option("option")
      .integer()
      .choices({ first: 1, second: 2 })
      .required()

    const pass: Equal<1 | 2, OptionValue<typeof option>> = true

    assert.ok(pass)
  })
})
