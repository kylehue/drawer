import { basename } from "path-browserify";
import Folder from "./Folder.js";
import getClassNameTokens from "./utils/getClassNameTokens.js";
import ItemWidget from "./ItemWidget.js";

type FolderState = "close" | "open";

export default class FolderWidget extends ItemWidget {
   public declare domNodes: {
      container: HTMLDivElement;
      head: HTMLDivElement;
      body: HTMLDivElement;
      input: HTMLInputElement;
      icon: HTMLSpanElement;
      iconChevron: HTMLSpanElement;
   };

   private _icon: Node | null = null;
   private _iconOpen: Node | null = null;
   private _state: FolderState = "open";

   private set state(state: FolderState) {
      this._state = state;
      this._updateIcons();
   }

   private get state() {
      return this._state;
   }

   constructor(private folder: Folder) {
      super(folder);
      const nodes = this.domNodes;
      
      const options = folder.drawer.options;

      nodes.head = document.createElement("div");
      nodes.body = document.createElement("div");
      nodes.iconChevron = document.createElement("span");

      // Init class names
      nodes.container.classList.add(
         ...getClassNameTokens(options.folderClassName)
      );
      nodes.head.classList.add("drawer-folder-head");
      nodes.body.classList.add("drawer-folder-body");
      nodes.iconChevron.classList.add("drawer-icon", "drawer-folder-icon-chevron");
      if (typeof options.folderIcon == "string") {
         nodes.icon.classList.add(...getClassNameTokens(options.folderIcon));
      }

      if (typeof options.folderIconChevron == "string") {
         nodes.iconChevron.classList.add(
            ...getClassNameTokens(options.folderIconChevron)
         );
      }

      // Append all nodes
      if (options.folderIcon instanceof Node) {
         this._icon = options.folderIcon.cloneNode(true);
         this.domNodes.icon.appendChild(this._icon);
      }

      if (options.folderIconOpen instanceof Node) {
         this._iconOpen = options.folderIconOpen.cloneNode(true);
         this.domNodes.icon.appendChild(this._iconOpen);
      }

      if (options.folderIconChevron instanceof Node) {
         let iconChevron = options.folderIconChevron.cloneNode(true);
         this.domNodes.iconChevron.appendChild(iconChevron);
      }

      nodes.head.append(nodes.icon, nodes.input, nodes.iconChevron);

      // Only append head if not root
      let isRoot = !folder.parent;

      if (!isRoot) {
         nodes.container.append(nodes.head);
      }

      nodes.container.append(nodes.body);

      if (isRoot) {
         options.element.append(nodes.container);
      } else if (folder.parent) {
         folder.parent.widget.domNodes.body.append(nodes.container);
      } else {
         console.error(`Failed to append domNode of ${folder.source}`);
      }

      this._updateName();
      this._updateIcons();
      this._initEvents();
   }

   private _initEvents() {
      const options = this.folder.drawer.options;
      // Edit input on double click
      if (options.editFolderNameOnDoubleClick) {
         this._addEventListener(this.domNodes.head, "dblclick", (event) => {
            if (event.target == this.domNodes.head) {
               this.focusInput();
            }
         });
      }

      // Trigger folder click event
      this._addEventListener(this.domNodes.head, "click", (event) => {
         if (event.target == this.domNodes.head) {
            this.folder.drawer.trigger("onFolderClick", {
               event,
               folder: this.folder,
            });

            this.state = this.state == "open" ? "close" : "open";
         }
      });

      // Trigger folder right click event
      this._addEventListener(this.domNodes.head, "contextmenu", (event) => {
         if (event.target == this.domNodes.head) {
            this.folder.drawer.trigger("onFolderRightClick", {
               event,
               folder: this.folder,
            });
         }
      });
   }

   private _updateName() {
      let folderName = basename(this.folder.source);
      this.domNodes.input.value = folderName;
   }

   private _updateIcons() {
      const options = this.folder.drawer.options;
      const { icon } = this.domNodes;
      const isOpen = this._state === "open";

      // Update folder icon
      if (
         typeof options.folderIcon === "string" &&
         typeof options.folderIconOpen === "string"
      ) {
         const removeClasses = isOpen
            ? options.folderIcon
            : options.folderIconOpen;
         const addClasses = isOpen
            ? options.folderIconOpen
            : options.folderIcon;

         icon.classList.remove(...getClassNameTokens(removeClasses));
         icon.classList.add(...getClassNameTokens(addClasses));
      } else if (this._icon && this._iconOpen) {
         const removeIcon = isOpen ? this._icon : this._iconOpen;
         const addIcon = isOpen ? this._iconOpen : this._icon;

         if (icon.contains(removeIcon)) {
            icon.removeChild(removeIcon);
         }

         icon.appendChild(addIcon);
      }

      // Update chevron icon
      if (isOpen) {
         this.domNodes.container.classList.add("drawer-folder-open");
      } else {
         this.domNodes.container.classList.remove("drawer-folder-open");
      }
   }
}
