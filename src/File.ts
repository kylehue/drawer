import * as path from "path-browserify";
import { Drawer } from "./Drawer.js";
import {
   ERR_INVALID_CHARS,
   ERR_MOVE_INSIDE_CURRENT_DIR,
   ERR_MOVE_TO_CURRENT_DIR,
} from "./errors.js";
import { FileWidget } from "./FileWidget.js";
import { Folder } from "./Folder.js";
import { isValidItemName } from "./utils.js";

export class File {
   public type = "file" as const;
   public widget: FileWidget;
   protected _disposeEvents: Function[] = [];

   /** The name of the file. */
   public name: string;
   constructor(
      public drawer: Drawer,
      public parent: Folder,
      public source: string
   ) {
      this.name = path.basename(source);
      this.widget = new FileWidget(this);
   }

   /**
    * Bind a function that will be called when this file gets disposed.
    * @param disposeEvent The function to be called.
    */
   bindDisposeEvent(disposeEvent: Function) {
      this._disposeEvents.push(disposeEvent);
   }

   /**
    * Deletes the file from the drawer.
    * @function
    * @returns {void}
    */
   delete(): void {
      this.drawer.items.delete(this.source);
      this.widget.dispose();

      this.drawer.trigger("onDidDeleteItem", {
         item: this,
      });

      for (let evt of this._disposeEvents) {
         evt();
      }
   }

   /**
    * Renames the file with the given name and updates the corresponding DOM elements.
    * @param {string} name - The new name to give to the file.
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

      const oldSource = this.source;

      this.drawer.items.set(newSource, this);
      this.drawer.items.delete(this.source);
      this.name = name;
      this.source = newSource;
      this.parent.widget.sort();
      this.widget.updateIcon();
      this.widget.rename(name);

      this.drawer.trigger("onDidRenameItem", {
         item: this,
         newName: name,
         oldName,
         oldSource,
         newSource
      });
   }

   /**
    * Moves a file to the specified source.
    *
    * **Note: The specified source must be in absolute form.**
    * @param source The path where to move the item
    * @returns {void}
    */
   move(source: string): void {
      if (!source) return;
      
      const oldSource = this.source;
      const sourceWithoutTrailingSlash = source.replace(/\/$/, "");
      const targetSource = path.join("/", sourceWithoutTrailingSlash);

      // Make sure we're not moving it to its current directory
      if (targetSource == path.dirname(this.source)) {
         this.drawer.trigger("onError", ERR_MOVE_TO_CURRENT_DIR(this.type));
         return;
      }

      // Make sure we're not moving it inside itself
      if (targetSource.startsWith(this.source)) {
         this.drawer.trigger("onError", ERR_MOVE_INSIDE_CURRENT_DIR(this.type));
         return;
      }

      const newSource = path.join(targetSource, path.basename(this.source));

      // If the target source doesn't exist, create it
      if (!this.drawer.root.get(targetSource)) {
         this.drawer.root.add(targetSource, "folder");
      }

      const parent = this.drawer.root.get(targetSource, "folder")!;
      this.source = newSource;
      this.parent = parent;
      this.drawer.items.delete(oldSource);
      this.drawer.items.set(newSource, this);
      this.widget.move(targetSource);

      this.drawer.trigger("onDidMoveItem", {
         item: this,
         newSource,
         oldSource,
      });
   }
}
