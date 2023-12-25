import {
   DRAWER_ITEM_INPUT,
   DRAWER_FILE_INPUT,
   DRAWER_FILE_ICON,
   DRAWER_ITEM_BLURRED,
   DRAWER_FILE,
   DRAWER_ITEM,
   DRAWER_ITEM_INPUT_FOCUSED,
} from "./classNames.js";
import { makeDrawerItemDraggable } from "./drag.js";
import { File } from "./File.js";
import { ItemWidget } from "./ItemWidget.js";
import { getClassNameTokens } from "./utils.js";

export class FileWidget extends ItemWidget {
   constructor(private file: File) {
      super(file);
      const nodes = this.domNodes;
      const options = file.drawer.options;

      // Init class names
      nodes.input.classList.add(DRAWER_ITEM_INPUT, DRAWER_FILE_INPUT);
      nodes.iconContainer.classList.add(DRAWER_FILE_ICON);
      nodes.container.classList.add(
         DRAWER_ITEM,
         DRAWER_FILE,
         DRAWER_ITEM_BLURRED,
         ...getClassNameTokens(options.fileClassName)
      );
      
      // Append
      if (options.fileIcon) {
         nodes.container.append(nodes.iconContainer);
      }

      nodes.container.append(nodes.input);
      file.parent.widget.domNodes.body.prepend(nodes.container);

      this.updateIcon();
      this.updateIndentation();
      this._initEvents();

      if (options.draggable) {
         makeDrawerItemDraggable(this.file, this.domNodes.container);
      }
   }

   private _initEvents() {
      const options = this.file.drawer.options;
      // Edit input on double click
      if (options.editFileNameOnDoubleClick) {
         this.addEventListener(this.domNodes.container, "dblclick", (event) => {
            if (event.target == this.domNodes.container) {
               this.focusInput();
            }
         });
      }

      this.addEventListener(this.domNodes.container, "click", (event) => {
         if (this._isFrozen) return;
         if (event.target !== this.domNodes.container) return;
         if (this.domNodes.input === document.activeElement) return;
         // Trigger file click event
         this.file.drawer.trigger("onDidClickItem", {
            event,
            item: this.file,
         });

         // Focus
         this.focus();
      });

      // Trigger file right click event
      this.addEventListener(this.domNodes.container, "contextmenu", (event) => {
         if (event.target == this.domNodes.container) {
            this.file.drawer.trigger("onDidRightClickItem", {
               event,
               item: this.file,
            });
         }
      });
   }

   /**
    * Update the indentation based on its source.
    * @returns {void}
    */
   updateIndentation(): void {
      const indentSize = this._getCalculatedIndentSize();

      this.domNodes.container.style.paddingLeft = this.file.drawer.options.leftSpacing + indentSize + "rem";
   }

   /**
    * Updates the icon of the file.
    * @function
    * @returns {void}
    */
   updateIcon(): void {
      const options = this.file.drawer.options;

      if (typeof options.fileIcon == "function") {
         const icon = options.fileIcon(this.file.source);
         this.setIcon(icon);
      } else {
         this.setIcon(
            typeof options.fileIcon == "string"
               ? options.fileIcon
               : options.fileIcon.cloneNode(true)
         );
      }
   }
}
