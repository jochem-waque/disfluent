# Fluent Commands

Like Zod, but for discord.js commands.

## Usage

After installing `fluent-commands` and adding `import d from "fluent-commands"`
to a file, defining a command can be as simple as:

```ts
d.slashCommand("ping", "Respond with pong").handler(async (interaction) => {
  await interaction.reply("Pong!")
})
```

More likely than not though, you'll have to add subcommands, options, choices
and autocomplete, which are also all supported of course:

```ts
d.slashCommand("examples", "Example commands")
  .integrationTypes(ApplicationIntegrationType.UserInstall)
  .subcommands({
    text: d
      .subcommand("Subcommand example")
      .options({
        body: d.string("Body text").required().maxLength(500),
        channel: d
          .channel("Category channel")
          .required()
          .channelTypes(ChannelType.GuildCategory),
        choose: d
          .integer("Option with choice")
          .choices({ first: 1, second: 2, third: 3 }),
        auto: d.number("Autocompleted number").autocomplete((value) => ({
          up: Math.ceil(parseFloat(value)),
          down: Math.ceil(parseFloat(value)),
        })),
      })
      .handler(async (interaction, { body, channel, choose, auto }) => {
        await interaction.reply(JSON.stringify({ body, channel, choose, auto }))
      }),
  })
```

In the second example, the type of the deconstructed parameter is inferred as

```ts
{
  body: string
  channel: CategoryChannel
  choose?: 1 | 2 | 3
  auto?: number
}
```

## Why?

During the almost three years I've spent developing Discord bots for my friends
— some of which have been used for servers with thousands of members — I've
found myself wondering whether there's a better, more type-safe way I can define
discord.js commands, as the built-in command builders require error-prone code
duplication. One of my previous approaches used a syntax that was very similar
to the JSON of Discord commands, which required a lot of typing and had very
poor autocomplete. This new iteration provides an API that will feel familiar to
those who have worked with Zod, Drizzle or similar fluent APIs.

The development of this project started as part challenge (how can I implement
the type inferencing I want?), part me wanting to separate my code into
installable packages so I don't have to copy-paste the same code into a dozen
repositories, and part genuine interest in wanting to improve my development
experience with discord.js commands and reducing the mistakes that can be made.

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
