/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export type Equal<X, Y> =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  (<T>() => T extends X ? 1 : 0) extends <T>() => T extends Y ? 1 : 0
    ? true
    : false

export function arrayEqual<T>(actual: T[], expected: T[]) {
  if (actual.length !== expected.length) {
    return false
  }

  const first = new Map<T, number>()
  for (const element of actual) {
    const oldCount = first.get(element)
    first.set(element, oldCount ? oldCount + 1 : 1)
  }

  for (const element of expected) {
    let count = first.get(element)
    if (!count) {
      return false
    }

    count--
    if (count === 0) {
      first.delete(element)
      continue
    }

    first.set(element, count)
  }

  return first.size === 0
}
