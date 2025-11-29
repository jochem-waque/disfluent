/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  ChannelSelectMenuBuilder,
  ComponentType,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  UserSelectMenuBuilder,
  type SelectMenuType,
} from "discord.js"
import type {
  BuilderMap,
  ComponentBuilder,
  ComponentHandler,
} from "../../external.mts"
import type {
  SelectMenuSelector,
  StringSelectBuilder,
} from "../../types/component/select.mts"
import { InternalError } from "../error.mts"
import { Components } from "../internal.mts"

export function select(): SelectMenuSelector {
  return {
    string,
    user,
    role,
    mentionable,
    channel,
    stringOption(value) {
      return {
        "~value": value,
        builder: new StringSelectMenuOptionBuilder().setValue(value),
        default() {
          this.builder.setDefault(true)
          return this
        },
        description(description) {
          this.builder.setDescription(description)
          return this
        },
        emoji(emoji) {
          this.builder.setEmoji(emoji)
          return this
        },
      }
    },
  }
}

function builder<
  Builder extends BuilderMap<Type>,
  Type extends Exclude<SelectMenuType, ComponentType.StringSelect>,
  Arguments extends readonly string[],
>(
  base: Builder,
  constructor: new (data: ReturnType<Builder["toJSON"]>) => Builder,
  handle: ComponentHandler<Type, undefined, Arguments>,
): ComponentBuilder<Type, undefined, Arguments> {
  const data = base.toJSON() as ReturnType<Builder["toJSON"]>
  if (!("custom_id" in data) || !data.custom_id) {
    throw new InternalError(
      "missing_custom_id",
      "Can't set handler for button component without a custom ID",
    )
  }

  const component = {
    id: data.custom_id,
    type: data.type,
    with(...args: Arguments) {
      return new constructor(data).setCustomId(
        [data.custom_id, ...args].join(":"),
      )
    },
    handle,
  } as ComponentBuilder<Type, undefined, Arguments>

  Components.set(data.custom_id, component)

  return component
}

function stringSelectBuilder<Arguments extends readonly string[]>(
  base: StringSelectMenuBuilder,
  constructor: new (
    data: ReturnType<StringSelectMenuBuilder["toJSON"]>,
  ) => StringSelectMenuBuilder,
  handle: StringSelectBuilder<string, Arguments>["handle"],
): StringSelectBuilder<string, Arguments> {
  const data = base.toJSON()
  if (!("custom_id" in data) || !data.custom_id) {
    throw new InternalError(
      "missing_custom_id",
      "Can't set handler for button component without a custom ID",
    )
  }

  const component: StringSelectBuilder<string, Arguments> = {
    id: data.custom_id,
    type: data.type,
    with(defaults, ...args) {
      const builder = new constructor(data).setCustomId(
        [data.custom_id, ...args].join(":"),
      )

      const defaultsSet = new Set(defaults)

      for (const option of builder.options) {
        if (option.data.value && defaultsSet.has(option.data.value)) {
          option.setDefault(true)
        }
      }

      return builder
    },
    handle,
  }

  Components.set(data.custom_id, component)

  return component
}

function string(id: string): ReturnType<SelectMenuSelector["string"]> {
  return {
    type: ComponentType.StringSelect,
    builder: new StringSelectMenuBuilder().setCustomId(id),
    id(id) {
      this.builder.setId(id)
      return this
    },
    disabled() {
      this.builder.setDisabled(true)
      return this
    },
    maxValues(value) {
      this.builder.setMaxValues(value)
      return this
    },
    minValues(value) {
      this.builder.setMinValues(value)
      return this
    },
    placeholder(text) {
      this.builder.setPlaceholder(text)
      return this
    },
    options(options) {
      for (const [label, option] of Object.entries(options)) {
        option.builder.setLabel(label)
        this.builder.addOptions(option.builder)
      }

      return {
        ...this,
        "~options": options,
        id(id) {
          this.builder.setId(id)
          return this
        },
        disabled() {
          this.builder.setDisabled(true)
          return this
        },
        maxValues(value) {
          this.builder.setMaxValues(value)
          return this
        },
        minValues(value) {
          this.builder.setMinValues(value)
          return this
        },
        placeholder(text) {
          this.builder.setPlaceholder(text)
          return this
        },
        handler(handle) {
          return stringSelectBuilder(
            this.builder,
            StringSelectMenuBuilder,
            handle,
          )
        },
      }
    },
  }
}

function user(id: string): ReturnType<SelectMenuSelector["user"]> {
  return {
    type: ComponentType.UserSelect,
    builder: new UserSelectMenuBuilder().setCustomId(id),
    id(id) {
      this.builder.setId(id)
      return this
    },
    disabled() {
      this.builder.setDisabled(true)
      return this
    },
    maxValues(value) {
      this.builder.setMaxValues(value)
      return this
    },
    minValues(value) {
      this.builder.setMinValues(value)
      return this
    },
    placeholder(text) {
      this.builder.setPlaceholder(text)
      return this
    },
    defaultUsers(...users) {
      this.builder.setDefaultUsers(users)
      return this
    },
    handler(handle) {
      return builder(this.builder, UserSelectMenuBuilder, handle)
    },
  }
}

function role(id: string): ReturnType<SelectMenuSelector["role"]> {
  return {
    type: ComponentType.RoleSelect,
    builder: new RoleSelectMenuBuilder().setCustomId(id),
    id(id) {
      this.builder.setId(id)
      return this
    },
    disabled() {
      this.builder.setDisabled(true)
      return this
    },

    maxValues(value) {
      this.builder.setMaxValues(value)
      return this
    },
    minValues(value) {
      this.builder.setMinValues(value)
      return this
    },
    placeholder(text) {
      this.builder.setPlaceholder(text)
      return this
    },
    defaultRoles(...roles) {
      this.builder.setDefaultRoles(roles)
      return this
    },
    handler(handle) {
      return builder(this.builder, RoleSelectMenuBuilder, handle)
    },
  }
}

function mentionable(
  id: string,
): ReturnType<SelectMenuSelector["mentionable"]> {
  return {
    type: ComponentType.MentionableSelect,
    builder: new MentionableSelectMenuBuilder().setCustomId(id),
    id(id) {
      this.builder.setId(id)
      return this
    },
    disabled() {
      this.builder.setDisabled(true)
      return this
    },

    maxValues(value) {
      this.builder.setMaxValues(value)
      return this
    },
    minValues(value) {
      this.builder.setMinValues(value)
      return this
    },
    placeholder(text) {
      this.builder.setPlaceholder(text)
      return this
    },
    defaultRoles(...roles) {
      this.builder.addDefaultRoles(roles)
      return this
    },
    defaultUsers(...users) {
      this.builder.addDefaultUsers(users)
      return this
    },
    handler(handle) {
      return builder(this.builder, MentionableSelectMenuBuilder, handle)
    },
  }
}

function channel(id: string): ReturnType<SelectMenuSelector["channel"]> {
  return {
    type: ComponentType.ChannelSelect,
    builder: new ChannelSelectMenuBuilder().setCustomId(id),
    id(id) {
      this.builder.setId(id)
      return this
    },
    disabled() {
      this.builder.setDisabled(true)
      return this
    },
    maxValues(value) {
      this.builder.setMaxValues(value)
      return this
    },
    minValues(value) {
      this.builder.setMinValues(value)
      return this
    },
    placeholder(text) {
      this.builder.setPlaceholder(text)
      return this
    },
    channelTypes(...types) {
      this.builder.setChannelTypes(...types)
      return {
        ...this,
        "~channelTypes": types,
        id(id) {
          this.builder.setId(id)
          return this
        },
        disabled() {
          this.builder.setDisabled(true)
          return this
        },
        maxValues(value) {
          this.builder.setMaxValues(value)
          return this
        },
        minValues(value) {
          this.builder.setMinValues(value)
          return this
        },
        placeholder(text) {
          this.builder.setPlaceholder(text)
          return this
        },
        defaultChannels(...channels) {
          this.builder.setDefaultChannels(channels)
          return this
        },
      }
    },
    defaultChannels(...channels) {
      this.builder.setDefaultChannels(channels)
      return this
    },
    handler(handle) {
      return builder(this.builder, ChannelSelectMenuBuilder, handle)
    },
  }
}
