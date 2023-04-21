import Drawer, { IDrawerOptions } from "./Drawer.js";
import Folder from "./Folder.js";

export default class File {
   public type: "file" = "file";
   protected _domNode: HTMLDivElement = document.createElement("div");
   constructor(
      public parent: Folder,
      public source: string,
      private _options: IDrawerOptions
   ) {
      
   }

   test() {}
}
