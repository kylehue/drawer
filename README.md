# drawer-js

### A front-end library for creating dynamic folder structures.

## Installation
**NPM**
```bash
npm i drawer-js
```
**CDN**
```bash
https://cdn.jsdelivr.net/npm/drawer-js@latest/dist/drawer.js
```
## Usage
```js
const drawer = new Drawer(options);
```

## Options
<table>  
<tr>  
<th>Name</th>
<th>Type</th>
<th>Default</th>
<th>Description</th>
</tr>
<tr>
<td><code>element</code></td>
<td><code>String</code> or <code>HTMLElement</code></td>
<td></td>
<td>Where to insert the drawer element.</td>
</tr>
<tr>
<td><code>autoSortFiles</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Automatically sort the files everytime the drawer changes.</td>
</tr>
<tr>
<td><code>autoSortDirectories</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Automatically sort the directories everytime the drawer changes.</td>
</tr>
<tr>
<td><code>highlight</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Highlight files on click.</td>
</tr>
<tr>
<td><code>animate</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Animate directories on collapse / expand.</td>
</tr>
<tr>
<td><code>autoRefresh</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Automatically refresh the drawer everytime it changes.</td>
</tr>
<tr>
<td><code>fileIcons</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Add file icons.</td>
</tr>
<tr>
<td><code>directoryIcons</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Add directory icons.</td>
</tr>
<tr>
<td><code>warnings</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Show console messages whenever there's an error.</td>
</tr>
<tr>
<td><code>draggableFiles</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Enable drag & drop for files.</td>
</tr>
<tr>
<td><code>draggableDirectories</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Enable drag & drop for directories.</td>
</tr>
<tr>
<td><code>renameFileOnDoubleClick</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Rename file on double click.</td>
</tr>
<tr>
<td><code>renameDirectoryOnDoubleClick</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Rename directory on double click.</td>
</tr>
<tr>
<td><code>directoryButton</code></td>
<td><code>Object</code></td>
<td><code>true</code></td>
<td>Flags for directory buttons' visibility. <a href="#button-flags">Click here for more info.</td>
</tr>
<tr>
<td><code>fileButton</code></td>
<td><code>Object</code></td>
<td><code>true</code></td>
<td>Flags for file buttons' visibility. <a href="#button-flags">Click here for more info.</a></td>
</tr>
</table>

## Button Flags
You can show/hide the built-in buttons on files and directories by modifying the flags.
> IMPORTANT NOTE: These buttons doesn't do anything. However, you can add functions on them by using the [event emitters](#events-for-the-built-in-buttons).
### Directory Button Flags
<table>  
<tr>  
<th>Name</th>
<th>Type</th>
<th>Default</th>
<th>Description</th>
</tr>
<tr>
<td><code>addDirectory</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Show the button for adding directories.</td>
</tr>
<tr>
<td><code>addFile</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Show the button for adding files.</td>
</tr>
<tr>
<td><code>rename</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Show the button for renaming the directory.</td>
</tr>
<tr>
<td><code>cut</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Show the button for cutting the directory.</td>
</tr>
<tr>
<td><code>copy</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Show the button for copying the directory.</td>
</tr>
<tr>
<td><code>paste</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Show the button for pasting the directory.</td>
</tr>
<tr>
<td><code>remove</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Show the button for removing the directory.</td>
</tr>
</table>

### File Button Flags
<table>  
<tr>  
<th>Name</th>
<th>Type</th>
<th>Default</th>
<th>Description</th>
</tr>
<td><code>rename</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Show the button for renaming the file.</td>
</tr>
<tr>
<td><code>cut</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Show the button for cutting the file.</td>
</tr>
<tr>
<td><code>copy</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Show the button for copying the file.</td>
</tr>
<tr>
<td><code>remove</code></td>
<td><code>Boolean</code></td>
<td><code>true</code></td>
<td>Show the button for removing the file.</td>
</tr>
</table>

## Basic Usage
**Creating directories**
```js
const drawer = new Drawer({
	element: "#myDrawer"
});

// Create a directory
let scripts = drawer.addDirectory("scripts");

// Create a sub directory
let classes = scripts.addDirectory("classes");
```
**Creating Files**
```js
const drawer = new Drawer({
	element: "#myDrawer"
});

drawer.addFile("index.html");
```
**Using import**
```js
const drawer = new Drawer({
	element: "#myDrawer"
});

drawer.import({
	directories: [
		title: "scripts",
		directories: [
			{ title: "classes" }
		],
		files: [
			{ title: "main.js" }
		]
	],
	files: [
		{ title: "index.html" }
	]
});
```
## Events
<table>  
<tr>  
<th>Name</th>
<th>Parameters</th>
<th>Description</th>
</tr>
<tr>
<td><code>add</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object&lt;File/Directory&gt;</code></td>
<td>The item that was added.</td>
</tr>
</table>
</td>
<td>Fires everytime an item is added in a directory.</td>
</tr>
<tr>
<td><code>remove</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object&lt;File/Directory&gt;</code></td>
<td>The item that was removed.</td>
</tr>
</table>
</td>
<td>Fires everytime an item is removed.</td>
</tr>
<tr>
<td><code>move</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object&lt;File/Directory&gt;</code></td>
<td>The item that was moved.</td>
</tr>
</table>
</td>
<td>Fires everytime an item is moved.</td>
</tr>
<tr>
<td><code>rename</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object&lt;File/Directory&gt;</code></td>
<td>The item that was renamed.</td>
</tr>
</table>
</td>
<td>Fires everytime an item is renamed.</td>
</tr>
<tr>
<td><code>change</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>String</code></td>
<td>The type of change. i.e <code>move</code>, <code>rename</code>, etc.</td>
</tr>
<tr>
<td>2.</td>
<td><code>Object&lt;File/Directory&gt;</code></td>
<td>The item that changed.</td>
</tr>
</table>
</td>
<td>Fires everytime an item changes.</td>
</tr>
</table>

## Events for the built-in buttons
### Directory Buttons
<table>  
<tr>  
<th>Name</th>
<th>Parameters</th>
<th>Description</th>
</tr>
<tr>
<td><code>addDirectoryClick</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object</code></td>
<td>The directory that was clicked.</td>
</tr>
<tr>
<td>2.</td>
<td><code>MouseEvent</code></td>
<td>The Mouse Event.</td>
</tr>
</table>
</td>
<td>Fires everytime the add directory button clicked.</td>
</tr>
<tr>
<td><code>addFileClick</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object</code></td>
<td>The directory that was clicked.</td>
</tr>
<tr>
<td>2.</td>
<td><code>MouseEvent</code></td>
<td>The Mouse Event.</td>
</tr>
</table>
</td>
<td>Fires everytime the add file button is clicked.</td>
</tr>
<tr>
<td><code>renameClick</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object</code></td>
<td>The directory that was clicked.</td>
</tr>
<tr>
<td>2.</td>
<td><code>MouseEvent</code></td>
<td>The Mouse Event.</td>
</tr>
</table>
</td>
<td>Fires everytime the rename button is clicked.</td>
</tr>
<tr>
<td><code>copyClick</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object</code></td>
<td>The directory that was clicked.</td>
</tr>
<tr>
<td>2.</td>
<td><code>MouseEvent</code></td>
<td>The Mouse Event.</td>
</tr>
</table>
</td>
<td>Fires everytime the copy button is clicked.</td>
</tr>
<tr>
<td><code>cutClick</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object</code></td>
<td>The directory that was clicked.</td>
</tr>
<tr>
<td>2.</td>
<td><code>MouseEvent</code></td>
<td>The Mouse Event.</td>
</tr>
</table>
</td>
<td>Fires everytime the cut button is clicked.</td>
</tr>
<tr>
<td><code>pasteClick</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object</code></td>
<td>The directory that was clicked.</td>
</tr>
<tr>
<td>2.</td>
<td><code>MouseEvent</code></td>
<td>The Mouse Event.</td>
</tr>
</table>
</td>
<td>Fires everytime the paste button is clicked.</td>
</tr>
<tr>
<td><code>removeClick</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object</code></td>
<td>The directory that was clicked.</td>
</tr>
<tr>
<td>2.</td>
<td><code>MouseEvent</code></td>
<td>The Mouse Event.</td>
</tr>
</table>
</td>
<td>Fires everytime the remove button is clicked.</td>
</tr>
</table>

### File Buttons
<table>  
<tr>  
<th>Name</th>
<th>Parameters</th>
<th>Description</th>
</tr>
<tr>
<td><code>renameClick</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object</code></td>
<td>The file that was clicked.</td>
</tr>
<tr>
<td>2.</td>
<td><code>MouseEvent</code></td>
<td>The Mouse Event.</td>
</tr>
</table>
</td>
<td>Fires everytime the rename button is clicked.</td>
</tr>
<tr>
<td><code>copyClick</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object</code></td>
<td>The file that was clicked.</td>
</tr>
<tr>
<td>2.</td>
<td><code>MouseEvent</code></td>
<td>The Mouse Event.</td>
</tr>
</table>
</td>
<td>Fires everytime the copy button is clicked.</td>
</tr>
<tr>
<td><code>cutClick</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object</code></td>
<td>The file that was clicked.</td>
</tr>
<tr>
<td>2.</td>
<td><code>MouseEvent</code></td>
<td>The Mouse Event.</td>
</tr>
</table>
</td>
<td>Fires everytime the cut button is clicked.</td>
</tr>
<tr>
<td><code>removeClick</code></td>
<td>
<table>
<tr>  
<th>#</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>Object</code></td>
<td>The file that was clicked.</td>
</tr>
<tr>
<td>2.</td>
<td><code>MouseEvent</code></td>
<td>The Mouse Event.</td>
</tr>
</table>
</td>
<td>Fires everytime the remove button is clicked.</td>
</tr>
</table>

## Events Basic Usage
```js
const drawer = new Drawer({
	element: "#myElement"
});

// Listen
drawer.on("change", (type, item) => {
	// Do something...
});

// Listen to custom events
drawer.on("custom", (arg1, arg2) => {
	console.log(arg1); // 123
	console.log(arg2); // "abc"
});

// Trigger events
drawer.emit("custom", 123, "abc");
```
