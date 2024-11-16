/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
  InteractionContextType,
  PermissionFlagsBits,
  Permissions,
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandMentionableOption,
  SlashCommandNumberOption,
  SlashCommandRoleOption,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandUserOption,
} from "discord.js"

type Pretty<T> = {
  [K in keyof T]: T[K]
} & {}

type LowercaseKeys<T> = {
  [K in keyof T]: K extends Lowercase<string> ? T[K] : never
}

type TypeMap = {
  attachment: ReturnType<CommandInteractionOptionResolver["getAttachment"]> & {}
  boolean: ReturnType<CommandInteractionOptionResolver["getBoolean"]> & {}
  channel: ReturnType<CommandInteractionOptionResolver["getChannel"]> & {}
  integer: ReturnType<CommandInteractionOptionResolver["getInteger"]> & {}
  mentionable: ReturnType<
    CommandInteractionOptionResolver["getMentionable"]
  > & {}
  number: ReturnType<CommandInteractionOptionResolver["getNumber"]> & {}
  role: ReturnType<CommandInteractionOptionResolver["getRole"]> & {}
  string: ReturnType<CommandInteractionOptionResolver["getString"]> & {}
  user: ReturnType<CommandInteractionOptionResolver["getUser"]> & {}
}

type BuilderMap = {
  attachment: SlashCommandAttachmentOption
  boolean: SlashCommandBooleanOption
  channel: SlashCommandChannelOption
  integer: SlashCommandIntegerOption
  mentionable: SlashCommandMentionableOption
  number: SlashCommandNumberOption
  role: SlashCommandRoleOption
  string: SlashCommandStringOption
  user: SlashCommandUserOption
}

type InferType<TypeName extends keyof TypeMap | undefined> =
  TypeName extends keyof TypeMap ? TypeMap[TypeName] : undefined

type OptionValue<T extends Partial<Option>> = T["required"] extends () => void
  ? InferType<T["type"]> | undefined
  : InferType<T["type"]>

type OptionValues<T extends Record<string, Partial<Option>>> = {
  [K in keyof T]: OptionValue<T[K]>
} & {}

type Option<
  Type extends keyof TypeMap = keyof TypeMap,
  Keys extends keyof Option | "" = "",
> = Pretty<
  Omit<
    {
      builder: BuilderMap[Type]
      type: Type
      required(): Option<Type, Keys | "required">
    },
    Keys
  >
>

type SlashCommand<
  Keys extends keyof SlashCommand | "" = "",
  Handler extends boolean = false,
> = Pretty<
  Omit<
    {
      builder: SlashCommandBuilder
      contexts(
        context: InteractionContextType,
        ...rest: InteractionContextType[]
      ): SlashCommand<Keys | "contexts">
      defaultMemberPermissions(
        permissions: Permissions | bigint,
      ): SlashCommand<Keys | "defaultMemberPermissions">
      integrationTypes(
        type: ApplicationIntegrationType,
        ...rest: ApplicationIntegrationType[]
      ): SlashCommand<Keys | "integrationTypes">
      nsfw(): SlashCommand<Keys | "nsfw">
      options<T extends Record<string, Partial<Option>>>(
        options: LowercaseKeys<T>,
      ): SlashCommandWithOptions<
        Keys | "options" | "subcommands" | "subcommandGroups",
        T
      >
      handler(
        handler: (interaction: ChatInputCommandInteraction) => Promise<void>,
      ): SlashCommand<
        Keys | "handler" | "options" | "subcommandGroups" | "subcommands",
        true
      >
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
      subcommands(
        subcommands: Record<
          Lowercase<string>,
          Subcommand<Exclude<keyof Subcommand, "builder" | "handler">, true>
        >,
      ): SlashCommand<Keys | "options" | "handler" | "subcommands", true>
      subcommandGroups(
        groups: Record<
          Lowercase<string>,
          SubcommandGroup<
            Exclude<keyof SubcommandGroup, "builder" | "subcommands">,
            true
          >
        >,
      ): SlashCommand<Keys | "options" | "handler" | "subcommandGroups", true>
    },
    Handler extends false ? Keys | "handle" : Keys
  >
>

type SlashCommandWithOptions<
  Keys extends keyof SlashCommand | "",
  Options extends Record<Lowercase<string>, Partial<Option>>,
  Handler extends boolean = false,
> = Pretty<
  Omit<
    {
      builder: SlashCommandBuilder
      options: Options
      contexts(
        context: InteractionContextType,
        ...rest: InteractionContextType[]
      ): SlashCommandWithOptions<Keys | "contexts", Options>
      defaultMemberPermissions(
        permissions: Permissions | bigint,
      ): SlashCommandWithOptions<Keys | "defaultMemberPermissions", Options>
      integrationTypes(
        type: ApplicationIntegrationType,
        ...rest: ApplicationIntegrationType[]
      ): SlashCommandWithOptions<Keys | "integrationTypes", Options>
      nsfw(): SlashCommandWithOptions<Keys | "nsfw", Options>
      handler(
        handler: (
          interaction: ChatInputCommandInteraction,
          values: OptionValues<Options>,
        ) => Promise<void>,
      ): SlashCommandWithOptions<Keys | "handler" | "options", Options, true>
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
    },
    Handler extends false ? Keys | "handle" : Keys
  >
>

type Subcommand<
  Keys extends keyof Subcommand | "" = "",
  Handler extends boolean = false,
> = Pretty<
  Omit<
    {
      builder: SlashCommandSubcommandBuilder
      options<T extends Record<Lowercase<string>, Partial<Option>>>(
        options: T,
      ): SubcommandWithOptions<Keys | "options", T, false>
      handler: Handler extends true
        ? (interaction: ChatInputCommandInteraction) => Promise<void>
        : (
            handler: (
              interaction: ChatInputCommandInteraction,
            ) => Promise<void>,
          ) => Subcommand<Keys | "options", true>
    },
    Keys
  >
>

type SubcommandWithOptions<
  Keys extends keyof Subcommand | "",
  Options extends Record<Lowercase<string>, Partial<Option>>,
  Handler extends boolean,
> = Pretty<
  Omit<
    {
      builder: SlashCommandSubcommandBuilder
      options: Options
      handler: Handler extends true
        ? (interaction: ChatInputCommandInteraction) => Promise<void>
        : (
            handler: (
              interaction: ChatInputCommandInteraction,
              values: OptionValues<Options>,
            ) => Promise<void>,
          ) => SubcommandWithOptions<Keys, Options, true>
    },
    Keys
  >
>

type SubcommandGroup<
  Keys extends keyof SubcommandGroup | "" = "",
  Subcommands extends boolean = false,
> = Pretty<
  Omit<
    {
      builder: SlashCommandSubcommandGroupBuilder
      subcommands: Subcommands extends true
        ? Record<
            Lowercase<string>,
            Subcommand<Exclude<keyof Subcommand, "builder" | "handler">, true>
          >
        : (
            subcommands: Record<
              Lowercase<string>,
              Subcommand<Exclude<keyof Subcommand, "builder" | "handler">, true>
            >,
          ) => SubcommandGroup<Keys, true>
    },
    Keys
  >
>

export function slashCommand(
  name: Lowercase<string>,
  description: string,
): SlashCommand {
  return {
    builder: new SlashCommandBuilder()
      .setName(name)
      .setDescription(description),
    contexts(context, ...rest) {
      this.builder.setContexts(context, ...rest)
      return this
    },
    defaultMemberPermissions(permissions) {
      this.builder.setDefaultMemberPermissions(permissions)
      return this
    },
    integrationTypes(type, ...rest) {
      this.builder.setIntegrationTypes(type, ...rest)
      return this
    },
    nsfw() {
      this.builder.setNSFW(true)
      return this
    },
    options(options) {
      return {
        ...this,
        options,
        contexts(context, ...rest) {
          this.builder.setContexts(context, ...rest)
          return this
        },
        defaultMemberPermissions(permissions) {
          this.builder.setDefaultMemberPermissions(permissions)
          return this
        },
        integrationTypes(type, ...rest) {
          this.builder.setIntegrationTypes(type, ...rest)
          return this
        },
        nsfw() {
          this.builder.setNSFW(true)
          return this
        },
        handler(handler) {
          return {
            ...this,
            async handle(interaction) {
              const values = Object.fromEntries(
                Object.entries(options).map(([key, option]) => [
                  key,
                  getOptionValue(interaction, option),
                ]),
              ) as OptionValues<typeof options>
              await handler(interaction, values)
            },
          }
        },
      }
    },
    handler(handler) {
      return {
        ...this,
        handle: handler,
      }
    },
    subcommands(subcommands) {
      // TODO support both groups and subcommands
      for (const [name, { builder }] of Object.entries(subcommands)) {
        builder.setName(name)
        this.builder.addSubcommand(builder)
      }

      return {
        ...this,
        async handle(interaction) {
          const name = interaction.options.getSubcommand(
            true,
          ) as Lowercase<string>
          const command = subcommands[name]
          if (!command) {
            throw new Error() // TODO error text
          }

          await command.handler(interaction)
        },
      }
    },
    subcommandGroups(subcommandGroups) {
      // TODO support both groups and subcommands
      for (const [name, { builder }] of Object.entries(subcommandGroups)) {
        builder.setName(name)
        this.builder.addSubcommandGroup(builder)
      }

      return {
        ...this,
        async handle(interaction) {
          const groupName = interaction.options.getSubcommandGroup(
            true,
          ) as Lowercase<string>
          const group = subcommandGroups[groupName]
          if (!group) {
            throw new Error() // TODO error text
          }

          const name = interaction.options.getSubcommand(
            true,
          ) as Lowercase<string>
          const command = group.subcommands[name]
          if (!command) {
            throw new Error() // TODO error text
          }

          await command.handler(interaction)
        },
      }
    },
  }
}

export function subcommand(description: string): Subcommand {
  return {
    builder: new SlashCommandSubcommandBuilder().setDescription(description),
    options(options) {
      return {
        ...this,
        options,
        handler(handler) {
          return {
            ...this,
            async handler(interaction) {
              const values = Object.fromEntries(
                Object.entries(options).map(([key, option]) => [
                  key,
                  getOptionValue(interaction, option),
                ]),
              ) as OptionValues<typeof options>
              await handler(interaction, values)
            },
          }
        },
      }
    },
    handler(handler) {
      return { ...this, handler }
    },
  }
}

export function subcommandGroup(description: string): SubcommandGroup {
  return {
    builder: new SlashCommandSubcommandGroupBuilder().setDescription(
      description,
    ),
    subcommands(subcommands) {
      for (const [name, { builder }] of Object.entries(subcommands)) {
        builder.setName(name)
        this.builder.addSubcommand(builder)
      }

      return {
        ...this,
        subcommands,
      }
    },
  }
}

function getOptionValue<
  Type extends keyof TypeMap,
  O extends Partial<Option<Type>>,
>(interaction: ChatInputCommandInteraction, option: O): OptionValue<O> {
  if (!option.builder) {
    return undefined as OptionValue<O>
  }

  let value

  switch (option.type) {
    case "attachment":
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      value = interaction.options.getAttachment(
        option.builder.name,
        !option.required,
      ) as OptionValue<{ type: "attachment" }> | null
      break
    case "boolean":
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      value = interaction.options.getBoolean(
        option.builder.name,
        !option.required,
      ) as OptionValue<{ type: "boolean" }> | null
      break
    case "channel":
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      value = interaction.options.getChannel(
        option.builder.name,
        !option.required,
      ) as OptionValue<{ type: "channel" }> | null
      break
    case "integer":
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      value = interaction.options.getInteger(
        option.builder.name,
        !option.required,
      ) as OptionValue<{ type: "integer" }> | null
      break
    case "mentionable":
      value = interaction.options.getMentionable(
        option.builder.name,
        !option.required,
      ) as OptionValue<{ type: "mentionable" }> | null
      break
    case "number":
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      value = interaction.options.getNumber(
        option.builder.name,
        !option.required,
      ) as OptionValue<{ type: "number" }> | null
      break
    case "role":
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      value = interaction.options.getRole(
        option.builder.name,
        !option.required,
      ) as OptionValue<{ type: "role" }> | null
      break
    case "string":
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      value = interaction.options.getString(
        option.builder.name,
        !option.required,
      ) as OptionValue<{ type: "string" }> | null
      break
    case "user":
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      value = interaction.options.getUser(
        option.builder.name,
        !option.required,
      ) as OptionValue<{ type: "user" }> | null
      break
    default:
      value = undefined
      break
  }

  return (value ?? undefined) as OptionValue<O>
}

export function string(description: string): Option<"string"> {
  return {
    builder: new SlashCommandStringOption().setDescription(description),
    type: "string",
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

export function number(description: string): Option<"number"> {
  return {
    builder: new SlashCommandNumberOption().setDescription(description),
    type: "number",
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

slashCommand("", "")
  .contexts(InteractionContextType.BotDM, InteractionContextType.Guild)
  .defaultMemberPermissions(PermissionFlagsBits.AddReactions)
  .integrationTypes(ApplicationIntegrationType.GuildInstall)
  .nsfw()
  .options({
    text: string("Example option").required(),
    count: number("Example option"),
  })
  .handler(async (interaction, { text }) => {
    await interaction.reply(text)
  })

slashCommand("", "")
  .contexts(InteractionContextType.BotDM, InteractionContextType.Guild)
  .defaultMemberPermissions(PermissionFlagsBits.AddReactions)
  .integrationTypes(ApplicationIntegrationType.GuildInstall)
  .nsfw()
  .subcommands({
    test: subcommand("test")
      .options({})
      .handler(async (interaction) => {
        await interaction.deferReply()
      }),
  })
  .subcommandGroups({
    group: subcommandGroup("desc").subcommands({
      command: subcommand("").handler(async (interaction) => {
        await interaction.deferReply()
      }),
    }),
  })
