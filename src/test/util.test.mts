/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import assert from "node:assert"
import { suite, test } from "node:test"
import { arrayEqual } from "./util.mts"

await suite("testArrayEqual", async () => {
  await test("empty", () => {
    assert.ok(arrayEqual([], []))
  })

  await test("single", () => {
    assert.ok(arrayEqual([1], [1]))
  })

  await test("singleFail", () => {
    assert.ok(!arrayEqual([1], [2]))
  })

  await test("duplicate", () => {
    assert.ok(arrayEqual([1, 1], [1, 1]))
  })

  await test("multiple", () => {
    assert.ok(arrayEqual([1, 2], [1, 2]))
  })

  await test("multipleFail", () => {
    assert.ok(!arrayEqual([1, 2], [1, 3]))
  })

  await test("order", () => {
    assert.ok(arrayEqual([2, 1], [1, 2]))
  })
})
