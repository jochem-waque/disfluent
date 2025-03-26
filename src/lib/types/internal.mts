/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { CommandInteractionOptionResolver } from "discord.js"

export type OptionTypeMap = {
  readonly attachment: ReturnType<
    CommandInteractionOptionResolver<"cached">["getAttachment"]
  > & {}
  readonly boolean: ReturnType<
    CommandInteractionOptionResolver<"cached">["getBoolean"]
  > & {}
  readonly channel: ReturnType<
    CommandInteractionOptionResolver<"cached">["getChannel"]
  > & {}
  readonly integer: ReturnType<
    CommandInteractionOptionResolver<"cached">["getInteger"]
  > & {}
  readonly mentionable: ReturnType<
    CommandInteractionOptionResolver<"cached">["getMentionable"]
  > & {}
  readonly number: ReturnType<
    CommandInteractionOptionResolver<"cached">["getNumber"]
  > & {}
  readonly role: ReturnType<
    CommandInteractionOptionResolver<"cached">["getRole"]
  > & {}
  readonly string: ReturnType<
    CommandInteractionOptionResolver<"cached">["getString"]
  > & {}
  readonly user: ReturnType<
    CommandInteractionOptionResolver<"cached">["getUser"]
  > & {}
}
