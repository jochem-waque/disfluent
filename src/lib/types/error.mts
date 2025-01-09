/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
export type ErrorCode =
  | "command_not_autocompletable"
  | "option_not_autocompletable"
  | "option_not_found"
  | "subcommand_group_not_found"
  | "subcommand_not_found"
  | "unsupported_option_type"
