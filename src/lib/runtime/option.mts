/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
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
import { DefaultKeys, Option } from "../types/option.mjs"

export function attachment(
  description: string,
): Option<"attachment", DefaultKeys["standard"]> {
  return {
    type: "attachment",
    builder: new SlashCommandAttachmentOption().setDescription(description),
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

export function boolean(
  description: string,
): Option<"boolean", DefaultKeys["standard"]> {
  return {
    type: "boolean",
    builder: new SlashCommandBooleanOption().setDescription(description),
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

export function channel(
  description: string,
): Option<"channel", DefaultKeys["channel"]> {
  return {
    type: "channel",
    builder: new SlashCommandChannelOption().setDescription(description),
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
        channelTypes,
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

export function integer(
  description: string,
): Option<"integer", DefaultKeys["numeric"]> {
  return {
    type: "integer",
    builder: new SlashCommandIntegerOption().setDescription(description),
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
        choices,
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

export function mentionable(
  description: string,
): Option<"mentionable", DefaultKeys["standard"]> {
  return {
    type: "mentionable",
    builder: new SlashCommandMentionableOption().setDescription(description),
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

export function number(
  description: string,
): Option<"number", DefaultKeys["numeric"]> {
  return {
    type: "number",
    builder: new SlashCommandNumberOption().setDescription(description),
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
        choices,
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

export function role(
  description: string,
): Option<"role", DefaultKeys["standard"]> {
  return {
    type: "role",
    builder: new SlashCommandRoleOption().setDescription(description),
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

export function string(
  description: string,
): Option<"string", DefaultKeys["text"]> {
  return {
    type: "string",
    builder: new SlashCommandStringOption().setDescription(description),
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
        choices,
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

export function user(
  description: string,
): Option<"user", DefaultKeys["standard"]> {
  return {
    type: "user",
    builder: new SlashCommandUserOption().setDescription(description),
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
