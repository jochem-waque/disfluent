/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  ButtonInteraction,
  ChannelSelectMenuBuilder,
  ChannelType,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  UserSelectMenuBuilder,
  type ActionRowBuilder,
  type AnySelectMenuInteraction,
  type APIActionRowComponent,
  type APIActionRowComponentTypes,
  type APIMessageComponent,
  type ButtonBuilder,
  type ButtonStyle,
  type ComponentEmojiResolvable,
  type ComponentType,
  type SelectMenuType,
  type Snowflake,
  type TextInputBuilder,
} from "discord.js"
import type { Unwrap } from "./util.mts"

type ComponentInteraction<Type extends ComponentType> = (
  | AnySelectMenuInteraction
  | ButtonInteraction
) & {
  componentType: Type
}

type APIComponent<Type extends ComponentType> = APIMessageComponent & {
  type: Type
}

type BuilderMap<Type extends ComponentType> = {
  [ComponentType.ActionRow]: ActionRowBuilder
  [ComponentType.Button]: ButtonBuilder
  [ComponentType.StringSelect]: StringSelectMenuBuilder
  [ComponentType.TextInput]: TextInputBuilder
  [ComponentType.UserSelect]: UserSelectMenuBuilder
  [ComponentType.RoleSelect]: RoleSelectMenuBuilder
  [ComponentType.MentionableSelect]: MentionableSelectMenuBuilder
  [ComponentType.ChannelSelect]: ChannelSelectMenuBuilder
}[Type]

type ComponentHandler<
  Type extends ComponentType,
  Arguments extends readonly string[],
> = (
  interaction: ComponentInteraction<Type>,
  ...args: Arguments
) => Promise<void>

export type ComponentBuilder<
  Type extends ComponentType = ComponentType,
  Options extends
    | Record<string, PartialStringSelectOption>
    | undefined = undefined,
  Arguments extends readonly string[] = string[],
> = Type extends ComponentType.StringSelect
  ? StringSelectBuilder<StringValues<Options>, Arguments>
  : {
      readonly id: string
      readonly type: Type
      build(...args: Arguments): APIComponent<Type>
      handle(
        interaction: ComponentInteraction<Type>,
        ...args: Arguments
      ): Promise<void>
    }

export type StringSelectBuilder<
  Selectable extends string,
  Arguments extends readonly string[] = string[],
> = {
  readonly id: string
  readonly type: ComponentType.StringSelect
  build(
    defaults?: Selectable[],
    ...args: Arguments
  ): APIComponent<ComponentType.StringSelect>
  handle(
    interaction: ComponentInteraction<ComponentType.StringSelect>,
    ...args: Arguments
  ): Promise<void>
}

export type ComponentSelector = {
  row<Type extends APIActionRowComponentTypes>(
    component: Type,
    ...rest: Type[]
  ): APIActionRowComponent<Type>
  button(style: ButtonStyle): Button<"handler">
  select(): SelectMenuSelector
  // TODO textInput
}

export type SelectMenuSelector = {
  string(
    id: string,
  ): SelectMenu<
    ComponentType.StringSelect,
    undefined,
    undefined,
    | "defaultUsers"
    | "defaultRoles"
    | "defaultChannels"
    | "channelTypes"
    | "~channelTypes"
    | "~options"
    | "handler"
  >
  user(
    id: string,
  ): SelectMenu<
    ComponentType.UserSelect,
    undefined,
    undefined,
    | "options"
    | "defaultRoles"
    | "defaultChannels"
    | "channelTypes"
    | "~channelTypes"
    | "~options"
  >
  role(
    id: string,
  ): SelectMenu<
    ComponentType.RoleSelect,
    undefined,
    undefined,
    | "options"
    | "defaultUsers"
    | "defaultChannels"
    | "channelTypes"
    | "~channelTypes"
    | "~options"
  >
  mentionable(
    id: string,
  ): SelectMenu<
    ComponentType.MentionableSelect,
    undefined,
    undefined,
    | "options"
    | "defaultChannels"
    | "channelTypes"
    | "~channelTypes"
    | "~options"
  >
  channel(
    id: string,
  ): SelectMenu<
    ComponentType.ChannelSelect,
    undefined,
    undefined,
    "options" | "defaultUsers" | "defaultRoles" | "~channelTypes" | "~options"
  >
  stringOption<Value extends string>(value: Value): StringSelectOption<Value>
}

export type Button<Keys extends keyof Button | "" = ""> = Unwrap<
  Omit<
    {
      readonly builder: BuilderMap<ComponentType.Button>
      id(id: string): Button<Exclude<Keys, "handler"> | "id" | "url">
      disabled(): Button<Keys | "disabled">
      emoji(emoji: ComponentEmojiResolvable): Button<Keys | "emoji">
      label(label: string): Button<Keys | "label">
      url(url: URL): APIComponent<ComponentType.Button>
      handler<Arguments extends readonly string[]>(
        handler: ComponentHandler<ComponentType.Button, Arguments>,
      ): ComponentBuilder<ComponentType.Button, undefined, Arguments>
    },
    Keys
  >
>

export type SelectMenu<
  Type extends SelectMenuType,
  ChannelTypes extends readonly ChannelType[] | undefined = undefined,
  Options extends
    | Record<string, PartialStringSelectOption>
    | undefined = undefined,
  Keys extends keyof SelectMenu<Type> | "" = "",
> = Unwrap<
  Omit<
    {
      readonly "~channelTypes": ChannelTypes
      readonly "~options": Options
      readonly builder: BuilderMap<Type>
      readonly type: Type
      disabled(): SelectMenu<Type, ChannelTypes, Options, Keys | "disabled">
      maxValues(
        value: number,
      ): SelectMenu<Type, ChannelTypes, Options, Keys | "maxValues">
      minValues(
        value: number,
      ): SelectMenu<Type, ChannelTypes, Options, Keys | "minValues">
      placeholder(
        text: string,
      ): SelectMenu<Type, ChannelTypes, Options, Keys | "placeholder">
      handler<Arguments extends readonly string[]>(
        handler: ComponentHandler<Type, Arguments>,
      ): ComponentBuilder<Type, Options, Arguments>
      // TODO
      options<NewOptions extends Record<string, PartialStringSelectOption>>(
        options: NewOptions,
      ): SelectMenu<
        Type,
        ChannelTypes,
        NewOptions,
        Exclude<Keys, "~options" | "handler"> | "options"
      >
      defaultUsers(
        ...users: Snowflake[]
      ): SelectMenu<Type, ChannelTypes, Options, Keys | "defaultUsers">
      defaultRoles(
        ...roles: Snowflake[]
      ): SelectMenu<Type, ChannelTypes, Options, Keys | "defaultRoles">
      defaultChannels(
        ...channels: Snowflake[]
      ): SelectMenu<Type, ChannelTypes, Options, Keys | "defaultChannels">
      channelTypes<NewChannelTypes extends readonly ChannelType[]>(
        ...types: NewChannelTypes
      ): SelectMenu<
        Type,
        NewChannelTypes,
        Options,
        Exclude<Keys, "~channelTypes"> | "channelTypes"
      >
    },
    Keys
  >
>

export type StringSelectOption<
  Value extends string,
  Keys extends keyof StringSelectOption<string> | "" = "",
> = Unwrap<
  Omit<
    {
      readonly "~value": Value
      readonly builder: StringSelectMenuOptionBuilder
      description(
        description: string,
      ): StringSelectOption<Value, Keys | "description">
      emoji(
        emoji: ComponentEmojiResolvable,
      ): StringSelectOption<Value, Keys | "emoji">
      default(): StringSelectOption<Value, Keys | "default">
    },
    Keys
  >
>

export type PartialStringSelectOption = Pick<
  StringSelectOption<string>,
  "builder" | "~value"
>

export type PartialSelectMenu<Type extends SelectMenuType = SelectMenuType> =
  Pick<SelectMenu<Type>, "builder" | "type">

type StringValues<Data> =
  Data extends Record<string, infer Values extends StringSelectOption<string>>
    ? Values["~value"]
    : never

export type Row<Keys extends keyof Row | "" = ""> = Unwrap<
  Omit<
    {
      components(): Row<Keys | "components">
      button(): Button
    },
    Keys
  >
>
