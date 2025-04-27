/**
 * Copyright (C) 2024-2025  Jochem Waqué
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
  | "could_not_register"
  | "missing_custom_id"
  | "duplicate_custom_id"
