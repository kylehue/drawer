import * as path from "path-browserify";
import { File } from "./File.js";
import { Folder } from "./Folder.js";
import {
   DRAWER_ITEM,
   DRAWER_ITEM_ICON,
   DRAWER_ITEM_INPUT_FOCUSED,
   DRAWER_ITEM_OPAQUE,
} from "./classNames.js";
import getClassNameTokens from "./utils/getClassNameTokens.js";

export class ItemWidget {
   public domNodes = {
      container: document.createElement("div"),
      input: document.createElement("input"),
      iconContainer: document.createElement("span"),
      icon: document.createElement("span"),
   };

   protected _events: [
      HTMLElement,
      string,
      EventListenerOrEventListenerObject
   ][] = [];

   constructor(private item: Folder | File) {
      const nodes = this.domNodes;

      nodes.iconContainer.classList.add(DRAWER_ITEM_ICON);
      nodes.iconContainer.appendChild(nodes.icon);

      // Remove input autocomplete and spellcheck
      nodes.input.setAttribute("spellcheck", "false");
      nodes.input.setAttribute("autofill", "false");
      nodes.input.setAttribute("autocomplete", "off");
      nodes.input.setAttribute("type", "text");

      this.rename(this.item.name);

      // Events
      this.addEventListener(this.domNodes.input, "keypress", (event) => {
         if (event.key == "Enter") {
            this.blurInput();
            this.domNodes.container.focus({
               preventScroll: true,
            });
         }
      });

      this.addEventListener(this.domNodes.input, "blur", () => {
         // Unfocus input on blur
         this.blurInput();

         // Emit event if name changed
         let oldName = item.name;
         let newName = this.domNodes.input.value;
         if (oldName != newName) {
            item.rename(newName);
            item.drawer.trigger("onDidChangeItemName", {
               item,
               newName,
               oldName,
            });
         }
      });

      // If root, trigger clicks on root container
      let isRoot = !item.parent;
      if (isRoot && item.type == "folder") {
         this.addEventListener(this.domNodes.container, "click", (event) => {
            // Trigger folder click event
            if (event.target === this.domNodes.container) {
               item.drawer.trigger("onDidClickItem", {
                  event,
                  item,
               });
            }
         });

         // Trigger folder right click event
         this.addEventListener(
            this.domNodes.container,
            "contextmenu",
            (event) => {
               if (event.target === this.domNodes.container) {
                  item.drawer.trigger("onDidRightClickItem", {
                     event,
                     item,
                  });
               }
            }
         );
      }
   }

   protected focusContainer() {
      let items = document.querySelectorAll("." + DRAWER_ITEM);
      items.forEach((el) => {
         el.removeAttribute("tabindex");
      });

      const nodes = this.domNodes;
      nodes.container.setAttribute("tabindex", "0");
      nodes.container.focus();
   }

   protected setIcon(icon: string | Node) {
      const nodes = this.domNodes;
      // Clear icon first
      while (nodes.icon.firstChild) {
         nodes.icon.removeChild(nodes.icon.firstChild);
      }

      nodes.icon.className = "";
      nodes.icon.removeAttribute("class");

      // Then set
      if (typeof icon == "string") {
         nodes.icon.classList.add(...getClassNameTokens(icon));
      } else if (icon instanceof Node) {
         nodes.icon.appendChild(icon);
      }
   }

   /**
    * Calculates and returns the indent size based on the source of the current drawer item.
    * @function
    * @returns {number} The indent size
    */
   protected _getCalculatedIndentSize(): number {
      let source = this.item.source;
      let sourceWithoutLeadingTrailingSlash = source.replace(/^\/|\/$/g, "");
      let level = sourceWithoutLeadingTrailingSlash.split("/").length - 1;
      let indentSize = level * this.item.drawer.options.indentSize;

      return indentSize;
   }

   /**
    * Adds an event listener to the specified element(s) and saves the events for later disposal.
    *
    * @param element - The HTML element(s) to add the event listener to.
    * @param type - A string representing the event type to listen for (e.g. "click", "keydown", etc.).
    * @param listener - A callback function to be executed when the event is fired.
    * @function
    * @returns {void}
    */
   addEventListener<K extends keyof HTMLElementEventMap>(
      element: HTMLElement | HTMLElement[],
      type: K,
      listener: (ev: HTMLElementEventMap[K]) => any
   ): void {
      let elements: HTMLElement[] = Array.isArray(element)
         ? element
         : [element];

      for (let el of elements) {
         this._events.push([
            el,
            type,
            listener as EventListenerOrEventListenerObject,
         ]);
         el.addEventListener(type, listener);
      }
   }

   /**
    * Focuses on the input element of the current drawer item.
    * @function
    * @returns {void}
    */
   focusInput(): void {
      this.domNodes.input.classList.add(DRAWER_ITEM_INPUT_FOCUSED);
      this.domNodes.input.focus();
      let selectRange = 0;
      let extname = path.extname(this.domNodes.input.value);
      if (this.item.type != "file" || !extname) {
         selectRange = this.domNodes.input.value.length;
      } else {
         selectRange = this.domNodes.input.value.indexOf(extname);
      }

      this.domNodes.input.setSelectionRange(0, selectRange);
   }

   /**
    * Blurs the input element of the current drawer item.
    * @function
    * @returns {void}
    */
   blurInput(): void {
      this.domNodes.input.classList.remove(DRAWER_ITEM_INPUT_FOCUSED);
      this.domNodes.input.blur();
   }

   /**
    * Disposes the current drawer item.
    * Removes all event listeners attached to its DOM nodes and removes the container from the DOM.
    * @function
    * @returns {void}
    */
   dispose(): void {
      for (let node of Object.values(this.domNodes)) {
         const events = this._events.filter((evt) => evt[0] === node);
         events.forEach((evt) => node.removeEventListener(evt[1], evt[2]));
      }

      let parentNode = this.item.parent?.widget.domNodes.body;
      if (parentNode && parentNode.contains(this.domNodes.container)) {
         parentNode.removeChild(this.domNodes.container);
      }
   }

   rename(name: string) {
      this.domNodes.input.value = name;

      // Should be opaque?
      let opaqueItemsRegex = this.item.drawer.options.opaqueItemsRegex;
      if (opaqueItemsRegex) {
         if (opaqueItemsRegex?.test(name)) {
            this.domNodes.container.classList.add(DRAWER_ITEM_OPAQUE);
         } else {
            this.domNodes.container.classList.remove(DRAWER_ITEM_OPAQUE);
         }
      }
   }
}
