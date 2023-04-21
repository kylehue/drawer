import Drawer, { IDrawerOptions } from "./Drawer.js";
import File from "./File.js";
import { extname, join } from "path-browserify";
import FolderWidget from "./FolderWidget.js";

interface ItemTypeMap {
   folder: Folder;
   file: File;
}

export default class Folder {
   public items: Map<string, Folder | File>;
   public type: "folder" = "folder";
   public delegate: FolderWidget;
   constructor(
      public parent: Folder | null,
      public source: string,
      private _options: IDrawerOptions
   ) {
      this.items = new Map();
      this.source = source;
      this.parent = parent;

      this.delegate = new FolderWidget(this, _options);
   }

   add<K extends keyof ItemTypeMap>(source: string, type?: K): ItemTypeMap[K] {
      source = join("/", source);
      // Get proper item type if auto
      if (!type) {
         // Item will be considered as `file` if it has a file extension
         let extension = extname(source);
         if (extension && extension != ".") {
            type = "file" as K;
         } else {
            type = "folder" as K;
         }
      }

      // Create item
      let item;
      if (type == "file") {
         item = new File(this, source, this._options);
      } else {
         item = new Folder(this, source, this._options);
      }

      this.items.set(source, item);

      return item as ItemTypeMap[K];
   }
}
