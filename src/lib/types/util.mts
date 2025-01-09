/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
export type LowercaseKeys<T> = {
  [K in keyof T]: K extends Lowercase<string> ? T[K] : never
}

export type NotEmpty<T> = T

export type RequiredKeysOf<Type> = {
  [Key in keyof Type]: Type[Key] extends Exclude<Type[Key], undefined>
    ? Key
    : never
}[keyof Type]

export type UndefinedToOptional<Type> = Partial<{
  [Key in keyof Type]: Exclude<Type[Key], undefined>
}> &
  Pick<Type, RequiredKeysOf<Type>>

export type Unwrap<T> = {
  [K in keyof T]: T[K]
} & {}
