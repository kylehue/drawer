import path from "path-browserify";
import Drawer from "./Drawer.js";
import FileWidget from "./FileWidget.js";
import Folder from "./Folder.js";
import { IDrawerOptions } from "./types.js";

export default class File {
   public type: "file" = "file";
   public widget: FileWidget;
   constructor(
      public drawer: Drawer,
      public parent: Folder,
      public source: string
   ) {
      this.widget = new FileWidget(this);
   }

   delete() {
      this.drawer.items.delete(this.source);
      this.widget.dispose();
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
