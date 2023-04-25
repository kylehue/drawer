import { Folder } from "../Folder.js";
import { File } from "../File.js";
import path from "path-browserify";

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
      ? ItemTypeMap[ItemTypeFromSource<S>]
      : ItemTypeMap[K]
   : ItemTypeMap[K];

export function getPossibleItemTypesOfSource<S extends string>(
   source: S
): ItemTypeFromSource<S>[] {
   // Get item type
   let itemType: (keyof ItemTypeMap)[] = [];

   // If slash is at the end, it's a folder
   if (/\/$/.test(source)) {
      itemType = ["folder"];
   } else {
      // Item will be considered as `file` if it has a file extension
      let extension = path.extname(source);
      let hasFileExtension = !!extension && extension != ".";
      if (hasFileExtension) {
         itemType = ["file"];
      } else {
         itemType = ["file", "folder"];
      }
   }

   return itemType as ItemTypeFromSource<S>[];
}
