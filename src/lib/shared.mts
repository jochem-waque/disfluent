/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  ApplicationCommandOptionAllowedChannelTypes,
  ApplicationCommandType,
  ApplicationIntegrationType,
  AutocompleteInteraction,
  Channel,
  ChannelType,
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  InteractionContextType,
  MessageContextMenuCommandInteraction,
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
  UserContextMenuCommandInteraction,
} from "discord.js"
import { InternalError } from "./error.mjs"

type InvertedPartialize<Type, Keys extends keyof Type> = Partial<Type> &
  Pick<Type, Keys>

type LowercaseKeys<T> = {
  [K in keyof T]: K extends Lowercase<string> ? T[K] : never
}

type NotEmpty<T> = T extends Record<string, never> ? never : T

type RequiredKeysOf<Type> = {
  [Key in keyof Type]: Type[Key] extends Exclude<Type[Key], undefined>
    ? Key
    : never
}[keyof Type]

type UndefinedToOptional<Type> = Partial<{
  [Key in keyof Type]: Exclude<Type[Key], undefined>
}> &
  Pick<Type, RequiredKeysOf<Type>>

type Unwrap<T> = {
  [K in keyof T]: T[K]
} & {}

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

// TODO this could be better
type OptionKeys =
  | keyof Option<"string">
  | keyof Option<"number">
  | keyof Option<"channel">

export type Option<
  Type extends keyof TypeMap = keyof TypeMap,
  Keys extends OptionKeys | "" = "",
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
            choices: T, // TODO NotEmpty
          ): OptionWithChoices<T, Type, Keys | "autocomplete">
        } & (Autocomplete extends true
          ? {
              handleAutocomplete: (
                interaction: AutocompleteInteraction,
              ) => Promise<void>
            }
          : {
              autocomplete(
                handler: (
                  value: string,
                  interaction: AutocompleteInteraction,
                ) =>
                  | Promise<Record<string, TypeMap[Type]>>
                  | Record<string, TypeMap[Type]>,
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
        : object) &
      (Type extends "channel"
        ? {
            channelTypes<
              Types extends
                readonly ApplicationCommandOptionAllowedChannelTypes[],
            >(
              ...types: Types
            ): OptionWithChannelTypes<Types, Keys>
          }
        : object),
    Keys
  >
>

// TODO this could be better
export type PartialOption<
  Type extends keyof TypeMap = keyof TypeMap,
  Keys extends keyof Option<Type> = "builder" | "type",
> = InvertedPartialize<Option<Type>, Keys> & {
  handleAutocomplete?: (interaction: AutocompleteInteraction) => Promise<void>
}

type OptionWithChannelTypes<
  Types extends readonly ApplicationCommandOptionAllowedChannelTypes[],
  Keys extends OptionKeys | "" = "",
> = Unwrap<
  Omit<
    {
      builder: BuilderMap["channel"]
      type: "channel"
      channelTypes: Types
      required(): OptionWithChannelTypes<Types, Keys | "required">
    },
    Keys
  >
>

type OptionWithChoices<
  Choices extends Record<string, TypeMap[Type]>,
  Type extends keyof TypeMap = keyof TypeMap,
  Keys extends OptionKeys | "" = "",
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

type PartialOptionWithChannelTypes<
  Types extends readonly ApplicationCommandOptionAllowedChannelTypes[],
  Keys extends keyof Option = "builder" | "type",
> = InvertedPartialize<OptionWithChannelTypes<Types>, Keys>

type PartialOptionWithChoices<
  Choices extends Record<string, TypeMap[Type]>,
  Type extends "number" | "integer" | "string" =
    | "number"
    | "integer"
    | "string",
  Keys extends keyof Option = "builder" | "type",
> = InvertedPartialize<OptionWithChoices<Choices, Type>, Keys> & {
  choices: Choices
}

type MapChannelType<Type extends ChannelType> = Extract<
  Channel,
  {
    type: Type extends ChannelType.PublicThread | ChannelType.AnnouncementThread
      ? ChannelType.PublicThread | ChannelType.AnnouncementThread
      : Type
  }
>

type RequiredOptionValue<T extends PartialOption<keyof TypeMap, "type">> =
  T extends PartialOptionWithChannelTypes<
    infer C extends readonly ApplicationCommandOptionAllowedChannelTypes[]
  >
    ? MapChannelType<C[number]>
    : T extends PartialOptionWithChoices<infer R>
      ? R extends Record<string, infer V>
        ? V
        : never
      : TypeMap[T["type"]]

type OptionValue<T extends PartialOption<keyof TypeMap, "type">> =
  T["required"] extends () => void
    ? RequiredOptionValue<T> | undefined
    : RequiredOptionValue<T>

export type OptionValues<
  T extends Record<string, PartialOption<keyof TypeMap, "type">>,
> = Unwrap<
  UndefinedToOptional<{
    [K in keyof T]: OptionValue<T[K]>
  }>
>

export type Subcommand<
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

export type PartialSubcommand = InvertedPartialize<
  Subcommand<"", true>,
  "builder" | "handle"
>

export type SubcommandWithOptions<
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

export type SubcommandGroup<
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

export type PartialSubcommandGroup = InvertedPartialize<
  SubcommandGroup<"", true>,
  "builder" | "subcommands"
>

// TODO separate Handler into Subcommands and regular Handler
export type SlashCommand<
  Keys extends keyof SlashCommand | "" = "",
  Handler extends boolean = false,
> = Unwrap<
  Omit<
    {
      builder: SlashCommandBuilder
      type: ApplicationCommandType.ChatInput
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
      autocomplete: (interaction: AutocompleteInteraction) => Promise<void>
      subcommands<T extends Record<string, PartialSubcommand>>(
        subcommands: NotEmpty<LowercaseKeys<T>>,
      ): SlashCommand<Keys | "options" | "handler" | "subcommands", true>
      subcommandGroups<T extends Record<string, PartialSubcommandGroup>>(
        groups: NotEmpty<LowercaseKeys<T>>,
      ): SlashCommand<Keys | "options" | "handler" | "subcommandGroups", true>
    },
    Handler extends true
      ? Exclude<Keys, "handle" | "autocomplete">
      : Keys | "handle" | "autocomplete"
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
      type: ApplicationCommandType.ChatInput
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
      autocomplete: (interaction: AutocompleteInteraction) => Promise<void>
    },
    Handler extends true
      ? Exclude<Keys, "handle" | "autocomplete">
      : Keys | "handle" | "autocomplete"
  >
>

type InteractionMap = {
  undefined: ContextMenuCommandInteraction
  user: UserContextMenuCommandInteraction
  message: MessageContextMenuCommandInteraction
}

export type ContextMenuCommand<
  Type extends keyof InteractionMap | "undefined" = "undefined",
  Keys extends keyof ContextMenuCommand | "" = "",
> = Unwrap<
  Omit<
    {
      builder: ContextMenuCommandBuilder
      type: Type
      user(): ContextMenuCommand<
        "user",
        Exclude<Keys, "type" | "handler"> | "user" | "message"
      >
      message(): ContextMenuCommand<
        "message",
        Exclude<Keys, "type" | "handler"> | "user" | "message"
      >
      contexts(
        context: InteractionContextType,
        ...rest: InteractionContextType[]
      ): ContextMenuCommand<Type, Keys | "contexts">
      defaultMemberPermissions(
        permissions: Permissions | bigint,
      ): ContextMenuCommand<Type, Keys | "defaultMemberPermissions">
      integrationTypes(
        type: ApplicationIntegrationType,
        ...rest: ApplicationIntegrationType[]
      ): ContextMenuCommand<Type, Keys | "integrationTypes">
      handler(
        handler: (interaction: InteractionMap[Type]) => Promise<void>,
      ): ContextMenuCommand<Type, Exclude<Keys, "handle"> | "handler">
      handle(interaction: InteractionMap[Type]): Promise<void>
    },
    Keys
  >
>

export function getOptionValue<
  Type extends keyof TypeMap,
  O extends PartialOption<Type>,
>(interaction: ChatInputCommandInteraction, option: O): OptionValue<O> {
  let value

  switch (option.type) {
    case "attachment":
      value = interaction.options.getAttachment(
        option.builder.name,
        !option.required,
      )
      break
    case "boolean":
      value = interaction.options.getBoolean(
        option.builder.name,
        !option.required,
      )
      break
    case "channel":
      value = interaction.options.getChannel(
        option.builder.name,
        !option.required,
      )
      break
    case "integer":
      value = interaction.options.getInteger(
        option.builder.name,
        !option.required,
      )
      break
    case "mentionable":
      value = interaction.options.getMentionable(
        option.builder.name,
        !option.required,
      )
      break
    case "number":
      value = interaction.options.getNumber(
        option.builder.name,
        !option.required,
      )
      break
    case "role":
      value = interaction.options.getRole(option.builder.name, !option.required)
      break
    case "string":
      value = interaction.options.getString(
        option.builder.name,
        !option.required,
      )
      break
    case "user":
      value = interaction.options.getUser(option.builder.name, !option.required)
      break
    default:
      value = undefined
      break
  }

  return (value ?? undefined) as OptionValue<O>
}

export function applyOptions(
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  options: Record<string, PartialOption>,
) {
  for (const [name, option] of Object.entries(options)) {
    option.builder.setName(name)

    // TODO this could be better
    switch (option.type) {
      case "string":
        builder.addStringOption((option as PartialOption<"string">).builder)
        break
      case "number":
        builder.addNumberOption((option as PartialOption<"number">).builder)
        break
      case "boolean":
        builder.addBooleanOption((option as PartialOption<"boolean">).builder)
        break
      case "integer":
        builder.addIntegerOption((option as PartialOption<"integer">).builder)
        break
      case "channel":
        builder.addChannelOption((option as PartialOption<"channel">).builder)
        break
      case "attachment":
        builder.addAttachmentOption(
          (option as PartialOption<"attachment">).builder,
        )
        break
      case "mentionable":
        builder.addMentionableOption(
          (option as PartialOption<"mentionable">).builder,
        )
        break
      case "role":
        builder.addRoleOption((option as PartialOption<"role">).builder)
        break
      case "user":
        builder.addUserOption((option as PartialOption<"user">).builder)
        break
      default:
        throw new InternalError("unsupported_option_type")
    }
  }
}
