/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  codeBlock,
  Colors,
  CommandInteraction,
  heading,
  HeadingLevel,
  InteractionType,
  orderedList,
  subtext,
  unorderedList,
  type CommandInteractionOption,
} from "discord.js"
import d from "../../index.mts"
import type { ErrorContext } from "../external.mts"

export function errorMessageComponents(context: ErrorContext) {
  return [
    d
      .container(
        ...errorInformation(context.error),
        ...commandInformation(context),
        ...componentInformation(context),
        ...handlerInformation(context),
      )
      .accent(Colors.Red)
      .build(),
  ]
}

function errorInformation(error: unknown) {
  if (!(error instanceof Error)) {
    return [d.text(heading("Error")), d.text(String(error))]
  }

  const components: d.ContainerComponent[] = [
    d.text(heading(error.name)),
    d.text(subtext(error.message)),
  ]

  if (error.stack) {
    components.push(d.text(codeBlock(error.stack.slice(0, 1000))))
  }

  return components
}

function commandInformation(context: ErrorContext) {
  if (!("command" in context)) {
    return []
  }

  const { command } = context

  return [
    d.text(heading("Command", HeadingLevel.Two)),
    d.text(`/${command.name}`),
    ...interactionInformation(context),
  ]
}

function componentInformation(context: ErrorContext) {
  if (!("component" in context)) {
    return []
  }

  const { component } = context

  return [
    d.text(heading("Component", HeadingLevel.Two)),
    d.text(component.id),
    ...interactionInformation(context),
  ]
}

function interactionInformation(context: ErrorContext) {
  if (!("interaction" in context)) {
    return []
  }

  const { interaction } = context

  const components = [d.text(heading("Interaction", HeadingLevel.Three))]

  switch (interaction.type) {
    case InteractionType.ApplicationCommand:
      components.push(
        d.text(
          unorderedList([
            ...recordToList({
              "User ID": interaction.user.id,
              "Channel ID": interaction.channelId,
              "Guild ID": interaction.guildId ?? "None",
            }),
            "Options:",
            formatOptions(interaction.options),
          ]),
        ),
      )
      break
    case InteractionType.MessageComponent:
      components.push(
        d.text(
          unorderedList([
            ...recordToList({
              "Custom ID": interaction.customId,
              "User ID": interaction.user.id,
              "Channel ID": interaction.channelId,
              "Guild ID": interaction.guildId ?? "None",
            }),
          ]),
        ),
      )
      break
    case InteractionType.ApplicationCommandAutocomplete:
      components.push(
        d.text(
          unorderedList([
            ...recordToList({
              "User ID": interaction.user.id,
              "Channel ID": interaction.channelId,
              "Guild ID": interaction.guildId ?? "None",
              ...formatAutocompleteOption(
                interaction.options.data.find((option) => option.focused),
              ),
            }),
          ]),
        ),
      )
      break
    default:
      break
  }

  return components
}

function handlerInformation(context: ErrorContext) {
  if (!("handler" in context)) {
    return []
  }

  const { handler } = context

  return [
    d.text(heading("Handler", HeadingLevel.Two)),
    d.text(handler.event),
    ...handlerParamsInformation(context),
  ]
}

function handlerParamsInformation(context: ErrorContext) {
  if (!("handlerParameters" in context)) {
    return []
  }

  const { handlerParameters } = context

  return [
    d.text(heading("Parameters", HeadingLevel.Three)),
    d.text(
      orderedList(handlerParameters.map((parameter) => String(parameter))),
    ),
  ]
}

function recordToList(record: Record<string, string>) {
  return Object.entries(record).map(([key, value]) => `${key}: ${value}`)
}

function formatAutocompleteOption(option?: CommandInteractionOption) {
  if (!option) {
    return {}
  }

  return {
    "Option name": option.name,
    "Option value": option.value?.toString() ?? "",
  }
}

function formatOptions(options: CommandInteraction["options"]) {
  return options.data.map(
    (option) => `${option.name}: ${option.value?.toString() ?? ""}`,
  )
}
