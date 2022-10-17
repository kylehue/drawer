# Drawer

### 📂 A front-end library for creating dynamic folder structures.

### Table of Contents:
- [Installation & Usage](#installation)
- [Options](#options)
- [Basic Examples](#basic-examples)
- [Drawer Methods](#directory-methods)
-- [`appendTo`](#appendtoelement)
-- [`getDirectoryById`](#getdirectorybyidid)
- [Directory Methods](#directory-methods)
-- [`addFile`](#addfiletitle)
-- [`addFileFromPath`](#addfilefrompathpath)
-- [`addDirectory`](#adddirectorytitle)
-- [`addDirectoryFromPath`](#adddirectoryfrompathpath)
-- [`removeFile`](#removefiletitle)
-- [`removeFileFromPath`](#removefilefrompathpath)
-- [`removeDirectory`](#removedirectorytitle)
-- [`removeDirectoryFromPath`](#removedirectoryfrompathpath)
-- [`getItem`](#getitemtype-title)
-- [`has`](#hastype-title)
-- [`getFileFromPath`](#getfilefrompathpath)
-- [`getDirectoryFromPath`](#getdirectoryfrompathpath)
-- [`moveToDirectory`](#movetodirectorydirectory)
-- [`moveToPath`](#movetopathpath)
-- [`rename`](#renametitle)
-- [`remove`](#remove)
-- [`refresh`](#refresh)
-- [`clear`](#clear)
-- [`sortFiles`](#sortfiles)
-- [`sortDirectories`](#sortdirectories)
-- [`import`](#importobject-options)
-- [`serialize`](#serializeoptions)
- [File Methods](#file-methods)
-- [`updateContent`](#updatecontentname-value)
-- [`removeContent`](#removecontentname)
-- [`getContent`](#getcontentname)
-- [`moveToDirectory`](#movetodirectorydirectory)
-- [`moveToPath`](#movetopathpath)
-- [`rename`](#renametitle)
-- [`remove`](#remove)
- [Events](#events)
## Installation
**NPM**
```bash
npm i @kylehue/drawer
```
**CDN**
```bash
https://cdn.jsdelivr.net/npm/@kylehue/drawer@latest/dist/drawer.js
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
> IMPORTANT NOTE: These buttons doesn't do anything. However, you can add functions to them by using the [event emitters](#events-for-the-built-in-buttons).
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

## Basic Examples
```js
const drawer = new Drawer({
	element: "#myDrawer"
});

// Create a directory
let scripts = drawer.addDirectory("scripts");

// Create a sub directory
let classes = scripts.addDirectory("classes");

// Create files
drawer.addFile("index.html");
classes.addFile("Person.js");

// Create directories from path
classes.addDirectoryFromPath("../myScript.js");

// Create files from path
drawer.addFileFromPath("scripts/classes/Book.js");
drawer.addFileFromPath("scripts/newDir 1/newDir 2/Test.js");
```
## Drawer Methods
### `appendTo(element)`
Appends the drawer element inside the chosen DOM element. This is an alternative for [`options.element`](#options).

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>element</code></td>
<td>
<code>String</code> or <code>HTMLElement</code>
</td>
<td>Where to append the drawer element.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

drawer.appendTo("#myElement");
```

### `getDirectoryById(id)`
Returns a directory with the specified unique id.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>id</code></td>
<td>
<code>String</code>
</td>
<td>The id of the directory.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

let scripts = drawer.addDirectory("my directory");
drawer.getDirectoryById(directory.id); // Returns scripts
```

## Directory Methods
> NOTE: Directory methods can also be used in `Drawer` instances.
### `addFile(title)`
Creates a file inside a directory.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>title</code></td>
<td>
<code>String</code>
</td>
<td>The title of the file.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

drawer.addFile("index.html");
```

### `addFileFromPath(path)`
Creates a file in the specified path.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>path</code></td>
<td>
<code>String</code>
</td>
<td>The destination for the new file.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

drawer.addFileFromPath("some/path/index.html");

// The code above is also the same as:
let some = drawer.addDirectory("some");
let path = some.addDirectory("path");
path.addFile("index.html");
```

### `addDirectory(title)`
Creates a directory inside a directory.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>title</code></td>
<td>
<code>String</code>
</td>
<td>The title of the directory.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

drawer.addDirectory("stuff");
```

### `addDirectoryFromPath(path)`
Creates a directory in the specified path.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>path</code></td>
<td>
<code>String</code>
</td>
<td>The destination for the new directory.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

drawer.addDirectoryFromPath("some/path/stuff");

// The code above is also the same as:
let some = drawer.addDirectory("some");
let path = some.addDirectory("path");
path.addDirectory("stuff");
```
### `removeFile(title)`
Deletes a file in a directory.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>title</code></td>
<td>
<code>String</code>
</td>
<td>The title of the file to be removed.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

// Delete a file named 'index.html'
drawer.removeFile("index.html");
```
### `removeFileFromPath(path)`
Deletes a file in the specified path.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>path</code></td>
<td>
<code>String</code>
</td>
<td>The path of the file to be removed.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

// Delete a file named 'index.html'
drawer.removeFileFromPath("some/path/index.html");

// The code above is also the same as:
drawer.getFileFromPath("some/path/index.html").remove();
```
### `removeDirectory(title)`
Deletes a directory in a directory.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>title</code></td>
<td>
<code>String</code>
</td>
<td>The title of the directory to be removed.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

// Delete a directory named 'stuff'
drawer.removeDirectory("stuff");
```
### `removeDirectoryFromPath(path)`
Deletes a directory in the specified path.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>path</code></td>
<td>
<code>String</code>
</td>
<td>The path of the directory to be removed.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

// Delete a directory named 'stuff'
drawer.removeDirectoryFromPath("some/path/stuff");

// The code above is also the same as:
drawer.getDirectoryFromPath("some/path/stuff").remove();
```
### `getItem(type, title)`
Get a directory or file inside a directory.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>type</code></td>
<td>
<code>String</code>
</td>
<td>The item type. This can only be either "file" or "directory".</td>
</tr>
<tr>
<td>2.</td>
<td><code>title</code></td>
<td>
<code>String</code>
</td>
<td>The title of the item.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

// Get a directory named 'stuff'
let stuff = drawer.getItem("directory", "stuff");
```
### `has(type, title)`
Check if an item exists.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>type</code></td>
<td>
<code>String</code>
</td>
<td>The item type. This can only be either "file" or "directory".</td>
</tr>
<tr>
<td>2.</td>
<td><code>title</code></td>
<td>
<code>String</code>
</td>
<td>The title of the item.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

drawer.has("file", "index.html");

// The code above is also the same as:
drawer.getItem("file", "index.html") != null;
```
### `getFileFromPath(path)`
Get a file from the specified path.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>path</code></td>
<td>
<code>String</code>
</td>
<td>The path of the file.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

drawer.getFileFromPath("some/path/index.html");
```
### `getDirectoryFromPath(path)`
Get a directory from the specified path.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>path</code></td>
<td>
<code>String</code>
</td>
<td>The path of the directory.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

drawer.getDirectoryFromPath("some/path/stuff");
```
### `moveToDirectory(directory)`
Moves a directory into another directory.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>directory</code></td>
<td>
<code>Object&lt;Directory&gt;</code>
</td>
<td>The target directory where the selected directory will be transferred to.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

let foo = drawer.addDirectory("foo");
let bar = drawer.addDirectory("bar");

let stuff = foo.addDirectory("stuff");

// Move 'stuff' directory from 'foo' to 'bar'
stuff.moveToDirectory(bar);
```
### `moveToPath(path)`
Moves a directory in the specified path.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>path</code></td>
<td>
<code>String</code>
</td>
<td>The target path where the selected directory will be transferred to.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

let stuff = drawer.addDirectory("stuff");

// Move 'stuff' from root to 'foo'
stuff.moveToPath("some/path/foo");
```
### `rename(title)`
Renames a directory.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>title</code></td>
<td>
<code>String</code>
</td>
<td>The new title for the directory.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

let foo = drawer.addDirectory("foo");

// Rename 'foo' directory to 'bar'
foo.rename("bar");
```
### `remove()`
Deletes the directory.


**Example**:

```js
const drawer = new Drawer();

let stuff = drawer.addDirectory("stuff");

// Delete 'stuff'
stuff.remove();
```
### `refresh()`
Updates everything in DOM and directory object whenever something changes.
> IMPORTANT NOTE: `refresh` is automatically called everytime something changes IF `options.autoRefresh` is set to `true`.

**Example**:

```js
myDirectory.refresh();
```
### `clear()`
Removes all files and directories inside a directory.

**Example**:

```js
myDirectory.clear();
```
### `sortFiles()`
Sorts all files inside a directory in the DOM.
>IMPORTANT NOTE: `sortFiles` is automatically called everytime something changes IF `options.autoRefreshFiles` is set to `true`.

**Example**:

```js
myDirectory.sortFiles();
```

### `sortDirectories()`
Sorts all sub directories in the DOM.
>IMPORTANT NOTE: `sortFiles` is automatically called everytime something changes IF `options.autoRefreshDirectories` is set to `true`.

**Example**:

```js
myDirectory.sortDirectories();
```
### `import(obj, options)`
Create a folder structure using an object.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>obj</code></td>
<td>
<code>Stringified JSON</code> or <code>Object</code>
</td>
<td>The object to be imported.</td>
</tr>
<tr>
<td>2.</td>
<td><code>options</code></td>
<td>
<code>Object</code>
</td>
<td>The <a href="#options-for-import">options</a> for importing.</td>
</tr>
</table>

**Example of `import` using `Object`**:

```js
const drawer = new Drawer();

drawer.import({
	directories: [
		{
			title: "scripts",
			directories: [
				{ title: "classes" }
			],
			files: [
				{ title: "main.js" }
			]
		}
	],
	files: [
		{ title: "index.html" }
	]
});
```
**Example of `import` using `Stringified JSON`**:

```js
const drawer = new Drawer();

let data = {
	directories: [
		{
			title: "scripts",
			directories: [
				{ title: "classes" }
			],
			files: [
				{ title: "main.js" }
			]
		}
	],
	files: [
		{ title: "index.html" }
	]
};

drawer.import(JSON.stringify(data));
```
**Example of `import` using `serialize` method**:

```js
const drawer = new Drawer();

let data = drawer.serialize();
drawer.import(data);
```
### Options for `import()`
<table>
<tr>
<th>Name</th>
<th>Type</th>
<th>Default</th>
<th>Description</th>
</tr>
<tr>
<td>merge</td>
<td><code>Boolean</code></td>
<td>
<code>false</code>
</td>
<td>Merge the import data items to current directory items.</td>
</tr>
</table>

### `serialize(options)`
Converts a directory into a stringified object.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>options</code></td>
<td>
<code>Object</code>
</td>
<td>The <a href="#options-for-serialize">options</a> for serializing a directory.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

drawer.serialize();
```
### Options for `serialize()`
<table>
<tr>
<th>Name</th>
<th>Type</th>
<th>Default</th>
<th>Description</th>
</tr>
<tr>
<td>fileContent</td>
<td><code>Boolean</code></td>
<td>
<code>false</code>
</td>
<td>Include the file's contents.</td>
</tr>
<tr>
<td>includeParent</td>
<td><code>Boolean</code></td>
<td>
<code>false</code>
</td>
<td>Include the parent.</td>
</tr>
</table>

## File Methods
### `updateContent(name, value)`
Updates a content in a file.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>name</code></td>
<td>
<code>String</code>
</td>
<td>The name of the content.</td>
</tr>
<tr>
<td>2.</td>
<td><code>value</code></td>
<td>
<code>Any</code>
</td>
<td>The value of the content.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

let index = drawer.addFile("index.html");
index.addContent("code", "<html>Hi!</html>");
index.addContent("dateCreated", Date.now());
```
### `removeContent(name)`
Deletes a content in a file.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>name</code></td>
<td>
<code>String</code>
</td>
<td>The name of the content to be deleted.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

let index = drawer.addFile("index.html");
index.addContent("code", "<html>Hi!</html>");

// Delete 'code'
index.removeContent("code");
```
### `getContent(name)`
Get a file content with the specified name.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>name</code></td>
<td>
<code>String</code>
</td>
<td>The name of the content.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

let index = drawer.addFile("index.html");
index.addContent("code", "<html>Hi!</html>");

// Get 'code' content
let indexCode = index.getContent("code");
```

### `moveToDirectory(directory)`
Moves a file into another directory.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>directory</code></td>
<td>
<code>Object&lt;Directory&gt;</code>
</td>
<td>The target directory where the selected file will be transferred to.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

let foo = drawer.addDirectory("foo");
let bar = drawer.addDirectory("bar");

let stuff = foo.addFile("stuff.js");

// Move 'stuff' file from 'foo' to 'bar'
stuff.moveToDirectory(bar);
```
### `moveToPath(path)`
Moves a file in the specified path.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>path</code></td>
<td>
<code>String</code>
</td>
<td>The target path where the selected file will be transferred to.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

let stuff = drawer.addFile("stuff.js");

// Move 'stuff' from root to 'foo'
stuff.moveToPath("some/path/foo");
```
### `rename(title)`
Renames a file.

**Arguments**:
<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>1.</td>
<td><code>title</code></td>
<td>
<code>String</code>
</td>
<td>The new title for the file.</td>
</tr>
</table>

**Example**:

```js
const drawer = new Drawer();

let foo = drawer.addFile("foo.js");

// Rename 'foo.js' file to 'bar.js'
foo.rename("bar.js");
```
### `remove()`
Deletes a file.


**Example**:

```js
const drawer = new Drawer();

let stuff = drawer.addFile("stuff.js");

// Delete 'stuff.js'
stuff.remove();
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
Each file and directory has built-in buttons on them. However, they are just buttons with no functions and such. You can add functions to them by listening to these events. All of these events are fired when those buttons are clicked.
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
