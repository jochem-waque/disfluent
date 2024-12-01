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
import { Option } from "./shared.mjs"

export function attachment(description: string): Option<"attachment"> {
  return {
    type: "attachment",
    builder: new SlashCommandAttachmentOption().setDescription(description),
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

export function boolean(description: string): Option<"boolean"> {
  return {
    type: "boolean",
    builder: new SlashCommandBooleanOption().setDescription(description),
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

export function channel(description: string): Option<"channel"> {
  return {
    type: "channel",
    builder: new SlashCommandChannelOption().setDescription(description),
    required() {
      this.builder.setRequired(true)
      return this
    },
    channelTypes(...channelTypes) {
      this.builder.addChannelTypes(...channelTypes)
      return {
        ...this,
        required() {
          this.builder.setRequired(true)
          return this
        },
        channelTypes,
      }
    },
  }
}

export function integer(description: string): Option<"integer"> {
  return {
    type: "integer",
    builder: new SlashCommandIntegerOption().setDescription(description),
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

export function mentionable(description: string): Option<"mentionable"> {
  return {
    type: "mentionable",
    builder: new SlashCommandMentionableOption().setDescription(description),
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

export function number(description: string): Option<"number"> {
  return {
    type: "number",
    builder: new SlashCommandNumberOption().setDescription(description),
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

export function role(description: string): Option<"role"> {
  return {
    type: "role",
    builder: new SlashCommandRoleOption().setDescription(description),
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}

export function string(description: string): Option<"string"> {
  return {
    type: "string",
    builder: new SlashCommandStringOption().setDescription(description),
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

export function user(description: string): Option<"user"> {
  return {
    type: "user",
    builder: new SlashCommandUserOption().setDescription(description),
    required() {
      this.builder.setRequired(true)
      return this
    },
  }
}
