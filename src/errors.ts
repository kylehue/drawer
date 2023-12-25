import path from "path-browserify";
import { IErrorEvent } from "./Hooks.js";

export function ERR_ADD_EMPTY(): IErrorEvent {
   return {
      code: 0,
      reason: "The provided path is empty and cannot be added.",
   };
}

export function ERR_ADD_CLONE(source: string): IErrorEvent {
   return {
      code: 1,
      reason: `An item with the path '${source}' already exists.`,
   };
}

export function ERR_MOVE_CLONE(source: string): IErrorEvent {
   return {
      code: 2,
      reason: `The item '${path.basename(
         source
      )}' already exists in destination path '${path.dirname(source)}'.`,
   };
}

export function ERR_MOVE_TO_CURRENT_DIR(itemType: string): IErrorEvent {
   return {
      code: 3,
      reason: `Cannot move a ${itemType} inside its current directory.`,
   };
}

export function ERR_MOVE_INSIDE_CURRENT_DIR(itemType: string): IErrorEvent {
   return {
      code: 4,
      reason: `Cannot move a ${itemType} inside itself or its children.`,
   };
}

export function ERR_INVALID_CHARS(source: string, isName = false): IErrorEvent {
   return {
      code: 5,
      reason: `The ${
         isName ? "name" : "path"
      } '${source}' is invalid because it contains characters that are not allowed.`,
   };
}

export function ERR_INVALID_TYPE(source: string): IErrorEvent {
   return {
      code: 6,
      reason: `Invalid item type at ${source}.`,
   };
}
