/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { ContextMenuCommandBuilder } from "discord.js"
import { ContextMenuCommand } from "../types/contextMenuCommand.mjs"

export function contextMenuCommand(
  name: string,
): ContextMenuCommand<"undefined", "handle" | "handler" | "type"> {
  return {
    builder: new ContextMenuCommandBuilder().setName(name),
    user() {
      return {
        ...this,
        type: "user",
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
            handle: handler,
          }
        },
      }
    },
    message() {
      return {
        ...this,
        type: "message",
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
            handle: handler,
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
