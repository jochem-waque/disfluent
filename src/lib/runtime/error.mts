/**
 * Copyright (C) 2024  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { ErrorCode } from "../types/error.mts"

export class InternalError extends Error {
  public code: ErrorCode

  public constructor(code: ErrorCode, message?: string) {
    super(message)
    this.name = "InternalError"
    this.code = code
  }
}
