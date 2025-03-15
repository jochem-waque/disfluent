/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  ChannelType,
  type GuildBasedChannel,
  TextChannel,
  VoiceChannel,
} from "discord.js"
import assert from "node:assert"
import { suite, test } from "node:test"
import d, { type OptionValue } from "../../index.mts"
import type { Equal } from "../shared.mts"

await suite("testChannel", async () => {
  await test("base", () => {
    const option = d.option("option").channel()

    const pass: Equal<
      GuildBasedChannel | undefined,
      OptionValue<typeof option>
    > = true

    assert.ok(pass)
  })

  await test("required", () => {
    const option = d.option("option").channel().required()

    const pass: Equal<GuildBasedChannel, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("channelTypes", () => {
    const option = d
      .option("option")
      .channel()
      .channelTypes(ChannelType.GuildText, ChannelType.GuildVoice)

    const pass: Equal<
      TextChannel | VoiceChannel | undefined,
      OptionValue<typeof option>
    > = true

    assert.ok(pass)
  })

  await test("channelTypesRequired", () => {
    const option = d
      .option("option")
      .channel()
      .channelTypes(ChannelType.GuildText, ChannelType.GuildVoice)
      .required()

    const pass: Equal<
      TextChannel | VoiceChannel,
      OptionValue<typeof option>
    > = true

    assert.ok(pass)
  })
})
