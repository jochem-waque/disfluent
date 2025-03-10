/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js"
import { ContextMenuCommand } from "../types/contextMenuCommand.mjs"

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
        contexts(context, ...rest) {
          this.builder.setContexts(context, ...rest)
          return this
        },
        defaultMemberPermissions(permissions) {
          this.builder.setDefaultMemberPermissions(permissions)
          return this
        },
        integrationTypes(type, ...rest) {
          this.builder.setIntegrationTypes(type, ...rest)
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
            contexts(context, ...rest) {
              this.builder.setContexts(context, ...rest)
              return this
            },
            defaultMemberPermissions(permissions) {
              this.builder.setDefaultMemberPermissions(permissions)
              return this
            },
            integrationTypes(type, ...rest) {
              this.builder.setIntegrationTypes(type, ...rest)
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
        contexts(context, ...rest) {
          this.builder.setContexts(context, ...rest)
          return this
        },
        defaultMemberPermissions(permissions) {
          this.builder.setDefaultMemberPermissions(permissions)
          return this
        },
        integrationTypes(type, ...rest) {
          this.builder.setIntegrationTypes(type, ...rest)
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
            contexts(context, ...rest) {
              this.builder.setContexts(context, ...rest)
              return this
            },
            defaultMemberPermissions(permissions) {
              this.builder.setDefaultMemberPermissions(permissions)
              return this
            },
            integrationTypes(type, ...rest) {
              this.builder.setIntegrationTypes(type, ...rest)
              return this
            },
          }
        },
      }
    },
    contexts(context, ...rest) {
      this.builder.setContexts(context, ...rest)
      return this
    },
    defaultMemberPermissions(permissions) {
      this.builder.setDefaultMemberPermissions(permissions)
      return this
    },
    integrationTypes(type, ...rest) {
      this.builder.setIntegrationTypes(type, ...rest)
      return this
    },
  }
}
