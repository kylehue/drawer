import Folder from "./Folder.js";
import File from "./File.js";

export interface IItemClickEvent {
   item: Folder | File;
   event: MouseEvent;
}

export interface IItemRenameEvent {
   item: Folder | File;
   oldName: string;
   newName: string;
}

export const eventMap = {
   onDidClickItem: (payload: IItemClickEvent) => {},
   onDidRightClickItem: (payload: IItemClickEvent) => {},
   onDidChangeItemName: (payload: IItemRenameEvent) => {},
} as const;

export type IEventMap = typeof eventMap;

export type IDrawerHooks = {
   [K in keyof IEventMap]: (cb: IEventMap[K]) => void;
};

export type ListenerMap = Map<
   keyof IEventMap,
   Array<IEventMap[keyof IEventMap]>
>;

export default class DrawerHooks implements IDrawerHooks {
   private _listeners: ListenerMap = new Map();
   private _getListeners<K extends keyof IEventMap>(
      key: K
   ): Array<IEventMap[K]> {
      return this._listeners.get(key) as Array<IEventMap[K]>;
   }

   constructor() {
      // Instantiate listener arrays
      for (let key in eventMap) {
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
      let group = this._getListeners(eventName);
      for (let evt of group) {
         // @ts-ignore
         evt(...args);
      }
   }

   /**
    * An event emitted when an item is clicked.
    *
    * @param cb - The function to emit.
    */
   onDidClickItem(cb: IEventMap["onDidClickItem"]) {
      let group = this._getListeners("onDidClickItem");
      group.push(cb);
   }

   /**
    * An event emitted when an item is right clicked.
    *
    * @param cb - The function to emit.
    */
   onDidRightClickItem(cb: IEventMap["onDidRightClickItem"]) {
      let group = this._getListeners("onDidRightClickItem");
      group.push(cb);
   }

   /**
    * An event emitted when an item name is changed.
    *
    * @param cb - The function to emit.
    */
   onDidChangeItemName(cb: IEventMap["onDidChangeItemName"]) {
      let group = this._getListeners("onDidChangeItemName");
      group.push(cb);
   }
}
