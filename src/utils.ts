import path from "path-browserify";
import { File } from "./File.js";
import { Folder } from "./Folder.js";

/**
 * Get the tokens of a class name string.
 * @param className The class name string.
 * @returns {string[]} An array of string
 */
export function getClassNameTokens(className: string): string[] {
   const classNameTokens: string[] = [];

   className.split(" ").forEach((token) => {
      if (token) {
         classNameTokens.push(token);
      }
   });

   return classNameTokens;
}

export interface ItemTypeMap {
   folder: Folder;
   file: File;
}

type NonEmptyString<T extends string> = "" extends T ? never : T;

export type ItemTypeFromSource<T extends string> = T extends `${string}/`
   ? "folder"
   : T extends `${string}.${infer ext}` // if it has a dot
   ? NonEmptyString<ext> extends never // if it doesn't have an extension
      ? "folder" | "file"
      : "file"
   : "folder" | "file";

export type ItemResult<
   S extends string,
   K extends keyof ItemTypeMap
> = keyof ItemTypeMap extends K
   ? S extends string
      ? NonEmptyString<S> extends never
         ? null
         : ItemTypeMap[ItemTypeFromSource<S>]
      : ItemTypeMap[K]
   : ItemTypeMap[K];

/**
 * Get the possible types of a drawer item by evaluating its source.
 * @param source - The source to evaluate.
 * @returns {Array} An array containing the possible types.
 */
export function getPossibleItemTypesOfSource<S extends string>(
   source: S
): ItemTypeFromSource<S>[] {
   // Get item type
   let itemType: (keyof ItemTypeMap)[] = [];

   // If slash is at the end, it's a folder
   if (source.endsWith("/")) {
      itemType = ["folder"];
   } else {
      // Item will be considered as `file` if it has a file extension
      const extension = path.extname(source);
      const hasFileExtension = !!extension && extension != ".";
      if (hasFileExtension) {
         itemType = ["file"];
      } else {
         itemType = ["file", "folder"];
      }
   }

   return itemType as ItemTypeFromSource<S>[];
}

/**
 * Checks if the name only contains valid characters.
 * @param name The name to check.
 * @param allowSeperator Set to true to allow the path seperator (`/`) character.
 * @returns {boolean}
 */
export function isValidItemName(name: string, allowSeperator = false): boolean {
   return allowSeperator ? !/[\\:*?"<>]/.test(name) : !/[/\\:*?"<>]/.test(name);
}

/**
 * Returns true if the testSource is a child of parentSource.
 * @param parentSource The parent source.
 * @param testSource The source to test.
 * @returns {boolean}
 */
export function isChildOf(parentSource: string, testSource: string): boolean {
   parentSource = path.join("/", parentSource);
   testSource = path.join("/", testSource);
   return parentSource == "/" ? true : (
      testSource.startsWith(parentSource) &&
         testSource.split("/").slice(parentSource.split("/").length - 1)[0] ==
            path.basename(parentSource)
   );
}
