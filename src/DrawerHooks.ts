import Folder from "./Folder.js";
import File from "./File.js";

export interface IFolderClickEvent {
   folder: Folder;
   event: MouseEvent;
}

export interface IFileClickEvent {
   file: File;
   event: MouseEvent;
}

export interface IItemRenameEvent {
   oldName: string;
   newName: string;
}

export interface IFolderRenameEvent extends IItemRenameEvent {
   folder: Folder;
}

export interface IFileRenameEvent extends IItemRenameEvent {
   file: File;
}

export const eventMap = {
   onFolderClick: (payload: IFolderClickEvent) => {},
   onFolderRightClick: (payload: IFolderClickEvent) => {},
   onDidChangeFolderName: (payload: IFolderRenameEvent) => {},
   onFileClick: (payload: IFileClickEvent) => {},
   onFileRightClick: (payload: IFileClickEvent) => {},
   onDidChangeFileName: (payload: IFileRenameEvent) => {},
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
    * An event emitted when a folder item is clicked.
    *
    * @param cb - The function to emit.
    */
   onFolderClick(cb: IEventMap["onFolderClick"]) {
      let group = this._getListeners("onFolderClick");
      group.push(cb);
   }

   /**
    * An event emitted when a folder item is right clicked.
    *
    * @param cb - The function to emit.
    */
   onFolderRightClick(cb: IEventMap["onFolderRightClick"]) {
      let group = this._getListeners("onFolderRightClick");
      group.push(cb);
   }

   /**
    * An event emitted when a file item is clicked.
    *
    * @param cb - The function to emit.
    */
   onFileClick(cb: IEventMap["onFileClick"]) {
      let group = this._getListeners("onFileClick");
      group.push(cb);
   }

   /**
    * An event emitted when a file item is right clicked.
    *
    * @param cb - The function to emit.
    */
   onFileRightClick(cb: IEventMap["onFileRightClick"]) {
      let group = this._getListeners("onFileRightClick");
      group.push(cb);
   }

   /**
    * An event emitted when a file name is changed.
    *
    * @param cb - The function to emit.
    */
   onDidChangeFileName(cb: IEventMap["onDidChangeFileName"]) {
      let group = this._getListeners("onDidChangeFileName");
      group.push(cb);
   }

   /**
    * An event emitted when a folder name is changed.
    *
    * @param cb - The function to emit.
    */
   onDidChangeFolderName(cb: IEventMap["onDidChangeFolderName"]) {
      let group = this._getListeners("onDidChangeFolderName");
      group.push(cb);
   }
}
