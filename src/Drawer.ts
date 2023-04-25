import { Folder } from "./Folder.js";
import { File } from "./File.js";
import { Hooks } from "./Hooks.js";
import { IDrawerOptions, defaultOptions } from "./options.js";
import {
   DRAWER,
   DRAWER_ANIMATED,
   DRAWER_FILE,
   DRAWER_FOLDER,
   DRAWER_SCROLLABLE,
} from "./classNames.js";
import { ItemResult, ItemTypeMap } from "./utils/getItemTypeFromSource.js";

export class Drawer
   extends Hooks
   implements Pick<Folder, "add" | "delete" | "clear" | "get" | "getChildren">
{
   public options: IDrawerOptions;
   public root: Folder;
   public items: Map<string, Folder | File> = new Map();
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

      if (!this.options.element) {
         throw new Error(
            "The drawer cannot be appended to a null or undefined element. Please provide a valid container element."
         );
      }

      this.root = new Folder(this, null, "/");

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

      // Add keyboard support
      window.addEventListener("keydown", (event) => {
         let drawerItemHasFocus =
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

   add<S extends string, K extends keyof ItemTypeMap>(
      source: S,
      type?: K
   ): ItemResult<S, K> {
      return this.root.add(source, type);
   }

   getChildren(): Array<Folder | File> {
      return this.root.getChildren();
   }

   delete(source?: string) {
      this.root.delete(source);
   }

   clear() {
      this.root.clear();
   }

   get<K extends keyof ItemTypeMap>(source: string, type?: K | undefined) {
      return this.root.get(source, type);
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
