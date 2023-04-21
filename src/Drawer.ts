import Folder from "./Folder.js";
import FolderWidget from "./FolderWidget.js";

export interface IDrawerOptions {
   element: HTMLElement;
   folderClassName: string;
   folderIcon: string | Node;
   folderIconOpen: string | Node;
   folderIconChevron: string | Node;
   fileClassName: string;
   fileIcon:
      | string
      | Node
      | ((fileExtension: string) => string | Node);
}

export default class Drawer extends Folder {
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
         },
         options || {}
      );

      super(null, "/", _options);

      //this.options.element.append(this.);
   }

   appendTo(element: HTMLElement) {
      //element.append(this._domNode);
   }
}
