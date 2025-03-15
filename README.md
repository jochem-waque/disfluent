# Fluent Commands

A fluent, Zod-like API for discord.js commands.

## Usage

After installing `fluent-commands` and adding `import d from "fluent-commands"`
to a file, defining a command can be as simple as:

```ts
d.slashCommand("ping", "Respond with pong").handler(async (interaction) => {
  await interaction.reply("Pong!")
})
```

More likely than not though, you'll want to add subcommands, options, choices
and autocomplete, which are all supported, of course:

```ts
d.slashCommand("examples", "Example commands")
  .integrationTypes(ApplicationIntegrationType.UserInstall)
  .subcommands({
    text: d
      .subcommand("Subcommand example")
      .options({
        body: d.option("Body text").string().required().maxLength(500),
        channel: d
          .option("Category channel")
          .channel()
          .required()
          .channelTypes(ChannelType.GuildCategory),
        choose: d
          .option("Option with choice")
          .integer()
          .choices({ first: 1, second: 2, third: 3 }),
        auto: d
          .option("Autocompleted number")
          .number()
          .autocomplete((value) => ({
            up: Math.ceil(parseFloat(value)),
            down: Math.ceil(parseFloat(value)),
          })),
      })
      .handler(async (interaction, { body, channel, choose, auto }) => {
        await interaction.reply(JSON.stringify({ body, channel, choose, auto }))
      }),
  })
```

In the second example, the type of the deconstructed parameter is inferred as:

```ts
{
  body: string
  channel: CategoryChannel
  choose?: 1 | 2 | 3
  auto?: number
}
```

## Why?

Because Discord.js's command builders just aren't good enough. Defining your
commands in one place and repeating all of the option names and types in another
is prone to errors and completely unnecessary. I already solved this problem
over a year ago. Now, I've solved it again, but more terse and elegant.

## License

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/>.
