import { Folder } from "./Folder.js";
import getClassNameTokens from "./utils/getClassNameTokens.js";
import { ItemWidget } from "./ItemWidget.js";
import {
   DRAWER_FOLDER,
   DRAWER_FOLDER_BODY,
   DRAWER_FOLDER_CLOSED,
   DRAWER_FOLDER_EMPTY,
   DRAWER_FOLDER_HEAD,
   DRAWER_FOLDER_ICON,
   DRAWER_FOLDER_ICON_CHEVRON,
   DRAWER_FOLDER_INPUT,
   DRAWER_FOLDER_OPENED,
   DRAWER_INDENT_GUIDE,
   DRAWER_ITEM,
   DRAWER_ITEM_BLURRED,
   DRAWER_ITEM_FOCUSED,
   DRAWER_ITEM_ICON,
   DRAWER_ITEM_INPUT,
} from "./classNames.js";

type FolderState = "close" | "open";

export class FolderWidget extends ItemWidget {
   public declare domNodes: {
      container: HTMLDivElement;
      head: HTMLDivElement;
      body: HTMLDivElement;
      input: HTMLInputElement;
      icon: HTMLSpanElement;
      iconChevron: HTMLSpanElement;
      indentGuide: HTMLSpanElement;
   };

   private _iconClosed: Node | null = null;
   private _iconOpen: Node | null = null;

   constructor(private folder: Folder) {
      super(folder);
      const nodes = this.domNodes;

      const options = folder.drawer.options;

      nodes.head = document.createElement("div");
      nodes.body = document.createElement("div");
      nodes.iconChevron = document.createElement("span");
      nodes.indentGuide = document.createElement("span");

      // Init class names
      nodes.input.classList.add(DRAWER_ITEM_INPUT, DRAWER_FOLDER_INPUT);
      nodes.icon.classList.add(DRAWER_ITEM_ICON, DRAWER_FOLDER_ICON);
      nodes.container.classList.add(
         DRAWER_ITEM,
         DRAWER_FOLDER,
         DRAWER_ITEM_BLURRED,
         DRAWER_FOLDER_EMPTY,
         ...getClassNameTokens(options.folderClassName)
      );
      nodes.head.classList.add(DRAWER_FOLDER_HEAD);
      nodes.body.classList.add(DRAWER_FOLDER_BODY);
      nodes.iconChevron.classList.add(
         DRAWER_ITEM_ICON,
         DRAWER_FOLDER_ICON_CHEVRON
      );
      nodes.indentGuide.classList.add(DRAWER_INDENT_GUIDE);

      if (typeof options.folderIconClosed == "string") {
         nodes.icon.classList.add(
            ...getClassNameTokens(options.folderIconClosed)
         );
      }

      if (typeof options.folderIconChevron == "string") {
         nodes.iconChevron.classList.add(
            ...getClassNameTokens(options.folderIconChevron)
         );
      }

      // Append all nodes
      if (options.folderIconClosed instanceof Node) {
         this._iconClosed = options.folderIconClosed.cloneNode(true);
         this.domNodes.icon.appendChild(this._iconClosed);
      }

      if (options.folderIcon instanceof Node) {
         this._iconOpen = options.folderIcon.cloneNode(true);
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

      nodes.body.append(nodes.indentGuide);
      nodes.container.append(nodes.body);

      if (isRoot) {
         options.element.append(nodes.container);
      } else if (folder.parent) {
         folder.parent.widget.domNodes.body.prepend(nodes.container);
      } else {
         console.error(`Failed to append domNode of ${folder.source}`);
      }

      this._updateIcons();
      this._updateIndentation();
      this._initEvents();
      this.setState("open");
   }

   private _state: FolderState = "open";
   public setState(state: FolderState) {
      this._state = state;
      this._updateIcons();

      if (state == "open") {
         this.domNodes.container.classList.remove(DRAWER_FOLDER_CLOSED);
         this.domNodes.container.classList.add(DRAWER_FOLDER_OPENED);
      } else {
         this.domNodes.container.classList.remove(DRAWER_FOLDER_OPENED);
         this.domNodes.container.classList.add(DRAWER_FOLDER_CLOSED);
      }
   }

   public get state() {
      return this._state;
   }

   private _initEvents() {
      const options = this.folder.drawer.options;
      // Edit input on double click
      if (options.editFolderNameOnDoubleClick) {
         this.addEventListener(this.domNodes.head, "dblclick", (event) => {
            if (event.target == this.domNodes.head) {
               this.focusInput();
            }
         });
      }

      this.addEventListener(this.domNodes.head, "click", (event) => {
         // Things that should be done if and only if the head is clicked
         if (event.target === this.domNodes.head) {
            // Trigger folder click event
            this.folder.drawer.trigger("onDidClickItem", {
               event,
               item: this.folder,
            });

            // Handle open/close
            if (this.state == "open") {
               this.setState("close");
            } else {
               this.setState("open");
            }

            // Handle folder focus
            // First, remove all item focus
            let focusClass = DRAWER_ITEM_FOCUSED;
            let blurClass = DRAWER_ITEM_BLURRED;
            let items = document.querySelectorAll("." + DRAWER_ITEM);
            items.forEach((el) => {
               el.classList.remove(focusClass);
               el.classList.add(blurClass);
            });

            // Then, add focus class for this folder
            this.domNodes.container.classList.remove(blurClass);
            this.domNodes.container.classList.add(focusClass);

            // Set drawer focused item
            this.folder.drawer.focusedItem = this.folder;

            this.focusContainer();
         }
      });

      // Trigger folder right click event
      this.addEventListener(this.domNodes.head, "contextmenu", (event) => {
         if (event.target === this.domNodes.head) {
            this.folder.drawer.trigger("onDidRightClickItem", {
               event,
               item: this.folder,
            });
         }
      });
   }

   private _updateIcons() {
      const options = this.folder.drawer.options;
      const { icon } = this.domNodes;
      const isOpen = this.state === "open";

      let folderIconClosed = options.folderIconClosed;
      let folderIconOpen = options.folderIcon;

      if (!folderIconOpen && !folderIconClosed) {
         if (this.domNodes.head.contains(this.domNodes.icon)) {
            this.domNodes.icon.remove();
         }
         return;
      }

      // If the icon for the open or closed state of the folder is not specified, then use the icon specified for the other state as the default icon
      if (folderIconClosed && !folderIconOpen) {
         if (typeof folderIconClosed == "string") {
            folderIconOpen = folderIconClosed;
         } else if (this._iconClosed && !this._iconOpen) {
            this._iconOpen = this._iconClosed.cloneNode(true);
         }
      } else if (!folderIconClosed && folderIconOpen) {
         if (typeof folderIconOpen == "string") {
            folderIconClosed = folderIconOpen;
         } else if (this._iconOpen && !this._iconClosed) {
            this._iconClosed = this._iconOpen.cloneNode(true);
         }
      }

      // Update string icon
      if (
         typeof folderIconClosed === "string" &&
         typeof folderIconOpen === "string"
      ) {
         const iconClassToAdd = isOpen ? folderIconOpen : folderIconClosed;
         const iconClassToRemove = isOpen ? folderIconClosed : folderIconOpen;
         icon.classList.remove(...getClassNameTokens(iconClassToRemove));
         icon.classList.add(...getClassNameTokens(iconClassToAdd));
      } else if (typeof folderIconClosed === "string") {
         for (let token of getClassNameTokens(folderIconClosed)) {
            icon.classList.toggle(token, !isOpen);
         }
      } else if (typeof folderIconOpen === "string") {
         for (let token of getClassNameTokens(folderIconOpen)) {
            icon.classList.toggle(token, isOpen);
         }
      }

      // Update node icon
      if (this._iconClosed && icon.contains(this._iconClosed)) {
         icon.removeChild(this._iconClosed);
      }
      if (this._iconOpen && icon.contains(this._iconOpen)) {
         icon.removeChild(this._iconOpen);
      }
      if (isOpen && this._iconOpen) {
         icon.appendChild(this._iconOpen);
      } else if (!isOpen && this._iconClosed) {
         icon.appendChild(this._iconClosed);
      }
   }

   private _updateIndentation() {
      let isRoot = !this.folder.parent;
      if (isRoot) {
         this.domNodes.indentGuide.style.display = "none";
         return;
      }

      let indentSize = this._getCalculatedIndentSize();
      this.domNodes.head.style.paddingLeft = indentSize + "em";

      let indentGuideOffset = this.folder.drawer.options.indentGuideOffset;
      this.domNodes.indentGuide.style.left =
         indentSize + indentGuideOffset + "em";
   }

   /**
    * Sort child items.
    * @function
    * @returns {void}
    */
   sort(): void {
      let children = this.folder.getChildren();

      children.sort((a, b) => {
         if (a.type === "folder" && b.type !== "folder") {
            return -1;
         } else if (a.type !== "folder" && b.type === "folder") {
            return 1;
         } else {
            return a.name.localeCompare(b.name);
         }
      });

      children.forEach((child, i) => {
         child.widget.domNodes.container.style.order = i.toString();
      });
   }
}
