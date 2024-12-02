/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { CommandInteractionOptionResolver } from "discord.js"

export type OptionTypeMap = {
  attachment: ReturnType<CommandInteractionOptionResolver["getAttachment"]> & {}
  boolean: ReturnType<CommandInteractionOptionResolver["getBoolean"]> & {}
  channel: ReturnType<CommandInteractionOptionResolver["getChannel"]> & {}
  integer: ReturnType<CommandInteractionOptionResolver["getInteger"]> & {}
  mentionable: ReturnType<
    CommandInteractionOptionResolver["getMentionable"]
  > & {}
  number: ReturnType<CommandInteractionOptionResolver["getNumber"]> & {}
  role: ReturnType<CommandInteractionOptionResolver["getRole"]> & {}
  string: ReturnType<CommandInteractionOptionResolver["getString"]> & {}
  user: ReturnType<CommandInteractionOptionResolver["getUser"]> & {}
}
