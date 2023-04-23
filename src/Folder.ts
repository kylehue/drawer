import Drawer from "./Drawer.js";
import File from "./File.js";
import path from "path-browserify";
import FolderWidget from "./FolderWidget.js";
import { IDrawerOptions, ItemTypeMap } from "./types.js";
import DrawerHooks, { ListenerMap } from "./DrawerHooks.js";

export default class Folder {
   public type: "folder" = "folder";
   public widget: FolderWidget;
   constructor(
      public drawer: Drawer,
      public parent: Folder | null,
      public source: string
   ) {
      this.source = source;
      this.parent = parent;

      this.widget = new FolderWidget(this);
   }

   /**
    * Adds a new file or folder to this folder instance.
    * @param {string} source - The source of the new item.
    * @param {string} [type] - The type of the new item, either "file" or "folder". If not provided, the type will be determined automatically based on the file extension.
    * @returns {ItemTypeMap[K]} The new item instance.
    */
   add<K extends keyof ItemTypeMap>(source: string, type?: K): ItemTypeMap[K] {
      // Get proper item type if auto
      if (!type) {
         // Item will be considered as `file` if it has a file extension
         let extension = path.extname(source);
         if (extension && extension != ".") {
            type = "file" as K;
         } else {
            type = "folder" as K;
         }
      }

      let sourceWithoutTheLastSlash = source.replace(/\/$/, "");
      let resolved = path.join("/", this.source, sourceWithoutTheLastSlash);
      let dirname = path.dirname(resolved);

      // Make sure the item we're adding doesn't exist
      let clone = this.drawer.items.get(resolved);
      if (clone && clone.type == type) {
         console.warn(
            "You are trying to add a file/folder that already exists."
         );
         return clone as ItemTypeMap[K];
      }

      // Recursively create parent folders of the main item if they don't exist
      if (dirname != "/") {
         let dirnameWithoutTheFirstSlash = dirname.replace(/^\//, "");
         let directories = dirnameWithoutTheFirstSlash.split("/");

         for (let i = 0; i < directories.length; i++) {
            const directory = directories.slice(0, i + 1).join("/");
            // Check if directory exists or not
            if (!this.drawer.get(directory)) {
               // ...if it doesn't exist, then create a folder for it
               this.drawer.add(directory, "folder");
            }
         }
      }

      let parent = this.drawer.get(dirname, "folder")!;

      // Create main item
      let item;
      if (type == "file") {
         item = new File(this.drawer, parent, resolved);
      } else {
         item = new Folder(this.drawer, parent, resolved);
      }

      this.drawer.items.set(resolved, item);

      return item as ItemTypeMap[K];
   }

   /**
    * Get an item from the folder by its source and type (if specified)
    * @param {string} source - the source of the item to retrieve
    * @param {K} [type] - the type of the item to retrieve (if not specified, it is determined based on the file extension)
    * @returns {ItemTypeMap[K] | null} - the retrieved item or null if it does not exist
    */
   get<K extends keyof ItemTypeMap>(
      source: string,
      type?: K
   ): ItemTypeMap[K] | null {
      // Get proper item type if auto
      if (!type) {
         // Item will be considered as `file` if it has a file extension
         let extension = path.extname(source);
         if (extension && extension != ".") {
            type = "file" as K;
         } else {
            type = "folder" as K;
         }
      }

      // Scan items
      let sourceWithoutTheLastSlash = source.replace(/\/$/, "");
      let resolved = path.join("/", this.source, sourceWithoutTheLastSlash);

      let item =
         resolved == "/"
            ? this.drawer.root
            : this.drawer.items.get(resolved) || null;

      if (item?.type != type) {
         item = null;
      }

      return item as ItemTypeMap[K] | null;
   }

   /**
    * Delete an item and its children from the folder by its source
    * @param {string} [source="/"] - the source of the item to delete
    */
   delete(source: string = "/") {
      let sourceWithoutTheLastSlash = source.replace(/\/$/, "");
      let resolved = path.join("/", this.source, sourceWithoutTheLastSlash);

      for (let [source, item] of this.drawer.items) {
         if (source.startsWith(resolved)) {
            // Dispose widget
            item.widget.dispose();

            // Delete in map
            this.drawer.items.delete(source);
         }
      }
   }

   /**
    * Delete all children from this folder
    */
   clear() {
      for (let [source, item] of this.drawer.items) {
         if (source.startsWith(this.source) && this !== item) {
            // Remove
            item.delete();
         }
      }
   }

   rename(name: string) {
      let dirname = path.dirname(this.source);
      let newSource = path.join(dirname, name);
      let mapItem = this.drawer.items.get(this.source);

      if (mapItem) {
         this.drawer.items.set(newSource, mapItem);
         this.drawer.items.delete(this.source);
         this.source = newSource;
         this.widget.domNodes.input.value = name;
      } else {
         console.error(`Can't rename ${this.source}`);
      }
   }
}
