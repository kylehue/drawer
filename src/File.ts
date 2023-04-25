import * as path from "path-browserify";
import { Drawer } from "./Drawer.js";
import { FileWidget } from "./FileWidget.js";
import { Folder } from "./Folder.js";

export class File {
   public type = "file" as const;
   public widget: FileWidget;
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
    * Renames the item with the given name and updates the corresponding DOM elements.
    * @param {string} name - The new name to give to the item.
    * @function
    * @returns {void}
    */
   rename(name: string): void {
      let dirname = path.dirname(this.source);
      let newSource = path.join(dirname, name);
      let mapItem = this.drawer.items.get(this.source);

      if (mapItem) {
         this.drawer.items.set(newSource, mapItem);
         this.drawer.items.delete(this.source);
         this.widget.rename(name);
         this.name = name;
         this.source = newSource;
         this.widget.updateIcon();
         this.parent.widget.sort();
      } else {
         console.error(`Can't rename ${this.source}`);
      }
   }
}
