/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js"
import { OptionTypeMap } from "../types/internal.mjs"
import { OptionValue, PartialOption } from "../types/option.mjs"
import { InternalError } from "./error.mjs"

export function getOptionValue<
  Type extends keyof OptionTypeMap,
  O extends PartialOption<Type>,
>(interaction: ChatInputCommandInteraction, option: O): OptionValue<O> {
  let value

  switch (option.type) {
    case "attachment":
      value = interaction.options.getAttachment(
        option.builder.name,
        !option.required,
      )
      break
    case "boolean":
      value = interaction.options.getBoolean(
        option.builder.name,
        !option.required,
      )
      break
    case "channel":
      value = interaction.options.getChannel(
        option.builder.name,
        !option.required,
      )
      break
    case "integer":
      value = interaction.options.getInteger(
        option.builder.name,
        !option.required,
      )
      break
    case "mentionable":
      value = interaction.options.getMentionable(
        option.builder.name,
        !option.required,
      )
      break
    case "number":
      value = interaction.options.getNumber(
        option.builder.name,
        !option.required,
      )
      break
    case "role":
      value = interaction.options.getRole(option.builder.name, !option.required)
      break
    case "string":
      value = interaction.options.getString(
        option.builder.name,
        !option.required,
      )
      break
    case "user":
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

    // TODO this could be better
    switch (option.type) {
      case "string":
        builder.addStringOption((option as PartialOption<"string">).builder)
        break
      case "number":
        builder.addNumberOption((option as PartialOption<"number">).builder)
        break
      case "boolean":
        builder.addBooleanOption((option as PartialOption<"boolean">).builder)
        break
      case "integer":
        builder.addIntegerOption((option as PartialOption<"integer">).builder)
        break
      case "channel":
        builder.addChannelOption((option as PartialOption<"channel">).builder)
        break
      case "attachment":
        builder.addAttachmentOption(
          (option as PartialOption<"attachment">).builder,
        )
        break
      case "mentionable":
        builder.addMentionableOption(
          (option as PartialOption<"mentionable">).builder,
        )
        break
      case "role":
        builder.addRoleOption((option as PartialOption<"role">).builder)
        break
      case "user":
        builder.addUserOption((option as PartialOption<"user">).builder)
        break
      default:
        throw new InternalError("unsupported_option_type")
    }
  }
}
