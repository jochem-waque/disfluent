/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { CommandInteractionOptionResolver } from "discord.js"

export type OptionTypeMap = {
  attachment: ReturnType<
    CommandInteractionOptionResolver<"cached">["getAttachment"]
  > & {}
  boolean: ReturnType<
    CommandInteractionOptionResolver<"cached">["getBoolean"]
  > & {}
  channel: ReturnType<
    CommandInteractionOptionResolver<"cached">["getChannel"]
  > & {}
  integer: ReturnType<
    CommandInteractionOptionResolver<"cached">["getInteger"]
  > & {}
  mentionable: ReturnType<
    CommandInteractionOptionResolver<"cached">["getMentionable"]
  > & {}
  number: ReturnType<
    CommandInteractionOptionResolver<"cached">["getNumber"]
  > & {}
  role: ReturnType<CommandInteractionOptionResolver<"cached">["getRole"]> & {}
  string: ReturnType<
    CommandInteractionOptionResolver<"cached">["getString"]
  > & {}
  user: ReturnType<CommandInteractionOptionResolver<"cached">["getUser"]> & {}
}
