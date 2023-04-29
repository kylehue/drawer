import {
   DRAWER,
   DRAWER_ANIMATED,
   DRAWER_FILE,
   DRAWER_FOLDER,
   DRAWER_SCROLLABLE,
} from "./classNames.js";
import { File } from "./File.js";
import { Folder } from "./Folder.js";
import { Hooks } from "./Hooks.js";
import { IDrawerOptions, defaultOptions } from "./options.js";

export class Drawer extends Hooks {
   public options: IDrawerOptions;
   public root: Folder;
   public items = new Map<string, Folder | File>();
   public focusedItem: Folder | File | null = null;

   /**
    *
    * @param options Options for configuring the behavior and appearance of a drawer.
    */
   constructor(options?: Partial<IDrawerOptions>) {
      super();

      // Options defaults
      this.options = Object.assign<IDrawerOptions, Partial<IDrawerOptions>>(
         Object.assign({}, defaultOptions),
         options || {}
      );
      
      // Setup element
      if (!this.options.element) {
         throw new Error(
            "The drawer cannot be appended to a null or undefined element. Please provide a valid container element."
         );
      }

      this.options.element.classList.add(DRAWER);

      if (this.options.animated) {
         this.options.element.classList.add(DRAWER_ANIMATED);
      }

      if (this.options.horizontalScroll) {
         this.options.element.classList.add(DRAWER_SCROLLABLE);
      } else {
         this.options.element.onscroll = () => {
            this.options.element.scrollLeft = 0;
         };
      }

      // Setup root
      this.root = new Folder(this, null, "/");
      this.items.set("/", this.root);

      // Add keyboard support
      window.addEventListener("keydown", (event) => {
         const drawerItemHasFocus =
            document.activeElement?.classList.contains(DRAWER_FOLDER) ||
            document.activeElement?.classList.contains(DRAWER_FILE);

         // Rename on F2
         if (drawerItemHasFocus && this.focusedItem) {
            if (event.key == "F2") {
               this.focusedItem.widget.focusInput();
            }
         }
      });
   }

   /**
    * Appends the root widget container to the specified HTML element.
    *
    * @param element The HTML element to which the root widget container will be appended.
    */
   appendTo(element: HTMLElement) {
      element.append(this.root.widget.domNodes.container);
   }
}

export { File, Folder };
