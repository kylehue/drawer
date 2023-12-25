import path from "path-browserify";
import {
   mdiFolder,
   mdiFolderOpen,
   mdiChevronDown,
   mdiLanguageHtml5,
   mdiFile,
   mdiDog,
} from "https://esm.sh/@mdi/js?exports=mdiFolder,mdiFolderOpen,mdiChevronDown,mdiLanguageHtml5,mdiFile,mdiDog";

(window as any).path = path;

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
   transluscentItemsRegex: /^b/,
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

drawerA.initRoot(document.querySelector<HTMLDivElement>("#drawera")!);

const drawerB = new DrawerBundle({
   folderIcon: "mdi mdi-folder-open",
   folderIconClosed: createIcon(mdiFolder, 24, "#fffaa7"),
   folderIconChevron: createIcon(mdiChevronDown, 24, "#d2d3d7"),
   fileIcon: createIcon(mdiFile, 24, "#d2d3d7"),
   editFolderNameOnDoubleClick: false,
   transluscentItemsRegex: /^b/,
   horizontalScroll: false,
});

drawerB.initRoot(document.querySelector<HTMLDivElement>("#drawerb")!);

const drawerC = new DrawerESM({
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
   editFolderNameOnDoubleClick: true,
   transluscentItemsRegex: /^b/,
   horizontalScroll: false,
});

drawerC.initRoot(document.querySelector<HTMLDivElement>("#drawerc")!);

const drawerD = new DrawerESM({
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
   editFolderNameOnDoubleClick: true,
   transluscentItemsRegex: /^\./,
   horizontalScroll: false,
});

drawerD.initRoot(document.querySelector<HTMLDivElement>("#drawerd")!);
let test = "a/b";
const t = drawerB.getRoot().add(test);

(window as any).drawerA = drawerA;
(window as any).drawerB = drawerB;
(window as any).drawerC = drawerC;
(window as any).drawerD = drawerD;

drawerB.getRoot().add("a/b/c/d/e/f/g/");
drawerB.getRoot().add("a/b/c/cat.html");
drawerB.getRoot().add("a/b/c/dog.cpp");
drawerB.getRoot().add("a/b/c/mice.txt");

drawerC.getRoot().add("a/b/c/d/cat/f/g/");
drawerC.getRoot().add("a/dog/c/cat.html");
drawerC.getRoot().add("a/b/test/dog.cpp");
drawerC.getRoot().add("a/b/c/mice.txt");

drawerA.onDidClickItem((e) => {
   console.log("Item clicked:", e.item.source);
});

drawerA.onDidRightClickItem((e) => {
   console.log("Item right clicked:", e.item.source);
});

drawerA.onDidRenameItem((e) => {
   console.log("Item name changed:", e);

   if (/^c/.test(e.newName)) {
      e.item.rename("i cant start with c");
   }
   
   if (/\//g.test(e.newName)) {
      e.item.rename(e.oldName);
   }
});

drawerA.onDidMoveItem((e) => {
   console.log("Item moved:", e);
});

drawerA.onDidAddItem((e) => {
   console.log("Item added:", e);
});

drawerA.onDidDeleteItem((e) => {
   console.log("Item deleted:", e);
});

drawerA.onError((e) => {
   console.error(e.reason);
})

let folderA = drawerA.getRoot().add("/src", "folder");
let folderB = drawerA.getRoot().add("/src/classes/comps", "folder");
let fileA = folderA.add("c_memo.txt");
drawerA.getRoot().add("src/src", "file");

drawerD.getRoot().add("zxc.ts");
drawerD.getRoot().add("abc.ts");
drawerD.getRoot().add("hello.ts");

// implicit folder
let folder1 = drawerD.getRoot().add("src/classes/comps");
drawerD.getRoot().add("src/classes/test");

// force as folder
let folder2 = drawerD.getRoot().add("src", "folder");
drawerD.getRoot().add("src/.opaque/b/c.cpp/d/e.cpp/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z");

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
   //let folder3 = drawerA.getRoot().add("src/classes", "folder");
   //console.log(folder1.get("/classes/comps"));
}

// force as file
let file2 = folder2.add("index", "file");

if (folder1.type == "file") {
   folder1.parent;
}

document.querySelector<HTMLInputElement>("#filter")?.addEventListener("input", (ev) => {
   let input = ev.target as HTMLInputElement;
   let matchesDrawerA = drawerA.filter(input.value);

   if (!matchesDrawerA.length) {
      console.log("no matches!");
   }

   drawerB.filter(input.value);
   drawerC.filter(input.value);
   drawerD.filter(input.value);
})

addEventListener("keydown", e => {
   if (e.key == "Delete") {
      drawerA.getSelectedItem()?.delete();
      drawerB.getSelectedItem()?.delete();
      drawerC.getSelectedItem()?.delete();
      drawerD.getSelectedItem()?.delete();
   }
})