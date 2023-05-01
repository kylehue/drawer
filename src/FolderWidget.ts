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
import { makeDrawerItemDraggable } from "./drag.js";
import { Folder } from "./Folder.js";
import { ItemWidget } from "./ItemWidget.js";
import { getClassNameTokens, isChildOf } from "./utils.js";

export type FolderState = "close" | "open";

export class FolderWidget extends ItemWidget {
   public declare domNodes: {
      container: HTMLDivElement;
      head: HTMLDivElement;
      body: HTMLDivElement;
      input: HTMLInputElement;
      iconContainer: HTMLSpanElement;
      icon: HTMLSpanElement;
      iconChevron: HTMLSpanElement;
      indentGuide: HTMLSpanElement;
   };

   private _state: FolderState = "open";

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
      nodes.iconContainer.classList.add(DRAWER_FOLDER_ICON);
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

      if (options.folderIconChevron instanceof Node) {
         const iconChevron = options.folderIconChevron.cloneNode(true);
         this.domNodes.iconChevron.appendChild(iconChevron);
      }

      nodes.head.append(nodes.iconContainer, nodes.input, nodes.iconChevron);

      // Only append head if not root
      const isRoot = !folder.parent;

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

      this.updateIcon();
      this.updateIndentation();
      this._initEvents();

      if (!isRoot) {
         makeDrawerItemDraggable(this.folder, this.domNodes.head);
      }

      // Set default state
      if (typeof options.folderState == "function") {
         this.setState(options.folderState(folder.source));
      } else {
         this.setState(options.folderState);
      }
   }

   public setState(state: FolderState) {
      if (!this.folder.parent) return;

      this._state = state;
      this.updateIcon();

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
         if (this._isFrozen) return;
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

            // Focus
            this.focus();
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

   /**
    * Update the indentation based on its source.
    * @param recursive Controls if it should recursively update the indentation of its children. Defaults to true.
    * @returns {void}
    */
   updateIndentation(recursive = true): void {
      const isRoot = !this.folder.parent;
      if (isRoot) {
         this.domNodes.indentGuide.style.display = "none";
         return;
      }

      const indentSize = this._getCalculatedIndentSize();
      this.domNodes.head.style.paddingLeft = indentSize + "em";

      const indentGuideOffset = this.folder.drawer.options.indentGuideOffset;
      this.domNodes.indentGuide.style.left =
         indentSize + indentGuideOffset + "em";

      if (recursive) {
         for (const [_, item] of this.folder.drawer.items) {
            if (!isChildOf(this.folder.source, item.source)) continue;
            item.widget.updateIndentation(false);
         }
      }
   }

   /**
    * Updates the icon of the folder based on the current state.
    * @function
    * @returns {void}
    */
   updateIcon(): void {
      const options = this.folder.drawer.options;
      const isOpen = this.state === "open";

      let iconToUse = isOpen ? options.folderIcon : options.folderIconClosed;

      if (!iconToUse) {
         iconToUse = options.folderIcon
            ? options.folderIcon
            : options.folderIconClosed;
      }

      if (typeof iconToUse == "function") {
         const icon = iconToUse(this.folder.source);
         this.setIcon(icon);
      } else {
         this.setIcon(
            typeof iconToUse == "string" ? iconToUse : iconToUse.cloneNode(true)
         );
      }
   }

   /**
    * Sort child items.
    * @function
    * @returns {void}
    */
   sort(): void {
      const children = this.folder.getChildren();

      children.sort((a, b) => {
         if (a.type === "folder" && b.type === "file") {
            return -1;
         } else if (a.type === "file" && b.type === "folder") {
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
