/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { Attachment } from "discord.js"
import assert from "node:assert"
import { suite, test } from "node:test"
import d, { type OptionValue } from "../../index.mts"
import type { Equal } from "../shared.mts"

await suite("testAttachment", async () => {
  await test("base", () => {
    const option = d.option("option").attachment()

    const pass: Equal<Attachment | undefined, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("required", () => {
    const option = d.option("option").attachment().required()

    const pass: Equal<Attachment, OptionValue<typeof option>> = true

    assert.ok(pass)
  })
})
