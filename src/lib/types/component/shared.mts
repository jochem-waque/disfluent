/**
 * Copyright (C) 2024-2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type {
  ActionRowBuilder,
  AnySelectMenuInteraction,
  APIMessageComponent,
  ButtonBuilder,
  ButtonInteraction,
  ChannelSelectMenuBuilder,
  ComponentType,
  ContainerBuilder,
  FileBuilder,
  MediaGalleryBuilder,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  SectionBuilder,
  SeparatorBuilder,
  StringSelectMenuBuilder,
  TextDisplayBuilder,
  TextInputBuilder,
  ThumbnailBuilder,
  UserSelectMenuBuilder,
} from "discord.js"
import type {
  PartialStringSelectOption,
  StringSelectBuilder,
} from "./select.mts"

export type BuilderMap<Type extends ComponentType> = {
  [ComponentType.ActionRow]: ActionRowBuilder
  [ComponentType.Button]: ButtonBuilder
  [ComponentType.StringSelect]: StringSelectMenuBuilder
  [ComponentType.TextInput]: TextInputBuilder
  [ComponentType.UserSelect]: UserSelectMenuBuilder
  [ComponentType.RoleSelect]: RoleSelectMenuBuilder
  [ComponentType.MentionableSelect]: MentionableSelectMenuBuilder
  [ComponentType.ChannelSelect]: ChannelSelectMenuBuilder
  [ComponentType.Section]: SectionBuilder
  [ComponentType.TextDisplay]: TextDisplayBuilder
  [ComponentType.Thumbnail]: ThumbnailBuilder
  [ComponentType.MediaGallery]: MediaGalleryBuilder
  [ComponentType.File]: FileBuilder
  [ComponentType.Separator]: SeparatorBuilder
  [ComponentType.ContentInventoryEntry]: never
  [ComponentType.Container]: ContainerBuilder
  [ComponentType.Label]: never
  [ComponentType.FileUpload]: never
}[Type]

export type APIComponent<Type extends ComponentType> = APIMessageComponent & {
  type: Type
}

export type ComponentInteraction<Type extends ComponentType> = (
  | AnySelectMenuInteraction
  | ButtonInteraction
) & {
  componentType: Type
}

export type ComponentBuilder<
  Type extends ComponentType = ComponentType,
  Options extends
    | Record<string, PartialStringSelectOption>
    | undefined = undefined,
  Arguments extends readonly string[] = readonly string[],
> = Type extends ComponentType.StringSelect
  ? StringSelectBuilder<StringValues<Options>, Arguments>
  : {
      readonly id: string
      readonly type: Type
      with(...args: Arguments): BuilderMap<Type>
      handle(
        interaction: ComponentInteraction<Type>,
        ...args: Arguments
      ): Promise<void>
    }

export type ComponentHandler<
  Type extends ComponentType,
  Options extends Record<string, PartialStringSelectOption> | undefined,
  Arguments extends readonly string[],
> = (
  interaction: Options extends Record<string, PartialStringSelectOption>
    ? Omit<ComponentInteraction<Type>, "values"> & {
        values: StringValues<Options>[]
      }
    : ComponentInteraction<Type>,
  ...args: Arguments
) => Promise<void>

type StringValues<Data> =
  Data extends Record<string, infer Values extends PartialStringSelectOption>
    ? Values["~value"]
    : never
