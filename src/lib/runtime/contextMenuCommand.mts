/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js"
import type { ContextMenuCommand } from "../types/contextMenuCommand.mts"

export function contextMenuCommand(
  name: string,
): ContextMenuCommand<"undefined", "handle" | "handler" | "type"> {
  return {
    name,
    builder: new ContextMenuCommandBuilder().setName(name),
    nameLocalizations(localizations) {
      this.builder.setNameLocalizations(localizations)
      return this
    },
    user() {
      this.builder.setType(ApplicationCommandType.User)

      return {
        ...this,
        type: ApplicationCommandType.User,
        nameLocalizations(localizations) {
          this.builder.setNameLocalizations(localizations)
          return this
        },
        contexts(...contexts) {
          this.builder.setContexts(...contexts)
          return this
        },
        defaultMemberPermissions(permissions) {
          this.builder.setDefaultMemberPermissions(permissions)
          return this
        },
        integrationTypes(...types) {
          this.builder.setIntegrationTypes(...types)
          return this
        },
        handler(handler) {
          return {
            ...this,
            handle: handler,
            nameLocalizations(localizations) {
              this.builder.setNameLocalizations(localizations)
              return this
            },
            contexts(...contexts) {
              this.builder.setContexts(...contexts)
              return this
            },
            defaultMemberPermissions(permissions) {
              this.builder.setDefaultMemberPermissions(permissions)
              return this
            },
            integrationTypes(...types) {
              this.builder.setIntegrationTypes(...types)
              return this
            },
          }
        },
      }
    },
    message() {
      this.builder.setType(ApplicationCommandType.Message)

      return {
        ...this,
        type: ApplicationCommandType.Message,
        nameLocalizations(localizations) {
          this.builder.setNameLocalizations(localizations)
          return this
        },
        contexts(...contexts) {
          this.builder.setContexts(...contexts)
          return this
        },
        defaultMemberPermissions(permissions) {
          this.builder.setDefaultMemberPermissions(permissions)
          return this
        },
        integrationTypes(...types) {
          this.builder.setIntegrationTypes(...types)
          return this
        },
        handler(handler) {
          return {
            ...this,
            handle: handler,
            nameLocalizations(localizations) {
              this.builder.setNameLocalizations(localizations)
              return this
            },
            contexts(...contexts) {
              this.builder.setContexts(...contexts)
              return this
            },
            defaultMemberPermissions(permissions) {
              this.builder.setDefaultMemberPermissions(permissions)
              return this
            },
            integrationTypes(...types) {
              this.builder.setIntegrationTypes(...types)
              return this
            },
          }
        },
      }
    },
    contexts(...contexts) {
      this.builder.setContexts(...contexts)
      return this
    },
    defaultMemberPermissions(permissions) {
      this.builder.setDefaultMemberPermissions(permissions)
      return this
    },
    integrationTypes(...types) {
      this.builder.setIntegrationTypes(...types)
      return this
    },
  }
}
