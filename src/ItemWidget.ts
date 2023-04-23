import path from "path-browserify";
import File from "./File.js";
import Folder from "./Folder.js";

export default class ItemWidget {
   public domNodes = {
      container: document.createElement("div"),
      input: document.createElement("input"),
      icon: document.createElement("span"),
   };

   protected _events: [
      HTMLElement,
      string,
      EventListenerOrEventListenerObject
   ][] = [];

   constructor(private item: Folder | File) {
      const nodes = this.domNodes;
      nodes.container.classList.add(`drawer-${item.type}`);
      nodes.input.classList.add("drawer-input", `drawer-${item.type}-input`);
      nodes.icon.classList.add("drawer-icon", `drawer-${item.type}-icon`);
      // Remove input autocomplete and spellcheck
      nodes.input.setAttribute("spellcheck", "false");
      nodes.input.setAttribute("autocomplete", "off");

      this._addEventListener(this.domNodes.input, "keypress", (event) => {
         if (event.key == "Enter") {
            this.blurInput();
         }
      });

      this._addEventListener(this.domNodes.input, "blur", () => {
         // Unfocus input on blur
         this.blurInput();

         // Emit event if name changed
         let oldName = path.basename(item.source);
         let newName = this.domNodes.input.value;
         if (oldName != newName) {
            item.rename(newName);
            if (item.type == "folder") {
               item.drawer.trigger("onDidChangeFolderName", {
                  folder: item,
                  newName,
                  oldName,
               });
            } else {
               item.drawer.trigger("onDidChangeFileName", {
                  file: item,
                  newName,
                  oldName,
               });
            }
         }
      });
   }

   protected _addEventListener<K extends keyof HTMLElementEventMap>(
      element: HTMLElement,
      type: K,
      listener: (ev: HTMLElementEventMap[K]) => any
   ) {
      this._events.push([
         element,
         type,
         listener as EventListenerOrEventListenerObject,
      ]);
      element.addEventListener(type, listener);
   }

   public focusInput() {
      this.domNodes.input.classList.add("drawer-input-focused");
      this.domNodes.input.focus();
      let selectRange = 0;
      let extname = path.extname(this.domNodes.input.value);
      if (this.item.type != "file" || !extname) {
         selectRange = this.domNodes.input.value.length;
      } else {
         selectRange = extname.length;
      }

      this.domNodes.input.setSelectionRange(0, selectRange);
   }

   public blurInput() {
      this.domNodes.input.classList.remove("drawer-input-focused");
      this.domNodes.input.blur();
   }

   dispose() {
      for (let node of Object.values(this.domNodes)) {
         const events = this._events.filter((evt) => evt[0] === node);
         events.forEach((evt) => node.removeEventListener(evt[1], evt[2]));
      }

      this.domNodes.container.remove();
   }
}
