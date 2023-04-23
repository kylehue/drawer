import Folder from "./Folder.js";
import File from "./File.js";

/**
 * Options for configuring the behavior and appearance of a drawer.
 * @interface
 */
export interface IDrawerOptions {
   /**
    * The HTML element to use as the root element of the drawer.
    */
   element: HTMLElement;
   /**
    * The class name to use for folder items.
    */
   folderClassName: string;
   /**
    * The icon to use for closed folders. This can be a string representing a CSS class, or a Node representing an HTML element.
    */
   folderIcon: string | Node;
   /**
    * The icon to use for open folders. This can be a string representing a CSS class, or a Node representing an HTML element.
    */
   folderIconOpen: string | Node;
   /**
    * The icon to use for the chevron on folder items. This can be a string representing a CSS class, or a Node representing an HTML element.
    */
   folderIconChevron: string | Node;
   /**
    * The class name to use for file items.
    */
   fileClassName: string;
   /**
    * The icon to use for file items. This can be a string representing a CSS class, a Node representing an HTML element, or a function that takes a file source and returns either a string or a Node.
    */
   fileIcon: string | Node | ((source: string) => string | Node);
   /**
    * Whether or not to allow editing the name of a folder item by double-clicking on it.
    * @default false
    */
   editFolderNameOnDoubleClick: boolean;
   /**
    * Whether or not to allow editing the name of a file item by double-clicking on it.
    * @default true
    */
   editFileNameOnDoubleClick: boolean;
}

export interface ItemTypeMap {
   folder: Folder;
   file: File;
}
