/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  ApplicationCommandType,
  ApplicationIntegrationType,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  ContextMenuCommandType,
  InteractionContextType,
  Locale,
  MessageContextMenuCommandInteraction,
  Permissions,
  UserContextMenuCommandInteraction,
} from "discord.js"
import { Unwrap } from "./util.mjs"

type InteractionMap = {
  undefined: ContextMenuCommandInteraction
  user: UserContextMenuCommandInteraction
  message: MessageContextMenuCommandInteraction
}

type TypeMap = {
  undefined: ContextMenuCommandType
  user: ApplicationCommandType.User
  message: ApplicationCommandType.Message
}

export type ContextMenuCommand<
  Type extends keyof InteractionMap | "undefined" = "undefined",
  Keys extends keyof ContextMenuCommand | "" = "",
> = Unwrap<
  Omit<
    {
      name: string
      builder: ContextMenuCommandBuilder
      type: TypeMap[Type]
      nameLocalizations(
        localizations: Partial<Record<Locale, string>>,
      ): ContextMenuCommand<Type, Keys | "nameLocalizations">
      user(): ContextMenuCommand<
        "user",
        Exclude<Keys, "type" | "handler"> | "user" | "message"
      >
      message(): ContextMenuCommand<
        "message",
        Exclude<Keys, "type" | "handler"> | "user" | "message"
      >
      contexts(
        context: InteractionContextType,
        ...rest: InteractionContextType[]
      ): ContextMenuCommand<Type, Keys | "contexts">
      defaultMemberPermissions(
        permissions: Permissions | bigint,
      ): ContextMenuCommand<Type, Keys | "defaultMemberPermissions">
      integrationTypes(
        type: ApplicationIntegrationType,
        ...rest: ApplicationIntegrationType[]
      ): ContextMenuCommand<Type, Keys | "integrationTypes">
      handler(
        handler: (interaction: InteractionMap[Type]) => Promise<void>,
      ): ContextMenuCommand<Type, Exclude<Keys, "handle"> | "handler">
      handle(interaction: InteractionMap[Type]): Promise<void>
    },
    Keys
  >
>
