/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js"
import type { OptionValue, PartialOption } from "../types/option.mts"
import { InternalError } from "./error.mts"

export function getOptionValue<
  Type extends ApplicationCommandOptionType,
  O extends PartialOption<Type>,
>(interaction: ChatInputCommandInteraction, option: O): OptionValue<O> {
  let value

  switch (option.type) {
    case ApplicationCommandOptionType.Attachment:
      value = interaction.options.getAttachment(
        option.builder.name,
        !option.required,
      )
      break
    case ApplicationCommandOptionType.Boolean:
      value = interaction.options.getBoolean(
        option.builder.name,
        !option.required,
      )
      break
    case ApplicationCommandOptionType.Channel:
      value = interaction.options.getChannel(
        option.builder.name,
        !option.required,
      )
      break
    case ApplicationCommandOptionType.Integer:
      value = interaction.options.getInteger(
        option.builder.name,
        !option.required,
      )
      break
    case ApplicationCommandOptionType.Mentionable:
      value = interaction.options.getMentionable(
        option.builder.name,
        !option.required,
      )
      break
    case ApplicationCommandOptionType.Number:
      value = interaction.options.getNumber(
        option.builder.name,
        !option.required,
      )
      break
    case ApplicationCommandOptionType.Role:
      value = interaction.options.getRole(option.builder.name, !option.required)
      break
    case ApplicationCommandOptionType.String:
      value = interaction.options.getString(
        option.builder.name,
        !option.required,
      )
      break
    case ApplicationCommandOptionType.User:
      value = interaction.options.getUser(option.builder.name, !option.required)
      break
    default:
      value = undefined
      break
  }

  return (value ?? undefined) as OptionValue<O>
}

export function applyOptions(
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  options: Record<string, PartialOption>,
) {
  for (const [name, option] of Object.entries(options)) {
    option.builder.setName(name)

    switch (option.type) {
      case ApplicationCommandOptionType.String:
        builder.addStringOption(
          (option as PartialOption<typeof option.type>).builder,
        )
        break
      case ApplicationCommandOptionType.Number:
        builder.addNumberOption(
          (option as PartialOption<typeof option.type>).builder,
        )
        break
      case ApplicationCommandOptionType.Boolean:
        builder.addBooleanOption(
          (option as PartialOption<typeof option.type>).builder,
        )
        break
      case ApplicationCommandOptionType.Integer:
        builder.addIntegerOption(
          (option as PartialOption<typeof option.type>).builder,
        )
        break
      case ApplicationCommandOptionType.Channel:
        builder.addChannelOption(
          (option as PartialOption<typeof option.type>).builder,
        )
        break
      case ApplicationCommandOptionType.Attachment:
        builder.addAttachmentOption(
          (option as PartialOption<typeof option.type>).builder,
        )
        break
      case ApplicationCommandOptionType.Mentionable:
        builder.addMentionableOption(
          (option as PartialOption<typeof option.type>).builder,
        )
        break
      case ApplicationCommandOptionType.Role:
        builder.addRoleOption(
          (option as PartialOption<typeof option.type>).builder,
        )
        break
      case ApplicationCommandOptionType.User:
        builder.addUserOption(
          (option as PartialOption<typeof option.type>).builder,
        )
        break
      default:
        throw new InternalError("unsupported_option_type")
    }
  }
}
