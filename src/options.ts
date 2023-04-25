export const defaultOptions = {
   /**
    * The HTML element to use as the root element of the drawer.
    */
   element: document.createElement("div") as HTMLElement,
   /**
    * The class name to use for folder items.
    */
   folderClassName: "",
   /**
    * The icon to use for closed folders. This can be a string representing a CSS class, or a Node representing an HTML element, or a function that takes a file source and returns either a string or a Node.
    */
   folderIconClosed: "" as string | Node | ((source: string) => string | Node),
   /**
    * The icon to use for folders. This can be a string representing a CSS class, or a Node representing an HTML element, or a function that takes a file source and returns either a string or a Node.
    */
   folderIcon: "" as string | Node | ((source: string) => string | Node),
   /**
    * The icon to use for the chevron on folder items. This can be a string representing a CSS class, or a Node representing an HTML element.
    */
   folderIconChevron: "" as string | Node,
   /**
    * The class name to use for file items.
    */
   fileClassName: "",
   /**
    * The icon to use for file items. This can be a string representing a CSS class, a Node representing an HTML element, or a function that takes a file source and returns either a string or a Node.
    */
   fileIcon: "" as string | Node | ((source: string) => string | Node),
   /**
    * Whether or not to allow editing the name of a folder item by double-clicking on it.
    * @default false
    */
   editFolderNameOnDoubleClick: false,
   /**
    * Whether or not to allow editing the name of a file item by double-clicking on it.
    * @default true
    */
   editFileNameOnDoubleClick: true,
   /**
    * Item indent size (in em)
    * @default 1
    */
   indentSize: 1,
   /**
    * Folder tree indent guide offset (in em)
    * @default 0.75
    */
   indentGuideOffset: 0.75,
   /**
    * A regular expression to match items that should be opaque in the drawer.
    */
   opaqueItemsRegex: undefined as RegExp | undefined,
   /**
    * Controls whether the drawer can be scrolled horizontally or not. You would probably want to set this to false if the drawer container is resizable.
    * @default true
    */
   horizontalScroll: true,
   animated: true
};

/**
 * Options for configuring the behavior and appearance of the drawer.
 */
export type IDrawerOptions = typeof defaultOptions;
