import * as path from "path-browserify";
import {
   mdiFolder,
   mdiFolderOpen,
   mdiChevronDown,
   mdiLanguageHtml5,
   mdiFile,
   mdiDog,
} from "https://esm.sh/@mdi/js?exports=mdiFolder,mdiFolderOpen,mdiChevronDown,mdiLanguageHtml5,mdiFile,mdiDog";

// ESM
import { Drawer as DrawerESM } from "../build/Drawer.js";

// Bundle
const DrawerBundle: typeof DrawerESM = Drawer.Drawer;

function createIcon(paths: string, size = 24, color = "red") {
   const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
   const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
   svg.setAttribute("viewBox", "0 0 24 24");
   svg.setAttribute("width", size.toString());
   svg.setAttribute("height", size.toString());
   path.setAttribute("d", paths);
   path.setAttribute("fill", color);
   svg.append(path);
   return svg;
}

const drawerA = new DrawerBundle({
   element: document.querySelector<HTMLDivElement>("#drawera")!,
   folderIcon: createIcon(mdiFolderOpen, 24, "#fffaa7"),
   folderIconClosed: "mdi mdi-folder",
   folderIconChevron: createIcon(mdiChevronDown, 24, "#d2d3d7"),
   fileIcon: (source) => {
      let ext = path.extname(source);
      if (ext == ".html") {
         return createIcon(mdiLanguageHtml5, 24, "#dd7933");
      } else if (ext == ".cpp") {
         return createIcon(mdiFile, 24, "#d2d3d7");
      } else {
         return "mdi mdi-file";
      }
   },
   editFolderNameOnDoubleClick: false,
   opaqueItemsRegex: /^b/,
   horizontalScroll: false,
   animated: false,
   folderState: (source) => {
      if (source !== "/src/classes") {
         return "open";
      } else {
         return "close";
      }
   }
});

const drawerB = new DrawerBundle({
   element: document.querySelector<HTMLDivElement>("#drawerb")!,
   folderIcon: "mdi mdi-folder-open",
   folderIconClosed: createIcon(mdiFolder, 24, "#fffaa7"),
   folderIconChevron: createIcon(mdiChevronDown, 24, "#d2d3d7"),
   fileIcon: createIcon(mdiFile, 24, "#d2d3d7"),
   editFolderNameOnDoubleClick: false,
   opaqueItemsRegex: /^b/,
   horizontalScroll: false,
});

const drawerC = new DrawerBundle({
   element: document.querySelector<HTMLDivElement>("#drawerc")!,
   folderIcon: (source) => {
      let name = path.basename(source);
      if (name == "dog") {
         return createIcon(mdiDog, 24, "#fffaa7");
      } else if (name == "cat") {
         return "mdi mdi-cat";
      } else {
         return "mdi mdi-mouse";
      }
   },
   folderIconClosed: "mdi mdi-folder",
   folderIconChevron: createIcon(mdiChevronDown, 24, "#d2d3d7"),
   fileIcon: "mdi mdi-file",
   editFolderNameOnDoubleClick: false,
   opaqueItemsRegex: /^b/,
   horizontalScroll: false,
});

const drawerD = new DrawerBundle({
   element: document.querySelector<HTMLDivElement>("#drawerd")!,
   folderIcon: (source) => {
      let name = path.basename(source);
      if (name == "dog") {
         return createIcon(mdiDog, 24, "#fffaa7");
      } else if (name == "cat") {
         return "mdi mdi-cat";
      } else {
         return "mdi mdi-mouse";
      }
   },
   folderIconClosed: (source) => {
      let name = path.basename(source);
      if (name == "shark") {
         return "mdi mdi-shark";
      } else if (name == "fish") {
         return "mdi mdi-fish";
      } else {
         return "mdi mdi-horse";
      }
   },
   folderIconChevron: createIcon(mdiChevronDown, 24, "#d2d3d7"),
   fileIcon: "mdi mdi-file",
   editFolderNameOnDoubleClick: false,
   opaqueItemsRegex: /^b/,
   horizontalScroll: false,
});

(window as any).root = drawerA.root;
console.log(drawerA);

drawerB.root.add("a/b/c/d/e/f/g/");
drawerB.root.add("a/b/c/cat.html");
drawerB.root.add("a/b/c/dog.cpp");
drawerB.root.add("a/b/c/mice.txt");

drawerC.root.add("a/b/c/d/cat/f/g/");
drawerC.root.add("a/dog/c/cat.html");
drawerC.root.add("a/b/test/dog.cpp");
drawerC.root.add("a/b/c/mice.txt");

drawerD.root.add("a/b/c/d/shark/f/g/");
drawerD.root.add("a/dog/c/cat.html");
drawerD.root.add("a/b/fish/dog.cpp/");
drawerD.root.add("a/b/c/mice.txt");
drawerD.root.get("a/b/fish", "folder")?.widget.setState("close");
drawerD.root.get("a/b/c/d/shark", "folder")?.widget.setState("close");


drawerA.onDidClickItem((e) => {
   console.log("Item clicked:", e.item.source);
});

drawerA.onDidRightClickItem((e) => {
   console.log("Item right clicked:", e.item.source);
});

drawerA.onDidChangeItemName((e) => {
   console.log("Item name changed:", e);

   if (/\//g.test(e.newName)) {
      e.item.rename(e.oldName);
   }
});

drawerA.root.add("zxc.ts");
drawerA.root.add("abc.ts");
drawerA.root.add("hello.ts");

// implicit folder
let folder1 = drawerA.root.add("src/classes/comps");
drawerA.root.add("src/classes/test");

// force as folder
let folder2 = drawerA.root.add("src", "folder");
drawerA.root.add("src/z/b/c.cpp/d/e.cpp/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z");
// implicit file
if (folder1.type == "folder") {
   let file1 = folder1.add("index.html");
   folder1.add("hello.scss");
   folder1.add("file.txt");
   folder1.add("zlast.cpp");
   /* let zzz = folder1.add("zzz", "folder");
   zzz.add("file1.txt");
   zzz.add("file2.txt");
   zzz.add("file3.txt");
   folder1.add("../file1.cpp");
   folder1.add("../file2.cpp");
   folder1.add("../file3.cpp"); */
   //let folder3 = drawerA.root.add("src/classes", "folder");
   //console.log(folder1.get("/classes/comps"));
}

// force as file
let file2 = folder2.add("index", "file");

if (folder1.type == "file") {
   folder1.parent;
}
