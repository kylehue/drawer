import * as path from "path-browserify";
import {
   DRAWER_ITEM_BLURRED,
   DRAWER_ITEM_FOCUSED,
   DRAWER_ITEM_ICON,
   DRAWER_ITEM_INPUT_FOCUSED,
   DRAWER_ITEM_TRANSLUSCENT,
} from "./classNames.js";
import { File } from "./File.js";
import { Folder } from "./Folder.js";
import { getClassNameTokens } from "./utils.js";

export class ItemWidget {
   public readonly domNodes = {
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

   protected _isFrozen = false;
   public order = 0;

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
         const oldName = item.name;
         const newName = this.domNodes.input.value;
         if (oldName != newName) {
            item.rename(newName);
         }
      });

      // If root, trigger clicks on root container
      const isRoot = !item.parent;
      if (isRoot && item.type == "folder") {
         this.addEventListener(this.domNodes.container, "click", (event) => {
            // Trigger folder click event
            if (event.target === this.domNodes.container) {
               if (item.isDeleted) return;
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
                  if (item.isDeleted) return;
                  item.drawer.trigger("onDidRightClickItem", {
                     event,
                     item,
                  });
               }
            }
         );
      }
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
      const source = this.item.source;
      const sourceWithoutLeadingTrailingSlash = source.replace(/^\/|\/$/g, "");
      const level = sourceWithoutLeadingTrailingSlash.split("/").length - 1;
      const indentSize = level * this.item.drawer.options.indentSize;

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
      const elements: HTMLElement[] = Array.isArray(element)
         ? element
         : [element];

      for (const el of elements) {
         this._events.push([
            el,
            type,
            listener as EventListenerOrEventListenerObject,
         ]);
         el.addEventListener(type, listener);
      }
   }

   /**
    * Focuses the drawer item.
    * @function
    * @returns {void}
    */
   focus(): void {
      if (this._isFrozen) return;

      // Blur all items
      for (const [source, item] of this.item.drawer.items) {
         if (item == this.item) continue;
         item.widget.blur();
      }

      // Add focus class to this item's container
      this.domNodes.container.classList.remove(DRAWER_ITEM_BLURRED);
      this.domNodes.container.classList.add(DRAWER_ITEM_FOCUSED);

      // Make container focusable
      this.domNodes.container.setAttribute("tabindex", "0");
      this.domNodes.container.focus({
         preventScroll: true,
      });

      this.item.drawer.focusedItem = this.item;
   }

   /**
    * Disables focus events.
    */
   freeze() {
      this._isFrozen = true;
   }

   /**
    * Enables focus events.
    */
   unfreeze() {
      this._isFrozen = false;
   }

   /**
    * Removes the drawer item's focus.
    * @function
    * @returns {void}
    */
   blur(): void {
      this.domNodes.container.classList.remove(DRAWER_ITEM_FOCUSED);
      this.domNodes.container.classList.add(DRAWER_ITEM_BLURRED);
      this.domNodes.container.removeAttribute("tabindex");

      if (this.item.drawer.focusedItem == this.item) {
         this.item.drawer.focusedItem = null;
      }
   }

   /**
    * Focuses on the input element of the drawer item.
    * @function
    * @returns {void}
    */
   focusInput(): void {
      this.domNodes.input.classList.add(DRAWER_ITEM_INPUT_FOCUSED);
      this.domNodes.input.focus();
      let selectRange = 0;
      const extname = path.extname(this.domNodes.input.value);
      if (this.item.type != "file" || !extname) {
         selectRange = this.domNodes.input.value.length;
      } else {
         selectRange = this.domNodes.input.value.indexOf(extname);
      }

      this.domNodes.input.setSelectionRange(0, selectRange);
   }

   /**
    * Removes the input element's focus.
    * @function
    * @returns {void}
    */
   blurInput(): void {
      this.domNodes.input.classList.remove(DRAWER_ITEM_INPUT_FOCUSED);
      this.domNodes.input.blur();
   }

   /**
    * Disposes the drawer item's DOM node.
    * @function
    * @returns {void}
    */
   dispose(): void {
      for (const node of Object.values(this.domNodes)) {
         const events = this._events.filter((evt) => evt[0] === node);
         events.forEach((evt) => node.removeEventListener(evt[1], evt[2]));
      }

      const parentNode = this.item.parent?.widget.domNodes.body;
      if (parentNode && parentNode.contains(this.domNodes.container)) {
         parentNode.removeChild(this.domNodes.container);
      }
   }

   /**
    * Renames the drawer item in DOM.
    * @param name The new name
    * @returns {void}
    */
   rename(name: string): void {
      this.domNodes.input.value = name;

      // Should be transluscent?
      const transluscentItemsRegex =
         this.item.drawer.options.transluscentItemsRegex;
      if (transluscentItemsRegex) {
         if (transluscentItemsRegex.test(name)) {
            this.domNodes.container.classList.add(DRAWER_ITEM_TRANSLUSCENT);
         } else {
            this.domNodes.container.classList.remove(DRAWER_ITEM_TRANSLUSCENT);
         }
      }
   }

   /**
    * Moves the drawer item's DOM node to the specified source.
    *
    * @param source The path where to move the item
    * @returns {void}
    */
   move(source: string): void {
      const item = this.item.drawer.root.get(source, "folder");

      if (item) {
         item.widget.domNodes.body.prepend(this.domNodes.container);
         item.widget.updateIndentation();
         item.widget.sort();
      }
   }
}
