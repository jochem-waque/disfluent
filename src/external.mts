/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  ApplicationIntegrationType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
  InteractionContextType,
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

type NotEmpty<T> = T extends Record<string, never> ? never : T

type Unwrap<T> = {
  [K in keyof T]: T[K]
} & {}

type LowercaseKeys<T> = {
  [K in keyof T]: K extends Lowercase<string> ? T[K] : never
}

type RequiredKeysOf<Type> = {
  [Key in keyof Type]: Type[Key] extends Exclude<Type[Key], undefined>
    ? Key
    : never
}[keyof Type]

type UndefinedToOptional<Type> = Partial<{
  [Key in keyof Type]: Exclude<Type[Key], undefined>
}> &
  Pick<Type, RequiredKeysOf<Type>>

type InvertedPartialize<Type, Keys extends keyof Type> = Partial<Type> &
  Pick<Type, Keys>

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

type OptionValue<T> =
  T extends PartialOptionWithChoices<infer R>
    ? T["required"] extends () => void
      ? R extends Record<string, infer V>
        ? V | undefined
        : never
      : R extends Record<string, infer V>
        ? V
        : never
    : T extends PartialOption<keyof TypeMap, "type">
      ? T["required"] extends () => void
        ? TypeMap[T["type"]] | undefined
        : TypeMap[T["type"]]
      : never

type OptionValues<
  T extends Record<string, PartialOption<keyof TypeMap, "type">>,
> = Unwrap<
  UndefinedToOptional<{
    [K in keyof T]: OptionValue<T[K]>
  }>
>

type Option<
  Type extends keyof TypeMap = keyof TypeMap,
  Keys extends keyof Option<"integer"> | keyof Option<"string"> | "" = "",
  Autocomplete extends boolean = false,
> = Unwrap<
  Omit<
    {
      builder: BuilderMap[Type]
      type: Type
      required(): Option<Type, Keys | "required", Autocomplete>
    } & (Type extends "integer" | "number" | "string"
      ? {
          choices<const T extends Record<string, TypeMap[Type]>>(
            choices: T,
          ): OptionWithChoices<T, Type, Keys | "autocomplete">
        } & (Autocomplete extends true
          ? {
              autocomplete: (
                interaction: AutocompleteInteraction<"cached">,
              ) => Promise<void>
            }
          : {
              autocomplete(
                handler: (
                  value: string,
                  interaction: AutocompleteInteraction<"cached">,
                ) => Promise<Record<string, TypeMap[Type]>>,
              ): Option<Type, Keys | "choices", true>
            })
      : object) &
      (Type extends "integer" | "number"
        ? {
            maxValue(
              value: TypeMap[Type],
            ): Option<Type, Keys | "maxValue", Autocomplete>
            minValue(
              value: TypeMap[Type],
            ): Option<Type, Keys | "minValue", Autocomplete>
          }
        : object) &
      (Type extends "string"
        ? {
            maxLength(
              length: number,
            ): Option<Type, Keys | "maxLength", Autocomplete>
            minLength(
              length: number,
            ): Option<Type, Keys | "minLength", Autocomplete>
          }
        : object),
    Keys
  >
>

type OptionWithChoices<
  Choices extends Record<string, TypeMap[Type]>,
  Type extends keyof TypeMap = keyof TypeMap,
  Keys extends keyof Option<"integer"> | keyof Option<"string"> | "" = "",
> = Unwrap<
  Omit<
    {
      builder: BuilderMap[Type]
      type: Type
      required(): OptionWithChoices<Choices, Type, Keys | "required">
      choices: Choices
    } & (Type extends "integer" | "number"
      ? {
          maxValue(
            value: TypeMap[Type],
          ): OptionWithChoices<Choices, Type, Keys | "maxValue">
          minValue(
            value: TypeMap[Type],
          ): OptionWithChoices<Choices, Type, Keys | "minValue">
        }
      : object) &
      (Type extends "string"
        ? {
            maxLength(
              length: number,
            ): OptionWithChoices<Choices, Type, Keys | "maxLength">
            minLength(
              length: number,
            ): OptionWithChoices<Choices, Type, Keys | "minLength">
          }
        : object),
    Keys
  >
>

type PartialOption<
  Type extends keyof TypeMap = keyof TypeMap,
  Keys extends keyof Option = "builder" | "type",
> = InvertedPartialize<Option<Type>, Keys>

type PartialOptionWithChoices<
  Choices extends Record<string, TypeMap[Type]>,
  Type extends "number" | "integer" | "string" =
    | "number"
    | "integer"
    | "string",
  Keys extends keyof Option = "builder" | "type",
> = InvertedPartialize<OptionWithChoices<Choices, Type>, Keys>

type PartialSubcommand = InvertedPartialize<
  Subcommand<"", true>,
  "builder" | "handle"
>

type PartialSubcommandGroup = InvertedPartialize<
  SubcommandGroup<"", true>,
  "builder" | "subcommands"
>

type SlashCommand<
  Keys extends keyof SlashCommand | "" = "",
  Handler extends boolean = false,
> = Unwrap<
  Omit<
    {
      builder: SlashCommandBuilder
      contexts(
        context: InteractionContextType,
        ...rest: InteractionContextType[]
      ): SlashCommand<Keys | "contexts", Handler>
      defaultMemberPermissions(
        permissions: Permissions | bigint,
      ): SlashCommand<Keys | "defaultMemberPermissions", Handler>
      integrationTypes(
        type: ApplicationIntegrationType,
        ...rest: ApplicationIntegrationType[]
      ): SlashCommand<Keys | "integrationTypes", Handler>
      nsfw(): SlashCommand<Keys | "nsfw", Handler>
      options<T extends Record<string, PartialOption>>(
        options: NotEmpty<LowercaseKeys<T>>,
      ): SlashCommandWithOptions<
        NotEmpty<LowercaseKeys<T>>,
        Keys | "options" | "subcommands" | "subcommandGroups",
        Handler
      >
      handler(
        handler: (interaction: ChatInputCommandInteraction) => Promise<void>,
      ): SlashCommand<
        Keys | "handler" | "options" | "subcommandGroups" | "subcommands",
        true
      >
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
      subcommands<T extends Record<string, PartialSubcommand>>(
        subcommands: NotEmpty<LowercaseKeys<T>>,
      ): SlashCommand<Keys | "options" | "handler" | "subcommands", true>
      subcommandGroups<T extends Record<string, PartialSubcommandGroup>>(
        groups: NotEmpty<LowercaseKeys<T>>,
      ): SlashCommand<Keys | "options" | "handler" | "subcommandGroups", true>
    },
    Handler extends true ? Exclude<Keys, "handle"> : Keys | "handle"
  >
>

type SlashCommandWithOptions<
  Options extends Record<Lowercase<string>, PartialOption>,
  Keys extends keyof SlashCommand | "" = "",
  Handler extends boolean = false,
> = Unwrap<
  Omit<
    {
      builder: SlashCommandBuilder
      options: Options
      contexts(
        context: InteractionContextType,
        ...rest: InteractionContextType[]
      ): SlashCommandWithOptions<Options, Keys | "contexts", Handler>
      defaultMemberPermissions(
        permissions: Permissions | bigint,
      ): SlashCommandWithOptions<
        Options,
        Keys | "defaultMemberPermissions",
        Handler
      >
      integrationTypes(
        type: ApplicationIntegrationType,
        ...rest: ApplicationIntegrationType[]
      ): SlashCommandWithOptions<Options, Keys | "integrationTypes", Handler>
      nsfw(): SlashCommandWithOptions<Options, Keys | "nsfw", Handler>
      handler(
        handler: (
          interaction: ChatInputCommandInteraction,
          values: OptionValues<Options>,
        ) => Promise<void>,
      ): SlashCommandWithOptions<Options, Keys | "handler" | "options", true>
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
    },
    Handler extends true ? Exclude<Keys, "handle"> : Keys | "handle"
  >
>

type Subcommand<
  Keys extends keyof Subcommand | "" = "",
  Handler extends boolean = false,
> = Unwrap<
  Omit<
    {
      builder: SlashCommandSubcommandBuilder
      options<T extends Record<string, PartialOption>>(
        options: NotEmpty<LowercaseKeys<T>>,
      ): SubcommandWithOptions<
        NotEmpty<LowercaseKeys<T>>,
        Keys | "options",
        Handler
      >
      handler: (
        handler: (interaction: ChatInputCommandInteraction) => Promise<void>,
      ) => Subcommand<Keys | "options" | "handler", true>
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
    },
    Handler extends true ? Exclude<Keys, "handle"> : Keys | "handle"
  >
>

type SubcommandWithOptions<
  Options extends Record<Lowercase<string>, PartialOption>,
  Keys extends keyof Subcommand | "" = "",
  Handler extends boolean = false,
> = Unwrap<
  Omit<
    {
      builder: SlashCommandSubcommandBuilder
      options: Options
      handler: (
        handler: (
          interaction: ChatInputCommandInteraction,
          values: OptionValues<Options>,
        ) => Promise<void>,
      ) => SubcommandWithOptions<Options, Keys | "handler", true>
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
    },
    Handler extends true ? Exclude<Keys, "handle"> : Keys | "handle"
  >
>

type SubcommandGroup<
  Keys extends keyof SubcommandGroup | "" = "",
  Subcommands extends boolean = false,
> = Unwrap<
  Omit<
    {
      builder: SlashCommandSubcommandGroupBuilder
    } & (Subcommands extends true
      ? {
          subcommands: Record<Lowercase<string>, PartialSubcommand>
        }
      : {
          subcommands<T extends Record<string, PartialSubcommand>>(
            subcommands: NotEmpty<LowercaseKeys<T>>,
          ): SubcommandGroup<Keys, true>
        }),
    Keys
  >
>

function getOptionValue<
  Type extends keyof TypeMap,
  O extends PartialOption<Type>,
>(interaction: ChatInputCommandInteraction, option: O): OptionValue<O> {
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

// TODO support autocomplete
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
          }
        },
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
      }
    },
    handler(handler) {
      return {
        ...this,
        handle: handler,
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
      }
    },
    subcommands(subcommands: Record<string, PartialSubcommand>) {
      for (const [name, { builder }] of Object.entries(subcommands)) {
        builder.setName(name)
        this.builder.addSubcommand(builder)
      }

      let handle
      if ("handle" in this) {
        const newThis = this as SlashCommand<keyof SlashCommand, true>
        handle = async (interaction: ChatInputCommandInteraction) => {
          const group = interaction.options.getSubcommandGroup()
          if (group) {
            await newThis.handle(interaction)
            return
          }

          const name = interaction.options.getSubcommand(
            true,
          ) as Lowercase<string>
          const command = subcommands[name]
          if (!command) {
            throw new Error() // TODO error text
          }

          await command.handle(interaction)
        }
      } else {
        handle = async (interaction: ChatInputCommandInteraction) => {
          const name = interaction.options.getSubcommand(
            true,
          ) as Lowercase<string>
          const command = subcommands[name]
          if (!command) {
            throw new Error() // TODO error text
          }

          await command.handle(interaction)
        }
      }

      return {
        ...this,
        handle,
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
      }
    },
    subcommandGroups(subcommandGroups: Record<string, PartialSubcommandGroup>) {
      for (const [name, { builder }] of Object.entries(subcommandGroups)) {
        builder.setName(name)
        this.builder.addSubcommandGroup(builder)
      }

      let handle
      if ("handle" in this) {
        const newThis = this as SlashCommand<keyof SlashCommand, true>
        handle = async (interaction: ChatInputCommandInteraction) => {
          const groupName =
            interaction.options.getSubcommandGroup() as Lowercase<string> | null
          if (!groupName) {
            await newThis.handle(interaction)
            return
          }

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

          await command.handle(interaction)
        }
      } else {
        handle = async (interaction: ChatInputCommandInteraction) => {
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

          await command.handle(interaction)
        }
      }

      return {
        ...this,
        handle,
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
      return { ...this, handle: handler }
    },
  }
}

export function subcommandGroup(description: string): SubcommandGroup {
  return {
    builder: new SlashCommandSubcommandGroupBuilder().setDescription(
      description,
    ),
    subcommands(subcommands: Record<Lowercase<string>, PartialSubcommand>) {
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

export function attachment(description: string): Option<"attachment"> {
  return {
    type: "attachment",
    builder: new SlashCommandAttachmentOption().setDescription(description),
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

export function boolean(description: string): Option<"boolean"> {
  return {
    type: "boolean",
    builder: new SlashCommandBooleanOption().setDescription(description),
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

export function channel(description: string): Option<"channel"> {
  return {
    type: "channel",
    builder: new SlashCommandChannelOption().setDescription(description),
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

export function integer(description: string): Option<"integer"> {
  return {
    type: "integer",
    builder: new SlashCommandIntegerOption().setDescription(description),
    autocomplete(autocomplete) {
      this.builder.setAutocomplete(true)
      return {
        ...this,
        async autocomplete(interaction) {
          const result = await autocomplete(
            interaction.options.getFocused(),
            interaction,
          )
          await interaction.respond(
            Object.entries(result).map(([name, value]) => ({ name, value })),
          )
        },
        maxValue(value) {
          this.builder.setMaxValue(value)
          return this
        },
        minValue(value) {
          this.builder.setMinValue(value)
          return this
        },
        required() {
          this.builder.setRequired(true)
          return this
        },
      }
    },
    choices(choices) {
      this.builder.setChoices(
        Object.entries(choices).map(([name, value]) => ({ name, value })),
      )
      return {
        ...this,
        choices,
        maxValue(value) {
          this.builder.setMaxValue(value)
          return this
        },
        minValue(value) {
          this.builder.setMinValue(value)
          return this
        },
        required() {
          this.builder.setRequired(true)
          return this
        },
      }
    },
    maxValue(value) {
      this.builder.setMaxValue(value)
      return this
    },
    minValue(value) {
      this.builder.setMinValue(value)
      return this
    },
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

export function mentionable(description: string): Option<"mentionable"> {
  return {
    type: "mentionable",
    builder: new SlashCommandMentionableOption().setDescription(description),
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

export function number(description: string): Option<"number"> {
  return {
    type: "number",
    builder: new SlashCommandNumberOption().setDescription(description),
    autocomplete(autocomplete) {
      this.builder.setAutocomplete(true)
      return {
        ...this,
        async autocomplete(interaction) {
          const result = await autocomplete(
            interaction.options.getFocused(),
            interaction,
          )
          await interaction.respond(
            Object.entries(result).map(([name, value]) => ({ name, value })),
          )
        },
        maxValue(value) {
          this.builder.setMaxValue(value)
          return this
        },
        minValue(value) {
          this.builder.setMinValue(value)
          return this
        },
        required() {
          this.builder.setRequired(true)
          return this
        },
      }
    },
    choices(choices) {
      this.builder.setChoices(
        Object.entries(choices).map(([name, value]) => ({ name, value })),
      )
      return {
        ...this,
        choices,
        maxValue(value) {
          this.builder.setMaxValue(value)
          return this
        },
        minValue(value) {
          this.builder.setMinValue(value)
          return this
        },
        required() {
          this.builder.setRequired(true)
          return this
        },
      }
    },
    maxValue(value) {
      this.builder.setMaxValue(value)
      return this
    },
    minValue(value) {
      this.builder.setMinValue(value)
      return this
    },
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

export function role(description: string): Option<"role"> {
  return {
    type: "role",
    builder: new SlashCommandRoleOption().setDescription(description),
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

export function string(description: string): Option<"string"> {
  return {
    type: "string",
    builder: new SlashCommandStringOption().setDescription(description),
    autocomplete(autocomplete) {
      this.builder.setAutocomplete(true)
      return {
        ...this,
        async autocomplete(interaction) {
          const result = await autocomplete(
            interaction.options.getFocused(),
            interaction,
          )
          await interaction.respond(
            Object.entries(result).map(([name, value]) => ({ name, value })),
          )
        },
        maxLength(length) {
          this.builder.setMaxLength(length)
          return this
        },
        minLength(length) {
          this.builder.setMinLength(length)
          return this
        },
        required() {
          this.builder.setRequired(true)
          return this
        },
      }
    },
    choices(choices) {
      this.builder.setChoices(
        Object.entries(choices).map(([name, value]) => ({ name, value })),
      )
      return {
        ...this,
        choices,
        maxLength(length) {
          this.builder.setMaxLength(length)
          return this
        },
        minLength(length) {
          this.builder.setMinLength(length)
          return this
        },
        required() {
          this.builder.setRequired(true)
          return this
        },
      }
    },
    maxLength(length) {
      this.builder.setMaxLength(length)
      return this
    },
    minLength(length) {
      this.builder.setMinLength(length)
      return this
    },
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

export function user(description: string): Option<"user"> {
  return {
    type: "user",
    builder: new SlashCommandUserOption().setDescription(description),
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}
