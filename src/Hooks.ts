import { File } from "./File.js";
import { Folder } from "./Folder.js";

const eventMap = {
   onDidClickItem: (payload: IClickItemEvent) => {},
   onDidRightClickItem: (payload: IClickItemEvent) => {},
   onDidRenameItem: (payload: IRenameItemEvent) => {},
   onDidMoveItem: (payload: IMoveItemEvent) => {},
   onDidAddItem: (payload: IItemEvent) => {},
   onDidDeleteItem: (payload: IItemEvent) => {},
   onError: (payload: IErrorEvent) => {},
} as const;

export type IEventMap = typeof eventMap;

export type IHooks = {
   [K in keyof IEventMap]: (cb: IEventMap[K]) => void;
};

export interface IItemEvent {
   item: Folder | File;
}

export interface IClickItemEvent extends IItemEvent {
   event: MouseEvent;
}

export interface IRenameItemEvent extends IItemEvent {
   oldName: string;
   newName: string;
}

export interface IMoveItemEvent extends IItemEvent {
   oldSource: string;
   newSource: string;
}

export interface IErrorEvent {
   code: number;
   reason: string;
}

export class Hooks implements IHooks {
   private _listeners =
      new Map<keyof IEventMap, IEventMap[keyof IEventMap][]>();

   private _getListeners<K extends keyof IEventMap>(
      key: K
   ): IEventMap[K][] {
      return this._listeners.get(key) as IEventMap[K][];
   }

   constructor() {
      // Instantiate listener arrays
      for (const key in eventMap) {
         this._listeners.set(key as keyof IEventMap, []);
      }
   }

   /**
    * Triggers the listeners for the specified event with the provided arguments.
    *
    * @param eventName - The name of the event to trigger.
    * @param args - The arguments to pass to the event listeners.
    */
   trigger<K extends keyof IEventMap>(
      eventName: K,
      ...args: Parameters<IEventMap[K]>
   ) {
      const group = this._getListeners(eventName);
      for (const evt of group) {
         (evt as any)(...args);
      }
   }

   /**
    * An event emitted when an item is clicked.
    *
    * @param cb - The function to emit.
    */
   onDidClickItem(cb: IEventMap["onDidClickItem"]) {
      const group = this._getListeners("onDidClickItem");
      group.push(cb);
   }

   /**
    * An event emitted when an item is right clicked.
    *
    * @param cb - The function to emit.
    */
   onDidRightClickItem(cb: IEventMap["onDidRightClickItem"]) {
      const group = this._getListeners("onDidRightClickItem");
      group.push(cb);
   }

   /**
    * An event emitted when an item name is changed.
    *
    * @param cb - The function to emit.
    */
   onDidRenameItem(cb: IEventMap["onDidRenameItem"]) {
      const group = this._getListeners("onDidRenameItem");
      group.push(cb);
   }

   /**
    * An event emitted when an item name is added.
    *
    * @param cb - The function to emit.
    */
   onDidAddItem(cb: IEventMap["onDidAddItem"]) {
      const group = this._getListeners("onDidAddItem");
      group.push(cb);
   }

   /**
    * An event emitted when an item name is deleted.
    *
    * @param cb - The function to emit.
    */
   onDidDeleteItem(cb: IEventMap["onDidDeleteItem"]) {
      const group = this._getListeners("onDidDeleteItem");
      group.push(cb);
   }

   /**
    * An event emitted when an item name is moved.
    *
    * @param cb - The function to emit.
    */
   onDidMoveItem(cb: IEventMap["onDidMoveItem"]) {
      const group = this._getListeners("onDidMoveItem");
      group.push(cb);
   }

   /**
    * An event emitted when an error occured.
    *
    * @param cb - The function to emit.
    */
   onError(cb: IEventMap["onError"]) {
      const group = this._getListeners("onError");
      group.push(cb);
   }
}
