import { basename } from "path-browserify";
import File from "./File.js";
import getClassNameTokens from "./utils/getClassNameTokens.js";
import ItemWidget from "./ItemWidget.js";

export default class FileWidget extends ItemWidget {
   constructor(private file: File) {
      super(file);
      const nodes = this.domNodes;
      const options = file.drawer.options;

      // Init class names
      nodes.container.classList.add(
         ...getClassNameTokens(options.fileClassName)
      );

      nodes.container.append(nodes.icon, nodes.input);
      file.parent.widget.domNodes.body.append(nodes.container);

      this._updateName();
      this._updateIcons();
      this._initEvents();
   }

   private _initEvents() {
      const options = this.file.drawer.options;
      // Edit input on double click
      if (options.editFileNameOnDoubleClick) {
         this._addEventListener(
            this.domNodes.container,
            "dblclick",
            (event) => {
               if (event.target == this.domNodes.container) {
                  this.focusInput();
               }
            }
         );
      }

      // Trigger file click event
      this._addEventListener(this.domNodes.container, "click", (event) => {
         if (event.target == this.domNodes.container) {
            this.file.drawer.trigger("onFileClick", {
               event,
               file: this.file,
            });
         }
      });

      // Trigger file right click event
      this._addEventListener(
         this.domNodes.container,
         "contextmenu",
         (event) => {
            if (event.target == this.domNodes.container) {
               this.file.drawer.trigger("onFileRightClick", {
                  event,
                  file: this.file,
               });
            }
         }
      );
   }

   private _updateName() {
      let fileName = basename(this.file.source);
      this.domNodes.input.value = fileName;
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
}
