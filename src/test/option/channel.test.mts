/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  ApplicationCommandOptionType,
  ChannelType,
  type GuildBasedChannel,
  TextChannel,
  VoiceChannel,
} from "discord.js"
import assert from "node:assert"
import { suite, test } from "node:test"
import d, { type OptionValue } from "../../index.mts"
import { arrayEqual, type Equal } from "../util.mts"

await suite("testChannel", async () => {
  await test("base", () => {
    const description = "Option description"

    const option = d.option(description).channel()

    assert.strictEqual(
      option.builder.type,
      ApplicationCommandOptionType.Channel,
    )

    assert.strictEqual(option.builder.description, description)

    const pass: Equal<
      GuildBasedChannel | undefined,
      OptionValue<typeof option>
    > = true

    assert.ok(pass)
  })

  await test("required", () => {
    const option = d.option("Description").channel().required()

    assert.ok(option.builder.required)

    const pass: Equal<GuildBasedChannel, OptionValue<typeof option>> = true

    assert.ok(pass)
  })

  await test("channelTypes", () => {
    const types = [ChannelType.GuildText, ChannelType.GuildVoice]

    const option = d
      .option("Description")
      .channel()
      .channelTypes(ChannelType.GuildText, ChannelType.GuildVoice)

    assert.ok(option.builder.channel_types)

    assert.ok(arrayEqual(option.builder.channel_types, types))

    const pass: Equal<
      TextChannel | VoiceChannel | undefined,
      OptionValue<typeof option>
    > = true

    assert.ok(pass)
  })

  await test("channelTypesRequired", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const option = d
      .option("Description")
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
