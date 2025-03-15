/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { GuildMember, Role, User } from "discord.js"
import assert from "node:assert"
import { suite, test } from "node:test"
import d, { type OptionValue } from "../../index.mts"
import type { Equal } from "../shared.mts"

await suite("testMentionable", async () => {
  await test("base", () => {
    const option = d.option("option").mentionable()

    const pass: Equal<
      GuildMember | User | Role | undefined,
      OptionValue<typeof option>
    > = true

    assert.ok(pass)
  })

  await test("required", () => {
    const option = d.option("option").mentionable().required()

    const pass: Equal<
      GuildMember | User | Role,
      OptionValue<typeof option>
    > = true

    assert.ok(pass)
  })
})
