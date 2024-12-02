/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  ApplicationIntegrationType,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  InteractionContextType,
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

export type ContextMenuCommand<
  Type extends keyof InteractionMap | "undefined" = "undefined",
  Keys extends keyof ContextMenuCommand | "" = "",
> = Unwrap<
  Omit<
    {
      builder: ContextMenuCommandBuilder
      type: Type
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
