/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  BaseSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ComponentType,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
  type APISelectMenuComponent,
  type SelectMenuType,
} from "discord.js"
import type {
  Button,
  ComponentSelector,
  SelectMenuSelector,
} from "../types/component.mts"
import { InternalError } from "./error.mts"

export function component(): ComponentSelector {
  return {
    row(component, ...rest) {
      return {
        type: ComponentType.ActionRow,
        components: [component, ...rest],
      }
    },
    button,
    select,
  }
}

function button(style: ButtonStyle): Button<"handler"> {
  return {
    builder: new ButtonBuilder().setStyle(style),
    id(id) {
      this.builder.setCustomId(id)
      return {
        ...this,
        disabled() {
          this.builder.setDisabled(true)
          return this
        },
        emoji(emoji) {
          this.builder.setEmoji(emoji)
          return this
        },
        label(label) {
          this.builder.setLabel(label)
          return this
        },
        handler(handle) {
          const base = this.builder.toJSON()
          if (!("custom_id" in base) || !base.custom_id) {
            throw new InternalError(
              "missing_custom_id",
              "Can't set handler for button component without a custom ID",
            )
          }

          return {
            id: base.custom_id,
            type: base.type,
            build(...args: readonly string[]) {
              return new ButtonBuilder(base)
                .setCustomId(base.custom_id + ":" + args.join(":"))
                .toJSON()
            },
            handle,
          }
        },
      }
    },
    disabled() {
      this.builder.setDisabled(true)
      return this
    },
    emoji(emoji) {
      this.builder.setEmoji(emoji)
      return this
    },
    label(label) {
      this.builder.setLabel(label)
      return this
    },
    url(url) {
      return this.builder.setURL(url.toString()).toJSON()
    },
  }
}

function select(): SelectMenuSelector {
  return {
    string,
    user,
    role,
    mentionable,
    channel,
  }
}

function sharedHandler<
  Type extends SelectMenuType,
  Builder extends BaseSelectMenuBuilder<
    APISelectMenuComponent & { type: Type }
  >,
  Handler,
>(
  base: Builder,
  constructor: new (data: ReturnType<Builder["toJSON"]>) => Builder,
  handle: Handler,
) {
  const data = base.toJSON() as ReturnType<Builder["toJSON"]>
  if (!("custom_id" in data) || !data.custom_id) {
    throw new InternalError(
      "missing_custom_id",
      "Can't set handler for button component without a custom ID",
    )
  }

  return {
    id: data.custom_id,
    type: data.type,
    build(...args: readonly string[]) {
      return new constructor(data)
        .setCustomId(data.custom_id + ":" + args.join(":"))
        .toJSON()
    },
    handle,
  }
}

function string(id: string): ReturnType<SelectMenuSelector["string"]> {
  return {
    type: ComponentType.StringSelect,
    builder: new StringSelectMenuBuilder().setCustomId(id),
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
      return sharedHandler(this.builder, StringSelectMenuBuilder, handle)
    },
    options(options) {
      return {
        ...this,
        "~options": options,
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
      }
    },
  }
}

function user(id: string): ReturnType<SelectMenuSelector["user"]> {
  return {
    type: ComponentType.UserSelect,
    builder: new UserSelectMenuBuilder().setCustomId(id),
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
      return sharedHandler(this.builder, UserSelectMenuBuilder, handle)
    },
  }
}

function role(id: string): ReturnType<SelectMenuSelector["role"]> {
  return {
    type: ComponentType.RoleSelect,
    builder: new RoleSelectMenuBuilder().setCustomId(id),
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
      return sharedHandler(this.builder, RoleSelectMenuBuilder, handle)
    },
  }
}

function mentionable(
  id: string,
): ReturnType<SelectMenuSelector["mentionable"]> {
  return {
    type: ComponentType.MentionableSelect,
    builder: new MentionableSelectMenuBuilder().setCustomId(id),
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
      return sharedHandler(this.builder, MentionableSelectMenuBuilder, handle)
    },
  }
}

function channel(id: string): ReturnType<SelectMenuSelector["channel"]> {
  return {
    type: ComponentType.ChannelSelect,
    builder: new ChannelSelectMenuBuilder().setCustomId(id),
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
      return sharedHandler(this.builder, ChannelSelectMenuBuilder, handle)
    },
  }
}

// function input() {}
