/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  ApplicationCommandOptionType,
  SharedNameAndDescription,
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
import type { OptionSelector } from "../types/option.mts"

export function option(description: string): OptionSelector {
  const builder = new SharedNameAndDescription().setDescription(description)

  return {
    attachment() {
      return attachment(builder)
    },
    boolean() {
      return boolean(builder)
    },
    channel() {
      return channel(builder)
    },
    integer() {
      return integer(builder)
    },
    mentionable() {
      return mentionable(builder)
    },
    number() {
      return number(builder)
    },
    role() {
      return role(builder)
    },
    string() {
      return string(builder)
    },
    user() {
      return user(builder)
    },
  }
}

function extendBuilder<Builder extends SharedNameAndDescription>(
  ext: Builder,
  base: SharedNameAndDescription,
) {
  ext.setDescription(base.description)

  if (base.name_localizations) {
    ext.setNameLocalizations(base.name_localizations)
  }

  if (base.description_localizations) {
    ext.setDescriptionLocalizations(base.description_localizations)
  }

  return ext
}

function attachment(
  base: SharedNameAndDescription,
): ReturnType<OptionSelector["attachment"]> {
  return {
    type: ApplicationCommandOptionType.Attachment,
    builder: extendBuilder(new SlashCommandAttachmentOption(), base),
    nameLocalizations(localizations) {
      this.builder.setNameLocalizations(localizations)
      return this
    },
    descriptionLocalizations(localizations) {
      this.builder.setDescriptionLocalizations(localizations)
      return this
    },
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

function boolean(
  base: SharedNameAndDescription,
): ReturnType<OptionSelector["boolean"]> {
  return {
    type: ApplicationCommandOptionType.Boolean,
    builder: extendBuilder(new SlashCommandBooleanOption(), base),
    nameLocalizations(localizations) {
      this.builder.setNameLocalizations(localizations)
      return this
    },
    descriptionLocalizations(localizations) {
      this.builder.setDescriptionLocalizations(localizations)
      return this
    },
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

function channel(
  base: SharedNameAndDescription,
): ReturnType<OptionSelector["channel"]> {
  return {
    type: ApplicationCommandOptionType.Channel,
    builder: extendBuilder(new SlashCommandChannelOption(), base),
    nameLocalizations(localizations) {
      this.builder.setNameLocalizations(localizations)
      return this
    },
    descriptionLocalizations(localizations) {
      this.builder.setDescriptionLocalizations(localizations)
      return this
    },
    required() {
      this.builder.setRequired(true)
      return this
    },
    channelTypes(...channelTypes) {
      this.builder.addChannelTypes(...channelTypes)
      return {
        ...this,
        "~channelTypes": channelTypes,
        nameLocalizations(localizations) {
          this.builder.setNameLocalizations(localizations)
          return this
        },
        descriptionLocalizations(localizations) {
          this.builder.setDescriptionLocalizations(localizations)
          return this
        },
        required() {
          this.builder.setRequired(true)
          return this
        },
      }
    },
  }
}

function integer(
  base: SharedNameAndDescription,
): ReturnType<OptionSelector["integer"]> {
  return {
    type: ApplicationCommandOptionType.Integer,
    builder: extendBuilder(new SlashCommandIntegerOption(), base),
    nameLocalizations(localizations) {
      this.builder.setNameLocalizations(localizations)
      return this
    },
    descriptionLocalizations(localizations) {
      this.builder.setDescriptionLocalizations(localizations)
      return this
    },
    autocomplete(autocomplete) {
      this.builder.setAutocomplete(true)
      return {
        ...this,
        async handleAutocomplete(interaction) {
          const result = await autocomplete(
            interaction.options.getFocused(),
            interaction,
          )
          await interaction.respond(
            Object.entries(result).map(([name, value]) => ({ name, value })),
          )
        },
        nameLocalizations(localizations) {
          this.builder.setNameLocalizations(localizations)
          return this
        },
        descriptionLocalizations(localizations) {
          this.builder.setDescriptionLocalizations(localizations)
          return this
        },
        maxValue(value) {
          this.builder.setMaxValue(value)
          return this
        },
        minValue(value) {
          this.builder.setMinValue(value)
          return this
        },
        required() {
          this.builder.setRequired(true)
          return this
        },
      }
    },
    choices(choices) {
      this.builder.setChoices(
        Object.entries(choices).map(([name, value]) => ({ name, value })),
      )
      return {
        ...this,
        "~choices": choices,
        nameLocalizations(localizations) {
          this.builder.setNameLocalizations(localizations)
          return this
        },
        descriptionLocalizations(localizations) {
          this.builder.setDescriptionLocalizations(localizations)
          return this
        },
        maxValue(value) {
          this.builder.setMaxValue(value)
          return this
        },
        minValue(value) {
          this.builder.setMinValue(value)
          return this
        },
        required() {
          this.builder.setRequired(true)
          return this
        },
      }
    },
    maxValue(value) {
      this.builder.setMaxValue(value)
      return this
    },
    minValue(value) {
      this.builder.setMinValue(value)
      return this
    },
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

function mentionable(
  base: SharedNameAndDescription,
): ReturnType<OptionSelector["mentionable"]> {
  return {
    type: ApplicationCommandOptionType.Mentionable,
    builder: extendBuilder(new SlashCommandMentionableOption(), base),
    nameLocalizations(localizations) {
      this.builder.setNameLocalizations(localizations)
      return this
    },
    descriptionLocalizations(localizations) {
      this.builder.setDescriptionLocalizations(localizations)
      return this
    },
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

function number(
  base: SharedNameAndDescription,
): ReturnType<OptionSelector["number"]> {
  return {
    type: ApplicationCommandOptionType.Number,
    builder: extendBuilder(new SlashCommandNumberOption(), base),
    nameLocalizations(localizations) {
      this.builder.setNameLocalizations(localizations)
      return this
    },
    descriptionLocalizations(localizations) {
      this.builder.setDescriptionLocalizations(localizations)
      return this
    },
    autocomplete(autocomplete) {
      this.builder.setAutocomplete(true)
      return {
        ...this,
        async handleAutocomplete(interaction) {
          const result = await autocomplete(
            interaction.options.getFocused(),
            interaction,
          )
          await interaction.respond(
            Object.entries(result).map(([name, value]) => ({ name, value })),
          )
        },
        nameLocalizations(localizations) {
          this.builder.setNameLocalizations(localizations)
          return this
        },
        descriptionLocalizations(localizations) {
          this.builder.setDescriptionLocalizations(localizations)
          return this
        },
        maxValue(value) {
          this.builder.setMaxValue(value)
          return this
        },
        minValue(value) {
          this.builder.setMinValue(value)
          return this
        },
        required() {
          this.builder.setRequired(true)
          return this
        },
      }
    },
    choices(choices) {
      this.builder.setChoices(
        Object.entries(choices).map(([name, value]) => ({ name, value })),
      )
      return {
        ...this,
        "~choices": choices,
        nameLocalizations(localizations) {
          this.builder.setNameLocalizations(localizations)
          return this
        },
        descriptionLocalizations(localizations) {
          this.builder.setDescriptionLocalizations(localizations)
          return this
        },
        maxValue(value) {
          this.builder.setMaxValue(value)
          return this
        },
        minValue(value) {
          this.builder.setMinValue(value)
          return this
        },
        required() {
          this.builder.setRequired(true)
          return this
        },
      }
    },
    maxValue(value) {
      this.builder.setMaxValue(value)
      return this
    },
    minValue(value) {
      this.builder.setMinValue(value)
      return this
    },
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

function role(
  base: SharedNameAndDescription,
): ReturnType<OptionSelector["role"]> {
  return {
    type: ApplicationCommandOptionType.Role,
    builder: extendBuilder(new SlashCommandRoleOption(), base),
    nameLocalizations(localizations) {
      this.builder.setNameLocalizations(localizations)
      return this
    },
    descriptionLocalizations(localizations) {
      this.builder.setDescriptionLocalizations(localizations)
      return this
    },
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

function string(
  base: SharedNameAndDescription,
): ReturnType<OptionSelector["string"]> {
  return {
    type: ApplicationCommandOptionType.String,
    builder: extendBuilder(new SlashCommandStringOption(), base),
    nameLocalizations(localizations) {
      this.builder.setNameLocalizations(localizations)
      return this
    },
    descriptionLocalizations(localizations) {
      this.builder.setDescriptionLocalizations(localizations)
      return this
    },
    autocomplete(autocomplete) {
      this.builder.setAutocomplete(true)
      return {
        ...this,
        async handleAutocomplete(interaction) {
          const result = await autocomplete(
            interaction.options.getFocused(),
            interaction,
          )
          await interaction.respond(
            Object.entries(result).map(([name, value]) => ({ name, value })),
          )
        },
        nameLocalizations(localizations) {
          this.builder.setNameLocalizations(localizations)
          return this
        },
        descriptionLocalizations(localizations) {
          this.builder.setDescriptionLocalizations(localizations)
          return this
        },
        maxLength(length) {
          this.builder.setMaxLength(length)
          return this
        },
        minLength(length) {
          this.builder.setMinLength(length)
          return this
        },
        required() {
          this.builder.setRequired(true)
          return this
        },
      }
    },
    choices(choices) {
      this.builder.setChoices(
        Object.entries(choices).map(([name, value]) => ({ name, value })),
      )
      return {
        ...this,
        "~choices": choices,
        nameLocalizations(localizations) {
          this.builder.setNameLocalizations(localizations)
          return this
        },
        descriptionLocalizations(localizations) {
          this.builder.setDescriptionLocalizations(localizations)
          return this
        },
        maxLength(length) {
          this.builder.setMaxLength(length)
          return this
        },
        minLength(length) {
          this.builder.setMinLength(length)
          return this
        },
        required() {
          this.builder.setRequired(true)
          return this
        },
      }
    },
    maxLength(length) {
      this.builder.setMaxLength(length)
      return this
    },
    minLength(length) {
      this.builder.setMinLength(length)
      return this
    },
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

function user(
  base: SharedNameAndDescription,
): ReturnType<OptionSelector["user"]> {
  return {
    type: ApplicationCommandOptionType.User,
    builder: extendBuilder(new SlashCommandUserOption(), base),
    nameLocalizations(localizations) {
      this.builder.setNameLocalizations(localizations)
      return this
    },
    descriptionLocalizations(localizations) {
      this.builder.setDescriptionLocalizations(localizations)
      return this
    },
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}
