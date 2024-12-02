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
import { InvertedPartialize, UndefinedToOptional, Unwrap } from "./util.mjs"

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

// TODO this could be better
type OptionKeys =
  | keyof Option<"string">
  | keyof Option<"number">
  | keyof Option<"channel">

export type Option<
  Type extends keyof OptionTypeMap = keyof OptionTypeMap,
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
          choices<const T extends Record<string, OptionTypeMap[Type]>>(
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
                  | Promise<Record<string, OptionTypeMap[Type]>>
                  | Record<string, OptionTypeMap[Type]>,
              ): Option<Type, Keys | "choices", true>
            })
      : object) &
      (Type extends "integer" | "number"
        ? {
            maxValue(
              value: OptionTypeMap[Type],
            ): Option<Type, Keys | "maxValue", Autocomplete>
            minValue(
              value: OptionTypeMap[Type],
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
  Type extends keyof OptionTypeMap = keyof OptionTypeMap,
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
  Choices extends Record<string, OptionTypeMap[Type]>,
  Type extends keyof OptionTypeMap = keyof OptionTypeMap,
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
            value: OptionTypeMap[Type],
          ): OptionWithChoices<Choices, Type, Keys | "maxValue">
          minValue(
            value: OptionTypeMap[Type],
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
  Choices extends Record<string, OptionTypeMap[Type]>,
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

type RequiredOptionValue<T extends PartialOption<keyof OptionTypeMap, "type">> =
  T extends PartialOptionWithChannelTypes<
    infer C extends readonly ApplicationCommandOptionAllowedChannelTypes[]
  >
    ? MapChannelType<C[number]>
    : T extends PartialOptionWithChoices<infer R>
      ? R extends Record<string, infer V>
        ? V
        : never
      : OptionTypeMap[T["type"]]

export type OptionValue<T extends PartialOption<keyof OptionTypeMap, "type">> =
  T["required"] extends () => void
    ? RequiredOptionValue<T> | undefined
    : RequiredOptionValue<T>

export type OptionValues<
  T extends Record<string, PartialOption<keyof OptionTypeMap, "type">>,
> = Unwrap<
  UndefinedToOptional<{
    [K in keyof T]: OptionValue<T[K]>
  }>
>
