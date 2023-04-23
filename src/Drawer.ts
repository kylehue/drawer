import Folder from "./Folder.js";
import File from "./File.js";
import DrawerHooks from "./DrawerHooks.js";
import FolderWidget from "./FolderWidget.js";
import { IDrawerOptions, ItemTypeMap } from "./types.js";

export default class Drawer
   extends DrawerHooks
   implements Pick<Folder, "add" | "delete" | "clear" | "get">
{
   public options: IDrawerOptions;
   public root: Folder;
   public items: Map<string, Folder | File> = new Map();

   /**
    *
    * @param options Options for configuring the behavior and appearance of a drawer.
    */
   constructor(options?: Partial<IDrawerOptions>) {
      // Options defaults
      let _options = Object.assign<IDrawerOptions, Partial<IDrawerOptions>>(
         {
            element: document.createElement("div"),
            folderClassName: "",
            folderIcon: "",
            folderIconOpen: "",
            folderIconChevron: "",
            fileClassName: "",
            fileIcon: "",
            editFolderNameOnDoubleClick: false,
            editFileNameOnDoubleClick: true,
         },
         options || {}
      );

      super();

      this.options = _options;
      this.root = new Folder(this, null, "/");

      //this.options.element.append(this.);
   }

   add<K extends keyof ItemTypeMap>(source: string, type?: K | undefined) {
      return this.root.add(source, type);
   }

   delete(source?: string) {
      this.root.delete(source);
   }

   clear() {
      this.root.clear();
   }
   
   get<K extends keyof ItemTypeMap>(source: string, type?: K | undefined) {
      return this.root.get(source, type);
   }

   /**
    * Appends the root widget container to the specified HTML element.
    *
    * @param element The HTML element to which the root widget container will be appended.
    */
   appendTo(element: HTMLElement) {
      element.append(this.root.widget.domNodes.container);
   }
}
