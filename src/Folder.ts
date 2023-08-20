import path from "path-browserify";
import { DRAWER_FOLDER_EMPTY } from "./classNames.js";
import { Drawer } from "./Drawer.js";
import {
   ERR_ADD_CLONE,
   ERR_ADD_EMPTY,
   ERR_INVALID_CHARS,
   ERR_MOVE_CLONE,
   ERR_MOVE_INSIDE_CURRENT_DIR,
   ERR_MOVE_TO_CURRENT_DIR,
} from "./errors.js";
import { File } from "./File.js";
import { FolderWidget } from "./FolderWidget.js";
import {
   ItemResult,
   ItemTypeMap,
   getPossibleItemTypesOfSource,
   isChildOf,
   isValidItemName,
} from "./utils.js";

export class Folder {
   public readonly type = "folder" as const;
   public readonly widget: FolderWidget;
   public isDeleted = false;
   protected _disposeEvents: Function[] = [];

   /** The name of the folder. */
   public name: string;
   constructor(
      public drawer: Drawer,
      public parent: Folder | null,
      public source: string
   ) {
      this.source = source;
      this.parent = parent;
      this.name = path.basename(source);

      this.widget = new FolderWidget(this);
   }

   /**
    * Adds a new item to this folder instance.
    * @param {string} source The source of the new item.
    * @param {string} [type] The type of the new item, either "file" or "folder". If not provided, the type will be determined automatically based on the file extension.
    * @function
    * @returns {ItemTypeMap[K]} The new item instance.
    */
   add<S extends string, K extends keyof ItemTypeMap>(
      source: S,
      type?: K
   ): ItemResult<S, K> {
      if (!source.length) {
         this.drawer.trigger("onError", ERR_ADD_EMPTY());
         return null as ItemResult<S, K>;
      }

      if (!isValidItemName(source, true)) {
         this.drawer.trigger("onError", ERR_INVALID_CHARS(source));
         return null as ItemResult<S, K>;
      }

      // Get item type
      let possibleItemTypes: (keyof ItemTypeMap)[];
      if (!type) {
         possibleItemTypes = getPossibleItemTypesOfSource(source);
      } else {
         possibleItemTypes = [type];
      }

      const sourceWithoutTrailingSlash = source.replace(/\/$/, "");
      const relativePath = path.join(
         "/",
         this.source,
         sourceWithoutTrailingSlash
      );
      const dirname = path.dirname(relativePath);

      // Make sure the item we're adding doesn't exist
      const clone = this.drawer.items.get(relativePath);
      if (!!clone) {
         this.drawer.trigger("onError", ERR_ADD_CLONE(clone.source));
         return clone as ItemResult<S, K>;
      }

      // Recursively create parent folders of the main item if they don't exist
      if (dirname != "/") {
         const dirnameWithoutTheFirstSlash = dirname.replace(/^\//, "");
         const directories = dirnameWithoutTheFirstSlash.split("/");
         for (let i = 0; i < directories.length; i++) {
            const directory = directories.slice(0, i + 1).join("/");
            // Check if directory exists or not

            if (!this.drawer.root.get(directory, "folder")) {
               // ...if it doesn't exist, then create a folder for it
               this.drawer.root.add(directory, "folder");
            }
         }
      }

      const parent = this.drawer.root.get(dirname, "folder")!;

      // Create main item
      let item: Folder | File;
      if (possibleItemTypes.length == 1 && possibleItemTypes[0] == "file") {
         item = new File(this.drawer, parent, relativePath);
      } else {
         item = new Folder(this.drawer, parent, relativePath);
      }

      this.drawer.items.set(relativePath, item);
      parent.widget.sort();
      parent.widget.domNodes.container.classList.remove(DRAWER_FOLDER_EMPTY);

      this.drawer.trigger("onDidAddItem", {
         item,
      });

      return item as ItemResult<S, K>;
   }

   /**
    * Get an item from the folder by its source and type (if specified)
    * @param {string} source The source of the item to retrieve
    * @param {K} [type] The type of the item to retrieve (if not specified, it is determined based on the file extension)
    * @function
    * @returns {ItemTypeMap[K] | null} The retrieved item or null if it does not exist
    */
   get<S extends string, K extends keyof ItemTypeMap>(
      source: S,
      type?: K
   ): ItemResult<S, K> | null {
      const sourceWithoutTrailingSlash = source.replace(/\/$/, "");
      const relativePath = path.join(
         "/",
         this.source,
         sourceWithoutTrailingSlash
      );

      // Get item type
      let possibleItemTypes: (keyof ItemTypeMap)[];
      if (!type) {
         possibleItemTypes = getPossibleItemTypesOfSource(source);
      } else {
         possibleItemTypes = [type];
      }

      let item =
         relativePath == "/"
            ? this.drawer.root
            : this.drawer.items.get(relativePath) || null;

      if (item?.type && !possibleItemTypes.includes(item.type)) {
         item = null;
      }

      return item as ItemResult<S, K> | null;
   }

   /**
    * Moves a folder to the specified source.
    *
    * **Note: The specified source must be in absolute form.**
    * @param source The path where to move the item
    * @returns {void}
    */
   move(source: string): void {
      if (!source) return;
      if (this === this.drawer.root) return;

      const oldSource = this.source;
      const sourceWithoutTrailingSlash = source.replace(/\/$/, "");
      const targetSource = path.join("/", sourceWithoutTrailingSlash);

      // Make sure we're not moving it to its current directory
      if (targetSource == path.dirname(this.source)) {
         this.drawer.trigger("onError", ERR_MOVE_TO_CURRENT_DIR(this.type));
         return;
      }

      // Make sure we're not moving it inside itself or its children
      if (isChildOf(this.source, targetSource)) {
         this.drawer.trigger("onError", ERR_MOVE_INSIDE_CURRENT_DIR(this.type));
         return;
      }

      const newSource = path.join(targetSource, path.basename(this.source));

      // Make sure it doesn't have a duplicate
      if (this.drawer.root.get(newSource)) {
         this.drawer.trigger("onError", ERR_MOVE_CLONE(newSource));
         return;
      }

      // If the target source doesn't exist, create it
      if (!this.drawer.root.get(targetSource)) {
         this.drawer.root.add(targetSource, "folder");
      }

      // Move itself and its children
      for (const [_, item] of this.drawer.items) {
         if (isChildOf(oldSource, item.source)) {
            const oldItemSource = item.source;
            const newItemSource = path.join(
               "/",
               oldItemSource.replace(oldSource, newSource)
            );

            const parentSource = path.dirname(newItemSource);
            const parent = this.drawer.root.get(parentSource, "folder")!;
            item.parent = parent;
            item.source = newItemSource;
            this.drawer.items.delete(oldItemSource);
            this.drawer.items.set(newItemSource, item);
            item.widget.move(parentSource);

            item.drawer.trigger("onDidMoveItem", {
               item,
               newSource: newItemSource,
               oldSource: oldItemSource,
            });
         }
      }
   }

   /**
    * Bind a function that will be called when this folder gets disposed.
    * @param disposeEvent The function to be called.
    */
   bindDisposeEvent(disposeEvent: Function) {
      this._disposeEvents.push(disposeEvent);
   }

   /**
    * Deletes an item and its children from the folder.
    * @param {string} [source="/"] - the source of the item to delete
    * @function
    * @returns {void}
    */
   delete(source: string = "/"): void {
      const sourceWithoutTrailingSlash = source.replace(/\/$/, "");
      const relativePath = path.join(
         "/",
         this.source,
         sourceWithoutTrailingSlash
      );

      for (const [source, item] of this.drawer.items) {
         if (!isChildOf(relativePath, source)) continue;
         if (item.isDeleted) continue;
         if (item.type == "folder") {
            // Dispose widget
            item.widget.dispose();

            for (let evt of item._disposeEvents) {
               evt();
            }

            // Delete in map
            this.drawer.items.delete(source);

            // Empty class
            if (!this.getChildren().length) {
               this.widget.domNodes.container.classList.add(
                  DRAWER_FOLDER_EMPTY
               );
            }

            item.drawer.trigger("onDidDeleteItem", {
               item,
            });
            item.isDeleted = true;
         } else {
            item.delete();
         }
      }
   }

   /**
    * Deletes all children from this folder.
    * @function
    * @returns {void}
    */
   clear(): void {
      for (const [source, item] of this.drawer.items) {
         if (isChildOf(this.source, source) && this !== item) {
            // Remove
            item.delete();
         }
      }
   }

   /**
    * Renames the item with the given name and updates the corresponding DOM elements.
    * @param {string} name - The new name to give to the item.
    * @function
    * @returns {void}
    */
   rename(name: string): void {
      const dirname = path.dirname(this.source);
      const newSource = path.join(dirname, name);

      const oldName = this.name;
      if (!isValidItemName(name)) {
         this.drawer.trigger("onError", ERR_INVALID_CHARS(name, true));
         this.widget.rename(oldName);
         return;
      }

      // Make sure the new name doesn't exist
      const clone = this.drawer.items.get(newSource);
      if (!!clone) {
         this.drawer.trigger("onError", ERR_ADD_CLONE(clone.source));
         this.widget.rename(oldName);
         return;
      }

      const oldSource = this.source;

      this.drawer.items.set(newSource, this);
      this.drawer.items.delete(this.source);
      this.name = name;
      this.source = newSource;
      this.parent?.widget.sort();
      this.widget.updateIcon();
      this.widget.rename(name);

      // Rename hook should trigger first before move hooks
      // Trigger rename hook first...
      this.drawer.trigger("onDidRenameItem", {
         item: this,
         newName: name,
         oldName,
         oldSource,
         newSource,
      });

      // ...then move children
      for (const [source, item] of this.drawer.items) {
         if (
            source != oldSource &&
            source.startsWith(path.join(oldSource, "/")) &&
            !source.slice(oldSource.length + 1).includes("/")
         ) {
            item.move(newSource);
         }
      }
   }

   /**
    * Returns an array of folder items (folders or files) in this folder.
    * @function
    * @returns An array of folder items.
    */
   getChildren(): (Folder | File)[] {
      const children: (Folder | File)[] = [];

      for (const [source, item] of this.drawer.items) {
         if (
            source != this.source &&
            source.startsWith(path.join(this.source, "/")) &&
            !source.slice(this.source.length + 1).includes("/")
         ) {
            children.push(item);
         }
      }

      return children;
   }

   // /**
   //  * Sorts the current folder and its child items recursively.
   //  * @function
   //  * @returns {void}
   //  */
   // private _sort(): void {
   //    this.widget.sort();
   //    for (let [source, item] of this.drawer.items) {
   //       if (
   //          source != this.source &&
   //          source.startsWith(path.join(this.source, "/")) &&
   //          item.type == "folder"
   //       ) {
   //          item.widget.sort();
   //       }
   //    }
   // }
}
