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
