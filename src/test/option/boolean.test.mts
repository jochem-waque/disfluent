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

await suite("testBoolean", async () => {
  await test("base", () => {
    const option = d.option("option").boolean()

    const pass: Equal<boolean | undefined, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("required", () => {
    const option = d.option("option").boolean().required()

    const pass: Equal<boolean, OptionValue<typeof option>> = true

    assert.ok(pass)
  })
})
