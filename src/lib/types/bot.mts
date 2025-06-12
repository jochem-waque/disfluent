/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Client, Webhook, WebhookType } from "discord.js"
import type { ErrorContext } from "./error.mts"
import type { Module } from "./module.mts"
import type { Unwrap } from "./util.mts"

export type ErrorHandler = (context: ErrorContext) => void

export type Bot<Keys extends keyof Bot | "" = ""> = Unwrap<
  Omit<
    {
      readonly "~client": Client
      addModule(module: Module): Bot<Keys>
      addErrorWebhook(webhook: Webhook<WebhookType.Incoming>): Bot<Keys>
      addErrorWebhookFromURL(url: URL): Promise<Bot<Keys>>
      errorHandler(handler: ErrorHandler): Bot<Keys | "errorHandler">
      register(): Bot<Keys | "register">
      login(
        token: string,
      ): Promise<Bot<Keys | "addModule" | "register" | "login">>
    },
    Keys
  >
>
