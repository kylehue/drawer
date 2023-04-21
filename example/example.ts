import Drawer from "../build/index.js";
// @ts-ignore
import {
   mdiFolder,
   mdiFolderOpen,
} from "https://esm.sh/@mdi/js?exports=mdiFolder,mdiFolderOpen";
console.log(mdiFolder);

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

const drawer = new Drawer({
   element: document.querySelector<HTMLDivElement>("#drawer")!,
   folderIcon: createIcon(mdiFolder, 24, "#fffaa7"),
   folderIconOpen: createIcon(mdiFolderOpen, 24, "#fffaa7"),
   fileIcon: (ext) => {
      if (ext == ".html") {
         return "hi";
      } else {
         return "hello";
      }
   },
});

// implicit folder
let folder1 = drawer.add("src");

// force as folder
let folder2 = drawer.add("srsc.dot", "folder");

// implicit file
if (folder1.type == "folder") {
   let file1 = folder1.add("index.html");
}

// force as file
let file2 = folder2.add("index", "file");

if (folder1.type == "file") {
   folder1.parent;
}

console.log(drawer);
