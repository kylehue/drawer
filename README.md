# Drawer

> Drawer is a front-end library for creating dynamic file explorers.

![Sample Drawer](https://raw.githubusercontent.com/kylehue/drawer/main/public/sample.jpg)

### Install
**NPM:**
```bash
npm install @kylehue/drawer
```
**CDN:**
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@kylehue/drawer/build/styles/style.css">
<!-- JS -->
<script src="https://cdn.jsdelivr.net/npm/@kylehue/drawer/browser/Drawer.js"></script>
```

### Usage
```ts
import { Drawer } from "@kylehue/drawer";

const drawer = new Drawer({
   /* ...options */
});

const root = drawer.initRoot(document.querySelector("#drawer"));

// Adding items
root.add("src/classes/comps/sample.txt");

// Deleting items
root.delete("/src/classes/comps");

// Moving items
root.get("src/classes")?.move("/");

// Listen on item add
drawer.onDidAddItem((desc) => {
   console.log(desc.item.source + " has been added!");
});

// Listen on error
drawer.onError((error) => {
   console.error(error.reason);
});
```

### Styling
Here are some of the styles that can be customized.

| Class name                    | Description                           |
| ----------------------------- | ------------------------------------- |
| `.drawer-folder`              | Container of folder item              |
| `.drawer-folder-head`         | Folder header container               |
| `.drawer-folder-icon`         | Folder icon                           |
| `.drawer-folder-icon-chevron` | Folder arrow icon                     |
| `.drawer-file`                | Container of file item                |
| `.drawer-file-icon`           | File icon                             |
| `.drawer-indent-guide`        | Vertical lines beside the folder tree |
| `.drawer-drop-target`         | Current location of item on drag      |
| `.drawer-drag-label`          | The item that is being dragged        |
| `.drawer-item-focused`        | Selected item                         |