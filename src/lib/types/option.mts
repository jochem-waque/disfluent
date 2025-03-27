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
    | "~channelTypes"
    | "~choices"
  channel:
    | "autocomplete"
    | "choices"
    | "handleAutocomplete"
    | "maxLength"
    | "minLength"
    | "maxValue"
    | "minValue"
    | "~channelTypes"
    | "~choices"
  text:
    | "handleAutocomplete"
    | "maxValue"
    | "minValue"
    | "channelTypes"
    | "~channelTypes"
    | "~choices"
  numeric:
    | "handleAutocomplete"
    | "maxLength"
    | "minLength"
    | "channelTypes"
    | "~channelTypes"
    | "~choices"
}

export type OptionSelector = {
  attachment(): Option<
    ApplicationCommandOptionType.Attachment,
    undefined,
    undefined,
    DefaultKeys["standard"]
  >
  boolean(): Option<
    ApplicationCommandOptionType.Boolean,
    undefined,
    undefined,
    DefaultKeys["standard"]
  >
  channel(): Option<
    ApplicationCommandOptionType.Channel,
    undefined,
    undefined,
    DefaultKeys["channel"]
  >
  integer(): Option<
    ApplicationCommandOptionType.Integer,
    undefined,
    undefined,
    DefaultKeys["numeric"]
  >
  mentionable(): Option<
    ApplicationCommandOptionType.Mentionable,
    undefined,
    undefined,
    DefaultKeys["standard"]
  >
  number(): Option<
    ApplicationCommandOptionType.Number,
    undefined,
    undefined,
    DefaultKeys["numeric"]
  >
  role(): Option<
    ApplicationCommandOptionType.Role,
    undefined,
    undefined,
    DefaultKeys["standard"]
  >
  string(): Option<
    ApplicationCommandOptionType.String,
    undefined,
    undefined,
    DefaultKeys["text"]
  >
  user(): Option<
    ApplicationCommandOptionType.User,
    undefined,
    undefined,
    DefaultKeys["standard"]
  >
}

export type Option<
  Type extends ApplicationCommandOptionType = ApplicationCommandOptionType,
  ChannelTypes extends
    | readonly ApplicationCommandOptionAllowedChannelTypes[]
    | undefined = undefined,
  Choices extends Record<string, OptionTypeMap<Type>> | undefined = undefined,
  Keys extends keyof Option | "" = "",
> = Unwrap<
  Omit<
    {
      readonly "~channelTypes": ChannelTypes
      readonly "~choices": Choices
      readonly builder: BuilderMap<Type>
      readonly type: Type
      nameLocalizations(
        localizations: Partial<Record<Locale, Lowercase<string>>>,
      ): Option<Type, ChannelTypes, Choices, Keys | "nameLocalizations">
      descriptionLocalizations(
        localizations: Partial<Record<Locale, string>>,
      ): Option<Type, ChannelTypes, Choices, Keys | "descriptionLocalizations">
      required(): Option<Type, ChannelTypes, Choices, Keys | "required">
      choices<const NewChoices extends Record<string, OptionTypeMap<Type>>>(
        choices: NewChoices, // TODO NotEmpty
      ): Option<
        Type,
        ChannelTypes,
        NewChoices,
        Exclude<Keys, "~choices"> | "autocomplete" | "choices"
      >
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
      ): Option<
        Type,
        ChannelTypes,
        Choices,
        Exclude<Keys, "handleAutocomplete"> | "choices"
      >
      maxValue(
        value: OptionTypeMap<Type>,
      ): Option<Type, ChannelTypes, Choices, Keys | "maxValue">
      minValue(
        value: OptionTypeMap<Type>,
      ): Option<Type, ChannelTypes, Choices, Keys | "minValue">
      maxLength(
        length: number,
      ): Option<Type, ChannelTypes, Choices, Keys | "maxLength">
      minLength(
        length: number,
      ): Option<Type, ChannelTypes, Choices, Keys | "minLength">
      channelTypes<
        NewChannelTypes extends
          readonly ApplicationCommandOptionAllowedChannelTypes[],
      >(
        ...types: NewChannelTypes
      ): Option<
        Type,
        NewChannelTypes,
        Choices,
        Exclude<Keys, "~channelTypes"> | "channelTypes"
      >
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

export type RequiredOptionValue<Opt extends PartialOption> =
  Opt extends Pick<
    Option<
      ApplicationCommandOptionType.Channel,
      infer ChannelTypes extends
        readonly ApplicationCommandOptionAllowedChannelTypes[]
    >,
    "~channelTypes"
  >
    ? MapChannelType<ChannelTypes[number]>
    : Opt extends Pick<
          Option<
            ApplicationCommandOptionType,
            undefined,
            infer Choices extends Record<
              string,
              OptionTypeMap<ApplicationCommandOptionType>
            >
          >,
          "~choices"
        >
      ? Choices extends Record<string, infer Values>
        ? Values
        : never
      : Opt extends Pick<
            Option<infer Type extends ApplicationCommandOptionType>,
            "type"
          >
        ? OptionTypeMap<Type>
        : never

export type OptionValue<Opt extends PartialOption> =
  Opt["required"] extends () => void
    ? RequiredOptionValue<Opt> | undefined
    : RequiredOptionValue<Opt>

export type OptionValues<Opts extends Record<string, PartialOption>> = Unwrap<
  UndefinedToOptional<{
    [K in keyof Opts]: OptionValue<Opts[K]>
  }>
>
