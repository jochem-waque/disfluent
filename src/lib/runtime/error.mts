/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { ErrorCode } from "../types/error.mjs"

export class InternalError extends Error {
  public code: ErrorCode

  public constructor(code: ErrorCode, message?: string) {
    super(message)
    this.name = "InternalError"
    this.code = code
  }
}
