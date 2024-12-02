/**
 * Copyright (C) 2024  Jochem-W
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js"
import { OptionValues, PartialOption } from "./option.mjs"
import { InvertedPartialize, LowercaseKeys, NotEmpty, Unwrap } from "./util.mjs"

export type Subcommand<
  Keys extends keyof Subcommand | "" = "",
  Handler extends boolean = false,
> = Unwrap<
  Omit<
    {
      builder: SlashCommandSubcommandBuilder
      options<T extends Record<string, PartialOption>>(
        options: NotEmpty<LowercaseKeys<T>>,
      ): SubcommandWithOptions<
        NotEmpty<LowercaseKeys<T>>,
        Keys | "options",
        Handler
      >
      handler: (
        handler: (interaction: ChatInputCommandInteraction) => Promise<void>,
      ) => Subcommand<Keys | "options" | "handler", true>
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
    },
    Handler extends true ? Exclude<Keys, "handle"> : Keys | "handle"
  >
>

export type PartialSubcommand = InvertedPartialize<
  Subcommand<"", true>,
  "builder" | "handle"
>

export type SubcommandWithOptions<
  Options extends Record<Lowercase<string>, PartialOption>,
  Keys extends keyof Subcommand | "" = "",
  Handler extends boolean = false,
> = Unwrap<
  Omit<
    {
      builder: SlashCommandSubcommandBuilder
      options: Options
      handler: (
        handler: (
          interaction: ChatInputCommandInteraction,
          values: OptionValues<Options>,
        ) => Promise<void>,
      ) => SubcommandWithOptions<Options, Keys | "handler", true>
      handle: (interaction: ChatInputCommandInteraction) => Promise<void>
    },
    Handler extends true ? Exclude<Keys, "handle"> : Keys | "handle"
  >
>

export type SubcommandGroup<
  Keys extends keyof SubcommandGroup | "" = "",
  Subcommands extends boolean = false,
> = Unwrap<
  Omit<
    {
      builder: SlashCommandSubcommandGroupBuilder
    } & (Subcommands extends true
      ? {
          subcommands: Record<Lowercase<string>, PartialSubcommand>
        }
      : {
          subcommands<T extends Record<string, PartialSubcommand>>(
            subcommands: NotEmpty<LowercaseKeys<T>>,
          ): SubcommandGroup<Keys, true>
        }),
    Keys
  >
>

export type PartialSubcommandGroup = InvertedPartialize<
  SubcommandGroup<"", true>,
  "builder" | "subcommands"
>
