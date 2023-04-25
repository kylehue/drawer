import * as path from "path-browserify";
import {
   mdiFolder,
   mdiFolderOpen,
   mdiChevronDown,
   mdiLanguageHtml5,
   mdiFile,
} from "https://esm.sh/@mdi/js?exports=mdiFolder,mdiFolderOpen,mdiChevronDown,mdiLanguageHtml5,mdiFile";

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

const drawer = new DrawerBundle({
   element: document.querySelector<HTMLDivElement>("#drawer")!,
   folderIcon: createIcon(mdiFolderOpen, 24, "#fffaa7"),
   folderIconClosed: createIcon(mdiFolder, 24, "#fffaa7"),
   folderIconChevron: createIcon(mdiChevronDown, 24, "#d2d3d7"),
   fileIcon: (source) => {
      let ext = path.extname(source);
      if (ext == ".html") {
         return createIcon(mdiLanguageHtml5, 24, "#dd7933");
      } else {
         return createIcon(mdiFile, 24, "#d2d3d7");
      }
   },
   editFolderNameOnDoubleClick: false,
   opaqueItemsRegex: /^b/,
   horizontalScroll: false,
});

(window as any).root = drawer.root;
console.log(drawer);

drawer.onDidClickItem((e) => {
   console.log("Item clicked:", e.item.source);
});

drawer.onDidRightClickItem((e) => {
   console.log("Item right clicked:", e.item.source);
});

drawer.onDidChangeItemName((e) => {
   console.log("Item name changed:", e);

   if (/\//g.test(e.newName)) {
      e.item.rename(e.oldName);
   }
});

drawer.add("zxc.ts");
drawer.add("abc.ts");
drawer.add("hello.ts");

// implicit folder
let folder1 = drawer.add("src/classes/comps");
drawer.add("src/classes/test");

// force as folder
let folder2 = drawer.add("src", "folder");
drawer.add("src/z/b/c.cpp/d/e.cpp/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z");
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
   //let folder3 = drawer.root.add("src/classes", "folder");
   //console.log(folder1.get("/classes/comps"));
}

// force as file
let file2 = folder2.add("index", "file");

if (folder1.type == "file") {
   folder1.parent;
}
