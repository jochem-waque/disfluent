/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  type ApplicationCommandOptionAllowedChannelTypes,
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  type Channel,
  ChannelType,
  CommandInteractionOptionResolver,
  Locale,
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
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
import type { UndefinedToOptional, Unwrap } from "./util.mts"

type OptionTypeMap<Type extends ApplicationCommandOptionType> = {
  [ApplicationCommandOptionType.Subcommand]: ReturnType<
    CommandInteractionOptionResolver<"cached">["getSubcommand"]
  > & {}
  [ApplicationCommandOptionType.SubcommandGroup]: ReturnType<
    CommandInteractionOptionResolver<"cached">["getSubcommandGroup"]
  > & {}
  [ApplicationCommandOptionType.Attachment]: ReturnType<
    CommandInteractionOptionResolver<"cached">["getAttachment"]
  > & {}
  [ApplicationCommandOptionType.Boolean]: ReturnType<
    CommandInteractionOptionResolver<"cached">["getBoolean"]
  > & {}
  [ApplicationCommandOptionType.Channel]: ReturnType<
    CommandInteractionOptionResolver<"cached">["getChannel"]
  > & {}
  [ApplicationCommandOptionType.Integer]: ReturnType<
    CommandInteractionOptionResolver<"cached">["getInteger"]
  > & {}
  [ApplicationCommandOptionType.Mentionable]: ReturnType<
    CommandInteractionOptionResolver<"cached">["getMentionable"]
  > & {}
  [ApplicationCommandOptionType.Number]: ReturnType<
    CommandInteractionOptionResolver<"cached">["getNumber"]
  > & {}
  [ApplicationCommandOptionType.Role]: ReturnType<
    CommandInteractionOptionResolver<"cached">["getRole"]
  > & {}
  [ApplicationCommandOptionType.String]: ReturnType<
    CommandInteractionOptionResolver<"cached">["getString"]
  > & {}
  [ApplicationCommandOptionType.User]: ReturnType<
    CommandInteractionOptionResolver<"cached">["getUser"]
  > & {}
}[Type]

type BuilderMap<Type extends ApplicationCommandOptionType> = {
  [ApplicationCommandOptionType.Subcommand]: SlashCommandSubcommandBuilder
  [ApplicationCommandOptionType.SubcommandGroup]: SlashCommandSubcommandGroupBuilder
  [ApplicationCommandOptionType.String]: SlashCommandStringOption
  [ApplicationCommandOptionType.Integer]: SlashCommandIntegerOption
  [ApplicationCommandOptionType.Boolean]: SlashCommandBooleanOption
  [ApplicationCommandOptionType.User]: SlashCommandUserOption
  [ApplicationCommandOptionType.Channel]: SlashCommandChannelOption
  [ApplicationCommandOptionType.Role]: SlashCommandRoleOption
  [ApplicationCommandOptionType.Mentionable]: SlashCommandMentionableOption
  [ApplicationCommandOptionType.Number]: SlashCommandNumberOption
  [ApplicationCommandOptionType.Attachment]: SlashCommandAttachmentOption
}[Type]

export type DefaultKeys = {
  standard:
    | "autocomplete"
    | "choices"
    | "handleAutocomplete"
    | "maxLength"
    | "minLength"
    | "maxValue"
    | "minValue"
    | "channelTypes"
  channel:
    | "autocomplete"
    | "choices"
    | "handleAutocomplete"
    | "maxLength"
    | "minLength"
    | "maxValue"
    | "minValue"
  text: "handleAutocomplete" | "maxValue" | "minValue" | "channelTypes"
  numeric: "handleAutocomplete" | "maxLength" | "minLength" | "channelTypes"
}

export type OptionSelector = {
  attachment(): Option<
    ApplicationCommandOptionType.Attachment,
    DefaultKeys["standard"]
  >
  boolean(): Option<
    ApplicationCommandOptionType.Boolean,
    DefaultKeys["standard"]
  >
  channel(): Option<
    ApplicationCommandOptionType.Channel,
    DefaultKeys["channel"]
  >
  integer(): Option<
    ApplicationCommandOptionType.Integer,
    DefaultKeys["numeric"]
  >
  mentionable(): Option<
    ApplicationCommandOptionType.Mentionable,
    DefaultKeys["standard"]
  >
  number(): Option<ApplicationCommandOptionType.Number, DefaultKeys["numeric"]>
  role(): Option<ApplicationCommandOptionType.Role, DefaultKeys["standard"]>
  string(): Option<ApplicationCommandOptionType.String, DefaultKeys["text"]>
  user(): Option<ApplicationCommandOptionType.User, DefaultKeys["standard"]>
}

export type Option<
  Type extends ApplicationCommandOptionType = ApplicationCommandOptionType,
  Keys extends keyof Option | "" = "",
> = Unwrap<
  Omit<
    {
      readonly builder: BuilderMap<Type>
      readonly type: Type
      nameLocalizations(
        localizations: Partial<Record<Locale, Lowercase<string>>>,
      ): Option<Type, Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<Locale, string>>,
      ): Option<Type, Keys | "descriptionLocalizations">
      required(): Option<Type, Keys | "required">
      choices<const T extends Record<string, OptionTypeMap<Type>>>(
        choices: T, // TODO NotEmpty
      ): OptionWithChoices<T, Type, Keys | "autocomplete">
      handleAutocomplete: (
        interaction: AutocompleteInteraction,
      ) => Promise<void>
      autocomplete(
        handler: (
          value: string,
          interaction: AutocompleteInteraction,
        ) =>
          | Promise<Record<string, OptionTypeMap<Type>>>
          | Record<string, OptionTypeMap<Type>>,
      ): Option<Type, Exclude<Keys, "handleAutocomplete"> | "choices">
      maxValue(value: OptionTypeMap<Type>): Option<Type, Keys | "maxValue">
      minValue(value: OptionTypeMap<Type>): Option<Type, Keys | "minValue">
      maxLength(length: number): Option<Type, Keys | "maxLength">
      minLength(length: number): Option<Type, Keys | "minLength">
      channelTypes<
        Types extends readonly ApplicationCommandOptionAllowedChannelTypes[],
      >(
        ...types: Types
      ): OptionWithChannelTypes<Types, Keys>
    },
    Keys
  >
>

type OptionWithChannelTypes<
  Types extends readonly ApplicationCommandOptionAllowedChannelTypes[],
  Keys extends keyof Option | "" = "",
> = Unwrap<
  Omit<
    {
      readonly builder: BuilderMap<ApplicationCommandOptionType.Channel>
      readonly type: ApplicationCommandOptionType.Channel
      readonly channelTypes: Types
      nameLocalizations(
        localizations: Partial<Record<Locale, Lowercase<string>>>,
      ): OptionWithChannelTypes<Types, Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<Locale, string>>,
      ): OptionWithChannelTypes<Types, Keys | "descriptionLocalizations">
      required(): OptionWithChannelTypes<Types, Keys | "required">
    },
    Keys
  >
>

type OptionWithChoices<
  Choices extends Record<string, OptionTypeMap<Type>>,
  Type extends ApplicationCommandOptionType = ApplicationCommandOptionType,
  Keys extends keyof Option | "" = "",
> = Unwrap<
  Omit<
    {
      readonly builder: BuilderMap<Type>
      readonly type: Type
      readonly choices: Choices
      nameLocalizations(
        localizations: Partial<Record<Locale, Lowercase<string>>>,
      ): OptionWithChoices<Choices, Type, Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<Locale, string>>,
      ): OptionWithChoices<Choices, Type, Keys | "descriptionLocalizations">
      required(): OptionWithChoices<Choices, Type, Keys | "required">
      maxValue(
        value: OptionTypeMap<Type>,
      ): OptionWithChoices<Choices, Type, Keys | "maxValue">
      minValue(
        value: OptionTypeMap<Type>,
      ): OptionWithChoices<Choices, Type, Keys | "minValue">
      maxLength(
        length: number,
      ): OptionWithChoices<Choices, Type, Keys | "maxLength">
      minLength(
        length: number,
      ): OptionWithChoices<Choices, Type, Keys | "minLength">
    },
    Keys
  >
>

export type PartialOption<
  Type extends ApplicationCommandOptionType = ApplicationCommandOptionType,
> = Pick<Option<Type>, "builder" | "type"> &
  Partial<Pick<Option<Type>, "handleAutocomplete">> & {
    required?: () => unknown
  }

type PartialOptionWithChannelTypes<
  Types extends readonly ApplicationCommandOptionAllowedChannelTypes[],
> = Pick<OptionWithChannelTypes<Types>, "builder" | "type" | "channelTypes">

type PartialOptionWithChoices<
  Choices extends Record<string, OptionTypeMap<Type>>,
  Type extends ApplicationCommandOptionType = ApplicationCommandOptionType,
> = Pick<OptionWithChoices<Choices, Type>, "builder" | "type" | "choices">

type MapChannelType<Type extends ChannelType> = Extract<
  Channel,
  {
    readonly type: Type extends
      | ChannelType.PublicThread
      | ChannelType.AnnouncementThread
      ? ChannelType.PublicThread | ChannelType.AnnouncementThread
      : Type
  }
>

type RequiredOptionValue<T extends PartialOption> =
  T extends PartialOptionWithChannelTypes<
    infer C extends readonly ApplicationCommandOptionAllowedChannelTypes[]
  >
    ? MapChannelType<C[number]>
    : T extends PartialOptionWithChoices<infer R>
      ? R extends Record<string, infer V>
        ? V
        : never
      : OptionTypeMap<T["type"]>

export type OptionValue<T extends PartialOption> =
  T["required"] extends () => void
    ? RequiredOptionValue<T> | undefined
    : RequiredOptionValue<T>

export type OptionValues<T extends Record<string, PartialOption>> = Unwrap<
  UndefinedToOptional<{
    [K in keyof T]: OptionValue<T[K]>
  }>
>
