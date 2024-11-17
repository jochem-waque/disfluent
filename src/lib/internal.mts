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

export type Option<
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
            choices: T, // TODO NotEmpty
          ): OptionWithChoices<T, Type, Keys | "autocomplete">
        } & (Autocomplete extends true
          ? {
              handleAutocomplete: (
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

// TODO this could be better
export type PartialOption<
  Type extends keyof TypeMap = keyof TypeMap,
  Keys extends keyof Option = "builder" | "type",
> = InvertedPartialize<Option<Type>, Keys> & {
  handleAutocomplete?: (interaction: AutocompleteInteraction) => Promise<void>
}

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

type PartialOptionWithChoices<
  Choices extends Record<string, TypeMap[Type]>,
  Type extends "number" | "integer" | "string" =
    | "number"
    | "integer"
    | "string",
  Keys extends keyof Option = "builder" | "type",
> = InvertedPartialize<OptionWithChoices<Choices, Type>, Keys>

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

export function getOptionValue<
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
