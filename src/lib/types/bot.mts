/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Client } from "discord.js"
import { Module } from "./module.mjs"

export type Bot = {
  readonly client: Client
  addModule(module: Module): Bot
  register(): Bot
}
