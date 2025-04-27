/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type {
  ChannelType,
  ComponentEmojiResolvable,
  ComponentType,
  SelectMenuType,
  Snowflake,
  StringSelectMenuOptionBuilder,
} from "discord.js"
import type { Unwrap } from "../util.mts"
import type {
  BuilderMap,
  ComponentBuilder,
  ComponentHandler,
  ComponentInteraction,
} from "./shared.mts"

export type SelectMenuSelector = {
  string(
    customId: string,
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
    customId: string,
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
    customId: string,
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
    customId: string,
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
    customId: string,
  ): SelectMenu<
    ComponentType.ChannelSelect,
    undefined,
    undefined,
    "options" | "defaultUsers" | "defaultRoles" | "~channelTypes" | "~options"
  >
  stringOption<Value extends string>(value: Value): StringSelectOption<Value>
}

type SelectMenu<
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
        handler: ComponentHandler<Type, Options, Arguments>,
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

export type PartialStringSelectOption = Pick<
  StringSelectOption<string>,
  "builder" | "~value"
>

type StringSelectOption<
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

export type StringSelectBuilder<
  Selectable extends string,
  Arguments extends readonly string[] = string[],
> = {
  readonly id: string
  readonly type: ComponentType.StringSelect
  with(
    defaults?: Selectable[],
    ...args: Arguments
  ): BuilderMap<ComponentType.StringSelect>
  handle(
    interaction: Omit<
      ComponentInteraction<ComponentType.StringSelect>,
      "values"
    > & { values: Selectable[] },
    ...args: Arguments
  ): Promise<void>
}
