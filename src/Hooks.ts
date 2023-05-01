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
   [K in keyof IEventMap]: (callback: IEventMap[K]) => Function;
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
   oldSource: string;
   newSource: string;
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
   private _listeners = new Map<
      keyof IEventMap,
      IEventMap[keyof IEventMap][]
   >();

   private _getListeners<K extends keyof IEventMap>(key: K): IEventMap[K][] {
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
    * @param callback - The function to emit.
    * @returns {Function} A dispose function.
    */
   onDidClickItem(callback: IEventMap["onDidClickItem"]): Function {
      const group = this._getListeners("onDidClickItem");
      group.push(callback);

      return () => {
         for (let i = 0; i < group.length; i++) {
            let cb = group[i];
            if (cb === callback) {
               group.splice(i, 1);
               break;
            }
         }
      };
   }

   /**
    * An event emitted when an item is right clicked.
    *
    * @param callback - The function to emit.
    * @returns {Function} A dispose function.
    */
   onDidRightClickItem(callback: IEventMap["onDidRightClickItem"]): Function {
      const group = this._getListeners("onDidRightClickItem");
      group.push(callback);

      return () => {
         for (let i = 0; i < group.length; i++) {
            let cb = group[i];
            if (cb === callback) {
               group.splice(i, 1);
               break;
            }
         }
      };
   }

   /**
    * An event emitted when an item name is changed.
    *
    * @param callback - The function to emit.
    * @returns {Function} A dispose function.
    */
   onDidRenameItem(callback: IEventMap["onDidRenameItem"]): Function {
      const group = this._getListeners("onDidRenameItem");
      group.push(callback);

      return () => {
         for (let i = 0; i < group.length; i++) {
            let cb = group[i];
            if (cb === callback) {
               group.splice(i, 1);
               break;
            }
         }
      };
   }

   /**
    * An event emitted when an item name is added.
    *
    * @param callback - The function to emit.
    * @returns {Function} A dispose function.
    */
   onDidAddItem(callback: IEventMap["onDidAddItem"]): Function {
      const group = this._getListeners("onDidAddItem");
      group.push(callback);

      return () => {
         for (let i = 0; i < group.length; i++) {
            let cb = group[i];
            if (cb === callback) {
               group.splice(i, 1);
               break;
            }
         }
      };
   }

   /**
    * An event emitted when an item name is deleted.
    *
    * @param callback - The function to emit.
    * @returns {Function} A dispose function.
    */
   onDidDeleteItem(callback: IEventMap["onDidDeleteItem"]): Function {
      const group = this._getListeners("onDidDeleteItem");
      group.push(callback);

      return () => {
         for (let i = 0; i < group.length; i++) {
            let cb = group[i];
            if (cb === callback) {
               group.splice(i, 1);
               break;
            }
         }
      };
   }

   /**
    * An event emitted when an item name is moved.
    *
    * @param callback - The function to emit.
    * @returns {Function} A dispose function.
    */
   onDidMoveItem(callback: IEventMap["onDidMoveItem"]): Function {
      const group = this._getListeners("onDidMoveItem");
      group.push(callback);

      return () => {
         for (let i = 0; i < group.length; i++) {
            let cb = group[i];
            if (cb === callback) {
               group.splice(i, 1);
               break;
            }
         }
      };
   }

   /**
    * An event emitted when an error occured.
    *
    * @param callback - The function to emit.
    * @returns {Function} A dispose function.
    */
   onError(callback: IEventMap["onError"]): Function {
      const group = this._getListeners("onError");
      group.push(callback);

      return () => {
         for (let i = 0; i < group.length; i++) {
            let cb = group[i];
            if (cb === callback) {
               group.splice(i, 1);
               break;
            }
         }
      };
   }
}
