import * as path from "path-browserify";
import { Drawer } from "./Drawer.js";
import { FileWidget } from "./FileWidget.js";
import { Folder } from "./Folder.js";
import { ERR_INVALID_CHARS, ERR_MOVE_INSIDE_CURRENT_DIR, ERR_MOVE_TO_CURRENT_DIR } from "./errors.js";
import { isValidItemName } from "./utils.js";

export class File {
   public type = "file" as const;
   public widget: FileWidget;

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
    * Deletes the file from the drawer.
    * @function
    * @returns {void}
    */
   delete(): void {
      this.drawer.items.delete(this.source);
      this.widget.dispose();
   }

   /**
    * Renames the file with the given name and updates the corresponding DOM elements.
    * @param {string} name - The new name to give to the file.
    * @function
    * @returns {void}
    */
   rename(name: string): void {
      let dirname = path.dirname(this.source);
      let newSource = path.join(dirname, name);

      if (!isValidItemName(name)) {
         this.drawer.trigger("onError", ERR_INVALID_CHARS(name, true));
         return;
      }

      this.drawer.items.set(newSource, this);
      this.drawer.items.delete(this.source);
      this.name = name;
      this.source = newSource;
      this.parent.widget.sort();
      this.widget.updateIcon();
      this.widget.rename(name);
   }

   /**
    * Moves a file to the specified source.
    *
    * **Note: The specified source must be in absolute form.**
    * @param source The path where to move the item
    * @returns {void}
    */
   move(source: string): void {
      let oldSource = this.source;
      let sourceWithoutTrailingSlash = source.replace(/\/$/, "");
      let targetSource = path.join("/", sourceWithoutTrailingSlash);

      // Make sure we're not moving it to its current directory
      if (targetSource == path.dirname(this.source)) {
         this.drawer.trigger("onError", ERR_MOVE_TO_CURRENT_DIR(this.type))
         return;
      }

      // Make sure we're not moving it inside itself
      if (targetSource.startsWith(this.source)) {
         this.drawer.trigger("onError", ERR_MOVE_INSIDE_CURRENT_DIR(this.type));
         return;
      }

      let newSource = path.join(targetSource, path.basename(this.source));

      // If the target source doesn't exist, create it
      if (!this.drawer.root.get(targetSource)) {
         this.drawer.root.add(targetSource, "folder");
      }

      let parent = this.drawer.root.get(targetSource, "folder")!;
      this.source = newSource;
      this.parent = parent;
      this.drawer.items.delete(oldSource);
      this.drawer.items.set(newSource, this);
      this.widget.move(targetSource);
   }
}
