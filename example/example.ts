import Drawer from "../build/index.js";
import * as path from "path-browserify";
// @ts-ignore
import {
   mdiFolder,
   mdiFolderOpen,
   mdiChevronDown,
   mdiLanguageHtml5,
   mdiFile,
} from "https://esm.sh/@mdi/js?exports=mdiFolder,mdiFolderOpen,mdiChevronDown,mdiLanguageHtml5,mdiFile";
console.log(mdiFolder, mdiFolderOpen);

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
   folderIconChevron: createIcon(mdiChevronDown, 24, "#d2d3d7"),
   fileIcon: (source) => {
      let ext = path.extname(source);
      console.log(source);

      if (ext == ".html") {
         return createIcon(mdiLanguageHtml5, 24, "#dd7933");
      } else {
         return createIcon(mdiFile, 24, "#d2d3d7");
      }
   },
   editFolderNameOnDoubleClick: false,
});

console.log(drawer);

drawer.onFileClick((e) => {
   console.log("File clicked:", e.file.source);
});

drawer.onFolderClick((e) => {
   console.log("Folder clicked:", e.folder.source);
});

drawer.onFileRightClick((e) => {
   console.log("File right clicked:", e.file.source);
});

drawer.onFolderRightClick((e) => {
   console.log("Folder right clicked:", e.folder.source);
});

drawer.onDidChangeFileName((e) => {
   console.log("File name changed:", e);

   if (/\//g.test(e.newName)) {
      e.file.rename(e.oldName);
   }
});

drawer.onDidChangeFolderName((e) => {
   console.log("Folder name changed:", e);
});

// implicit folder
let folder1 = drawer.add("src/classes/comps");
drawer.add("src/classes/test");

// force as folder
let folder2 = drawer.add("src", "folder");

// implicit file
if (folder1.type == "folder") {
   let file1 = folder1.add("index.html");
   //let folder3 = drawer.root.add("src/classes", "folder");
   //console.log(folder1.get("/classes/comps"));
   console.log(folder1.get("/"));
}

// force as file
let file2 = folder2.add("index", "file");

if (folder1.type == "file") {
   folder1.parent;
}
