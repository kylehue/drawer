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

export function ERR_MOVE_TO_CURRENT_DIR(itemType: string): IErrorEvent {
   return {
      code: 2,
      reason: `Cannot move a ${itemType} inside its current directory.`,
   };
}

export function ERR_MOVE_INSIDE_CURRENT_DIR(itemType: string): IErrorEvent {
   return {
      code: 3,
      reason: `Cannot move a ${itemType} inside itself or its children.`,
   };
}