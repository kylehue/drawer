import {
   DRAWER,
   DRAWER_ANIMATED,
   DRAWER_FILE,
   DRAWER_FOLDER,
   DRAWER_HIDDEN,
   DRAWER_SCROLLABLE,
} from "./classNames.js";
import { File } from "./File.js";
import { Folder } from "./Folder.js";
import { Hooks } from "./Hooks.js";
import { IDrawerOptions, defaultOptions } from "./options.js";

let lastId = 0;

export class Drawer extends Hooks {
   public id = "$drawer" + lastId++;
   public options: IDrawerOptions;
   public items = new Map<string, Folder | File>();
   private focusedItem: Folder | File | null = null;
   protected root?: Folder;
   protected element?: HTMLElement;

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
   }

   /**
    * Appends the root widget container to the specified HTML element.
    *
    * @param element The HTML element to which the root widget container will be appended.
    */
   initRoot(element: HTMLElement) {
      this.element = element;

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

      element.append(this.root.widget.domNodes.container);
      element.classList.add(DRAWER);

      if (this.options.animated) {
         element.classList.add(DRAWER_ANIMATED);
      }

      if (this.options.horizontalScroll) {
         element.classList.add(DRAWER_SCROLLABLE);
      } else {
         element.onscroll = () => {
            element.scrollLeft = 0;
         };
      }

      return this.root;
   }

   getRoot() {
      // @ts-ignore
      const root = this.root;

      if (!root) {
         throw new Error(
            "Root doesn't exist. Please make sure that initRoot() has been called."
         );
      }

      return root;
   }

   /**
    * Filters the drawer items based on the search value. If search value is not provided, all items will be shown.
    * @param {string} searchValue The search value.
    * @returns An array of items that matches the search value.
    */
   filter(searchValue?: string) {
      let matchedItems: (Folder | File)[] = [];
      for (let [_, item] of this.items) {
         // Reset all if searchValue is empty
         if (!searchValue) {
            item.widget.domNodes.container.classList.remove(DRAWER_HIDDEN);
            matchedItems.push(item);
            continue;
         }

         // Skip if root
         if (item.source == "/") continue;

         let matches = item.name.match(searchValue);

         // If it matches...
         if (matches) {
            // ...show it
            item.widget.domNodes.container.classList.remove(DRAWER_HIDDEN);
            let parent = item.parent;

            matchedItems.push(item);

            // Show parents recursively
            while (parent?.parent) {
               parent.widget.domNodes.container.classList.remove(DRAWER_HIDDEN);
               parent = parent.parent;
            }
         } else {
            item.widget.domNodes.container.classList.add(DRAWER_HIDDEN);
         }
      }

      return matchedItems;
   }

   getSelectedItem() {
      return this.focusedItem;
   }

   // private getItemsAround(item: Folder | File) {
   //    const items = Object.values(Object.fromEntries(this.items));
   //    let itemBelow: Folder | File | null = null;
   //    let itemAbove: Folder | File | null = null;

   //    const getItemAbove = (_item: Folder | File) => {

   //    };

   //    const getItemBeneath = () => {};

   //    if (item.widget.order == 0) {
   //       itemAbove = item.parent;
   //    }

   //    // First, we can get item above/below by checking siblings
   //    const siblings = item.parent?.getChildren() || [];
   //    for (const sibling of siblings) {
   //       const isFile = sibling.type == "file";
   //       const isFolder = sibling.type == "folder";
   //       const isClosedFolder =
   //          sibling.type == "folder" && sibling.widget.state == "close";
   //       const isEmptyFolder = sibling.type == "folder" && !sibling.getChildren().length;
   //       //if (sibling.type == "folder" && sibling.widget.state == "open") continue;

   //       if (isFile || isClosedFolder || isEmptyFolder) {
   //          if (sibling.widget.order == item.widget.order - 1) {
   //             itemAbove = sibling;
   //          }

   //          if (sibling.widget.order == item.widget.order + 1) {
   //             itemBelow = sibling;
   //          }
   //       } else {
   //          // If it's an open folder...
   //          // If it's empty, make it the item
   //          if (sibling.widget.order == item.widget.order - 1) {
   //             //itemAbove = sibling;
   //          }

   //          if (sibling.widget.order == item.widget.order + 1) {
   //             //itemBelow = sibling;
   //          }
   //       }

   //    }

   //    // If item above is still null
   //    console.log(item.widget.order);

   //    console.log(itemAbove, itemBelow);

   //    for (let item of items) {
   //       if (item.source == "/") continue;

   //    }
   // }
}

export { File, Folder };
