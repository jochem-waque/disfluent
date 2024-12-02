/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  ApplicationCommandOptionAllowedChannelTypes,
  AutocompleteInteraction,
  Channel,
  ChannelType,
  LocaleString,
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandMentionableOption,
  SlashCommandNumberOption,
  SlashCommandRoleOption,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from "discord.js"
import { OptionTypeMap } from "./internal.mjs"
import { UndefinedToOptional, Unwrap } from "./util.mjs"

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

export type Option<
  Type extends keyof OptionTypeMap = keyof OptionTypeMap,
  Keys extends keyof Option | "" = "",
> = Unwrap<
  Omit<
    {
      builder: BuilderMap[Type]
      type: Type
      nameLocalizations(
        localizations: Partial<Record<LocaleString, Lowercase<string>>>,
      ): Option<Type, Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<LocaleString, string>>,
      ): Option<Type, Keys | "descriptionLocalizations">
      required(): Option<Type, Keys | "required">
      choices<const T extends Record<string, OptionTypeMap[Type]>>(
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
          | Promise<Record<string, OptionTypeMap[Type]>>
          | Record<string, OptionTypeMap[Type]>,
      ): Option<Type, Exclude<Keys, "handleAutocomplete"> | "choices">
      maxValue(value: OptionTypeMap[Type]): Option<Type, Keys | "maxValue">
      minValue(value: OptionTypeMap[Type]): Option<Type, Keys | "minValue">
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
      builder: BuilderMap["channel"]
      type: "channel"
      channelTypes: Types
      nameLocalizations(
        localizations: Partial<Record<LocaleString, Lowercase<string>>>,
      ): OptionWithChannelTypes<Types, Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<LocaleString, string>>,
      ): OptionWithChannelTypes<Types, Keys | "descriptionLocalizations">
      required(): OptionWithChannelTypes<Types, Keys | "required">
    },
    Keys
  >
>

type OptionWithChoices<
  Choices extends Record<string, OptionTypeMap[Type]>,
  Type extends keyof OptionTypeMap = keyof OptionTypeMap,
  Keys extends keyof Option | "" = "",
> = Unwrap<
  Omit<
    {
      builder: BuilderMap[Type]
      type: Type
      choices: Choices
      nameLocalizations(
        localizations: Partial<Record<LocaleString, Lowercase<string>>>,
      ): OptionWithChoices<Choices, Type, Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<LocaleString, string>>,
      ): OptionWithChoices<Choices, Type, Keys | "descriptionLocalizations">
      required(): OptionWithChoices<Choices, Type, Keys | "required">
      maxValue(
        value: OptionTypeMap[Type],
      ): OptionWithChoices<Choices, Type, Keys | "maxValue">
      minValue(
        value: OptionTypeMap[Type],
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
  Type extends keyof OptionTypeMap = keyof OptionTypeMap,
> = Pick<Option<Type>, "builder" | "type"> &
  Partial<Pick<Option<Type>, "handleAutocomplete">> & {
    required?: () => unknown
  }

type PartialOptionWithChannelTypes<
  Types extends readonly ApplicationCommandOptionAllowedChannelTypes[],
> = Pick<OptionWithChannelTypes<Types>, "builder" | "type">

type PartialOptionWithChoices<
  Choices extends Record<string, OptionTypeMap[Type]>,
  Type extends "number" | "integer" | "string" =
    | "number"
    | "integer"
    | "string",
> = Pick<OptionWithChoices<Choices, Type>, "builder" | "type" | "choices">

type MapChannelType<Type extends ChannelType> = Extract<
  Channel,
  {
    type: Type extends ChannelType.PublicThread | ChannelType.AnnouncementThread
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
      : OptionTypeMap[T["type"]]

export type OptionValue<T extends PartialOption> =
  T["required"] extends () => void
    ? RequiredOptionValue<T> | undefined
    : RequiredOptionValue<T>

export type OptionValues<T extends Record<string, PartialOption>> = Unwrap<
  UndefinedToOptional<{
    [K in keyof T]: OptionValue<T[K]>
  }>
>
