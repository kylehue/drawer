import { Folder } from "./Folder.js";
import { File } from "./File.js";
import path from "path-browserify";
import { isChildOf } from "./utils.js";
import {
   DRAWER_DRAG_LABEL,
   DRAWER_DROP_TARGET,
   DRAWER_FOLDER,
} from "./classNames.js";

interface IDraggableOptions {
   /**
    * The offset distance before the drag gets activated.
    */
   buffer: number;
   /**
    * Time limit (in ms) before a closed drop target folder opens.
    */
   closedFolderTimeLimitBeforeOpen: number;
}

interface IDraggable {
   id: string;
   item: Folder | File;
   isMouseDown: boolean;
   isDragging: boolean;
   onDrag: (event: MouseEvent) => void;
   onDrop: () => void;
}

// 1 group = 1 drawer
const draggableGroups = new Map<string, Map<string, IDraggable>>();

addEventListener("mousemove", (event) => {
   draggableGroups.forEach((draggableGroup) => {
      draggableGroup.forEach((drag) => {
         if (drag.isMouseDown) {
            drag.isDragging = true;
            drag.onDrag(event);
         }
      });
   });
});

addEventListener("mouseup", (event) => {
   draggableGroups.forEach((draggableGroup) => {
      draggableGroup.forEach((drag) => {
         drag.isDragging = false;
         drag.isMouseDown = false;
         drag.onDrop();
      });
   });
});

const dragLabel = document.createElement("span");
dragLabel.classList.add(DRAWER_DRAG_LABEL);
export function makeDrawerItemDraggable(
   item: Folder | File,
   element: HTMLElement,
   options: Partial<IDraggableOptions> = {}
) {
   let opts = Object.assign<IDraggableOptions, Partial<IDraggableOptions>>(
      {
         buffer: 5,
         closedFolderTimeLimitBeforeOpen: 500,
      },
      options
   );

   // Get draggable group
   let draggableGroup = draggableGroups.get(item.drawer.id) as Map<
      string,
      IDraggable
   >;

   // Instantiate draggable group if it doesn't exist
   if (!draggableGroup) {
      draggableGroup = new Map();
      draggableGroups.set(item.drawer.id, draggableGroup);
   }

   let mouseDownPosition = {
      x: 0,
      y: 0,
   };

   item.bindDisposeEvent(
      item.drawer.onDidRenameItem((e) => {
         if (e.item !== item) return;
         let draggableGroup = draggableGroups.get(e.item.drawer.id);
         if (!draggableGroup) return;
         let draggableInstance = draggableGroup.get(e.oldSource);
         if (!draggableInstance) return;
         draggableInstance.id = e.newSource;
         draggableGroup.set(e.newSource, draggableInstance);
         draggableGroup.delete(e.oldSource);
      })
   );

   item.bindDisposeEvent(
      item.drawer.onDidMoveItem((e) => {
         if (e.item !== item) return;
         let draggableGroup = draggableGroups.get(e.item.drawer.id);
         if (!draggableGroup) return;
         let draggableInstance = draggableGroup.get(e.oldSource);
         if (!draggableInstance) return;
         draggableInstance.id = e.newSource;
         draggableGroup.set(e.newSource, draggableInstance);
         draggableGroup.delete(e.oldSource);
      })
   );

   item.bindDisposeEvent(
      item.drawer.onDidDeleteItem((e) => {
         if (e.item !== item) return;
         let draggableGroup = draggableGroups.get(e.item.drawer.id);
         if (!draggableGroup) return;
         draggableGroup.delete(e.item.source);
      })
   );

   const removeAllDropTargetClasses = () => {
      document
         .querySelectorAll(".drawer ." + DRAWER_DROP_TARGET)
         .forEach((el) => {
            el.classList.remove(DRAWER_DROP_TARGET);
         });
   };

   // Triggers when dragging
   let outOfRangeFired = false;
   let dropTarget: Folder | null = null;
   let lastClosedDropTarget: Folder | null = null;
   let isInRoot = path.dirname(item.source) == "/";
   let openClosedDropTargetTimeouts: NodeJS.Timeout[] = [];
   const onDrag = (event: MouseEvent) => {
      let mouseX = event.clientX;
      let mouseY = event.clientY;
      let mouseDownPositionDeltaX = Math.abs(mouseDownPosition.x - mouseX);
      let mouseDownPositionDeltaY = Math.abs(mouseDownPosition.y - mouseY);
      let outOfRange =
         mouseDownPositionDeltaX > opts.buffer ||
         mouseDownPositionDeltaY > opts.buffer;

      // @ts-ignore
      const element = item.drawer.element!;
      const distanceToBottom = mouseY - element?.offsetTop;
      const buffer = dragLabel.offsetHeight + 20;

      // If the mouse is in the bottom buffer zone, scroll down
      if (
         distanceToBottom >=
         element.offsetTop + element.offsetHeight - buffer
      ) {
         element.scrollBy(0, 5);
      }

      if (distanceToBottom <= buffer) {
         element.scrollBy(0, -5);
      }

      // Only fires once
      if (outOfRange && !outOfRangeFired) {
         if (item.type == "folder") item.widget.freeze();
         dragLabel.textContent = item.name;
         document.body.appendChild(dragLabel);
         outOfRangeFired = true;
         isInRoot = path.dirname(item.source) == "/";
      }

      // Fires on mousemove
      if (outOfRangeFired) {
         dragLabel.style.left = mouseX + 10 + "px";
         dragLabel.style.top = mouseY + 5 + "px";

         // Get the drop target element using document.elementFromPoint()
         let targetElement = document.elementFromPoint(mouseX, mouseY);

         if (!targetElement?.matches("." + DRAWER_FOLDER)) {
            while (targetElement?.parentElement) {
               if (targetElement.matches("." + DRAWER_FOLDER)) {
                  break;
               }

               targetElement = targetElement.parentElement;
            }
         }

         // Get the drop target's drawer item
         if (targetElement) {
            dropTarget = null;
            for (const [_, drag] of draggableGroup) {
               // Make sure item is a folder
               if (drag.item.type != "folder") continue;
               // Make sure that the folder container is the drop targetElement
               if (drag.item.widget.domNodes.container !== targetElement)
                  continue;
               // Make sure we're not dropping inside itself or its children
               if (isChildOf(item.source, drag.item.source)) continue;
               // Make sure we're not dropping inside its current directory
               if (path.dirname(item.source) == drag.item.source) continue;
               // Make sure they're in the same drawer
               if (drag.item.drawer !== item.drawer) continue;
               dropTarget = drag.item;
            }
         }

         // If target element is the root's container, make the root the drop target
         if (
            targetElement === item.drawer.getRoot().widget.domNodes.container &&
            !isInRoot
         ) {
            dropTarget = item.drawer.getRoot();
         }

         // If drop target's state is closed, open it after some time of hovering
         if (dropTarget?.widget.state == "close") {
            if (!lastClosedDropTarget) {
               lastClosedDropTarget = dropTarget;
               openClosedDropTargetTimeouts.push(
                  setTimeout(() => {
                     dropTarget?.widget.setState("open");
                  }, opts.closedFolderTimeLimitBeforeOpen)
               );
            }
         } else {
            for (let i = 0; i < openClosedDropTargetTimeouts.length; i++) {
               clearTimeout(openClosedDropTargetTimeouts[i]);
               openClosedDropTargetTimeouts.splice(i, 1);
            }
         }

         if (dropTarget != lastClosedDropTarget) {
            lastClosedDropTarget = null;
         }

         // Drop target styling
         removeAllDropTargetClasses();
         if (dropTarget) {
            dropTarget.widget.domNodes.container.classList.add(
               DRAWER_DROP_TARGET
            );
         }
      }
   };

   const onDrop = () => {
      if (dropTarget) {
         item.move(dropTarget.source);
      }

      outOfRangeFired = false;
      dropTarget = null;
      removeAllDropTargetClasses();
      if (document.body.contains(dragLabel)) {
         document.body.removeChild(dragLabel);
      }
   };

   element.addEventListener("mousedown", (event) => {
      if (event.target !== element) return;
      dragLabel.textContent = item.name;
      let draggableGroup = draggableGroups.get(item.drawer.id);
      let draggableInstance = draggableGroup?.get(item.source);
      if (!draggableInstance) return;
      draggableInstance.isMouseDown = true;
      mouseDownPosition = { x: event.clientX, y: event.clientY };
      if (draggableInstance.item.type == "folder") {
         draggableInstance.item.widget.unfreeze();
      }
   });

   // Add to draggables group
   draggableGroup.set(item.source, {
      id: item.source,
      item,
      isMouseDown: false,
      isDragging: false,
      onDrag,
      onDrop,
   });
}
