import { basename } from "path-browserify";
import Drawer, { IDrawerOptions } from "./Drawer.js";
import Folder from "./Folder.js";

function getClassNameTokens(className: string) {
   let classNameTokens: string[] = [];

   className.split(" ").forEach((token) => {
      if (token) {
         classNameTokens.push(token);
      }
   });

   return classNameTokens;
}

function setupIcon() {}

type FolderState = "closed" | "open";

export default class FolderWidget {
   public domNodes = {
      container: document.createElement("div"),
      head: document.createElement("div"),
      body: document.createElement("div"),
      name: document.createElement("span"),
      icon: document.createElement("span") as HTMLSpanElement | Node,
      iconChevron: document.createElement("span") as HTMLSpanElement | Node,
   };

   private _state: FolderState = "closed";

   public set state(state: FolderState) {
      this.updateIcons();
      this._state = state;
   }

   public get state() {
      return this._state;
   }

   constructor(public folder: Folder, private options: IDrawerOptions) {
      console.log(options);

      // Init class names
      this.domNodes.container.classList.add(
         "drawer-folder",
         ...getClassNameTokens(options.folderClassName)
      );
      this.domNodes.head.className = "drawer-folder-head";
      this.domNodes.body.className = "drawer-folder-body";
      this.domNodes.name.className = "drawer-folder-name";
      if (
         typeof options.folderIcon == "string" &&
         this.domNodes.icon instanceof HTMLSpanElement
      ) {
         this.domNodes.icon.classList.add(
            "drawer-folder-icon",
            ...getClassNameTokens(options.folderIcon)
         );
      } else if (options.folderIcon instanceof Node) {
         this.domNodes.icon = options.folderIcon.cloneNode(
            true
         ) as typeof options.folderIcon;
      }

      if (
         typeof options.folderIconChevron == "string" &&
         this.domNodes.iconChevron instanceof HTMLSpanElement
      ) {
         this.domNodes.iconChevron.classList.add(
            "drawer-folder-icon-chevron",
            ...getClassNameTokens(options.folderIconChevron)
         );
      } else if (options.folderIconChevron instanceof Node) {
         this.domNodes.iconChevron = options.folderIconChevron.cloneNode(
            true
         ) as typeof options.folderIconChevron;
      }

      // Append
      this.domNodes.head.append(
         this.domNodes.icon,
         this.domNodes.name,
         this.domNodes.iconChevron
      );

      // Only append head if not root
      let isRoot = folder instanceof Drawer;
      if (!isRoot) {
         this.domNodes.container.append(this.domNodes.head);
      }

      this.domNodes.container.append(this.domNodes.body);

      if (isRoot) {
         options.element.append(this.domNodes.container);
      } else if (folder.parent) {
         folder.parent.delegate.domNodes.body.append(this.domNodes.container);
      } else {
         console.error(`Failed to append domNode of ${folder.source}`);
      }

      this.updateName();
   }

   updateName() {
      let folderName = basename(this.folder.source);
      this.domNodes.name.textContent = folderName;
   }

   updateIcons() {
      /* if (this._state == "open") {
         if (
            typeof this.options.folderIconChevron == "string" &&
            this.domNodes.iconChevron instanceof HTMLSpanElement
         ) {
            this.domNodes.iconChevron.classList.add(
               "drawer-folder-icon-chevron",
               ...getClassNameTokens(this.options.folderIconChevron)
            );
         } else if (this.options.folderIconChevron instanceof Node) {
            this.domNodes.iconChevron = this.options.folderIconChevron.cloneNode(
               true
            ) as typeof this.options.folderIconChevron;
         }
      } else {

      } */
   }
}
