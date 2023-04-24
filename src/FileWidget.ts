import File from "./File.js";
import getClassNameTokens from "./utils/getClassNameTokens.js";
import ItemWidget from "./ItemWidget.js";
import { DRAWER_ITEM_INPUT, DRAWER_FILE_INPUT, DRAWER_ITEM_ICON, DRAWER_FILE_ICON, DRAWER_ITEM_BLURRED, DRAWER_FILE, DRAWER_ITEM_FOCUSED, DRAWER_ITEM } from "./classNames.js";

export default class FileWidget extends ItemWidget {
   constructor(private file: File) {
      super(file);
      const nodes = this.domNodes;
      const options = file.drawer.options;

      // Init class names
      nodes.input.classList.add(DRAWER_ITEM_INPUT, DRAWER_FILE_INPUT);
      nodes.icon.classList.add(DRAWER_ITEM_ICON, DRAWER_FILE_ICON);
      nodes.container.classList.add(
         DRAWER_ITEM,
         DRAWER_FILE,
         DRAWER_ITEM_BLURRED,
         ...getClassNameTokens(options.fileClassName)
      );

      nodes.container.append(nodes.icon, nodes.input);
      file.parent.widget.domNodes.body.prepend(nodes.container);

      this._updateIcons();
      this._updateIndentation();
      this._initEvents();
   }

   private _initEvents() {
      const options = this.file.drawer.options;
      // Edit input on double click
      if (options.editFileNameOnDoubleClick) {
         this.addEventListener(
            this.domNodes.container,
            "dblclick",
            (event) => {
               if (event.target == this.domNodes.container) {
                  this.focusInput();
               }
            }
         );
      }

      this.addEventListener(this.domNodes.container, "click", (event) => {
         if (event.target !== this.domNodes.container) return;
         // Trigger file click event
         this.file.drawer.trigger("onDidClickItem", {
            event,
            item: this.file,
         });

         // Handle file focus
         // First, remove all item focus
         let focusClass = DRAWER_ITEM_FOCUSED;
         let blurClass = DRAWER_ITEM_BLURRED;
         let items = document.querySelectorAll("." + DRAWER_ITEM);
         items.forEach((el) => {
            el.classList.remove(focusClass);
            el.classList.add(blurClass);
         });

         // Then, add focus class for this file
         this.domNodes.container.classList.remove(blurClass);
         this.domNodes.container.classList.add(focusClass);

         // Set drawer focused item
         this.file.drawer.focusedItem = this.file;
      });

      // Trigger file right click event
      this.addEventListener(
         this.domNodes.container,
         "contextmenu",
         (event) => {
            if (event.target == this.domNodes.container) {
               this.file.drawer.trigger("onDidRightClickItem", {
                  event,
                  item: this.file,
               });
            }
         }
      );
   }

   private _updateIcons() {
      const options = this.file.drawer.options;
      const nodes = this.domNodes;
      const fixIcon = (icon: string | Node) => {
         if (typeof icon == "string") {
            nodes.icon.classList.add(...getClassNameTokens(icon));
         }

         // Append all nodes
         if (icon instanceof Node) {
            this.domNodes.icon.appendChild(icon);
         }
      }

      if (typeof options.fileIcon == "function") {
         let icon = options.fileIcon(this.file.source);
         fixIcon(icon);
      }
   }

   private _updateIndentation() {
      let indentSize = this._getCalculatedIndentSize();

      this.domNodes.container.style.paddingLeft = indentSize + "em";
   }
}
