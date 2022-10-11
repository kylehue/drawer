import DrawerContent from "./drawer.content";
import DrawerFile from "./drawer.content.file";
import DrawerDirectoryElement from "./drawer.element.directory";
import {
	resolve as resolvePath,
	basename as getBasename,
	dirname as getDirname,
	sep as pathSeperator
} from "path";
import lodashGet from "lodash.get";

import { toObjectPath } from "./utils";


class DrawerDirectory extends DrawerContent {
	constructor(title, options = {}) {
		super(title);
		this.options = options;
		this.type = "directory";

		this.items = {
			directories: [],
			files: []
		};

		this.element = new DrawerDirectoryElement(this);

		let element = this.element.getHead();
		element.addEventListener("click", (event) => {
			this.emit("click", event);
		});
	}

	scanContent(callback) {
		if (this.type == "directory") {
			function scan(directory, callback) {
				let directories = directory.items.directories;
				for (var i = 0; i < directories.length; i++) {
					let subDirectory = directories[i];
					let subDirectoryFiles = subDirectory.items.files;
					callback(subDirectory, subDirectoryFiles);
					scan(subDirectory, callback);
				}
			}

			scan(this, callback);
		}
	}

	getItemFromPath(type, pathStr) {
		if (type != "file" && type != "directory") {
			throw new Error("Item type must either be 'file' or 'directory'.");
		}

		let path = resolvePath(pathStr);
		let pathArray = path.substr(1, pathStr.length).split(pathSeperator);
		let title = getBasename(path);
		let result = null;

		function deepscan(directories, scanLevel) {
			scanLevel = scanLevel || 0;
			// Scan directories
			for (let directory of directories) {

				// Does the current directory in the path array exist?
				if (directory.title == pathArray[scanLevel]) {
					if (type == "file") {
						for (let file of directory.items.files) {
							// Does the target basename match the current directory's title?
							if (file.title == title) {
								result = file;
								return;
							}
						}
					} else {
						if (directory.title == title) {
							result = directory;
							return;
						}
					}

					deepscan(directory.items.directories, scanLevel + 1);
				}
			}
		}

		deepscan(this.items.directories);

		return result;
	}

	getDirectoryFromPath(pathStr) {
		let result = this.getItemFromPath("directory", pathStr);

		return result;
	}

	getFileFromPath(pathStr) {
		let result = this.getItemFromPath("file", pathStr);

		return result;
	}

	addItemFromPath(type, pathStr) {
		if (type != "file" && type != "directory") {
			throw new Error("Item type must either be 'file' or 'directory'.");
		}

		let newItem;

		let path = resolvePath(pathStr);
		let pathArray = path.substr(1, pathStr.length).split(pathSeperator);
		let targetTitle = getBasename(path);

		function add(itemTitle, directory) {
			let item;
			if (type == "file" && itemTitle == targetTitle) {
				item = directory.addFile(itemTitle);
			} else {
				item = directory.addDirectory(itemTitle);
			}

			return item;
		}

		for (var i = 0; i < pathArray.length; i++) {
			let currentPath = pathArray.slice(0, i + 1).join(pathSeperator);
			let directoryExists = !!this.getDirectoryFromPath(currentPath);
			if (!directoryExists) {
				let parentPath = getDirname(currentPath);
				let parentDirectory = this.getDirectoryFromPath(parentPath);
				let currentPathTitle = getBasename(currentPath);

				if (parentDirectory) {
					newItem = add(currentPathTitle, parentDirectory);
				} else {
					// If parent doesn't exist, just add to the main
					newItem = add(currentPathTitle, this);
				}
			}
		}

		return newItem;
	}

	addDirectoryFromPath(pathStr) {
		let newDirectory = this.addItemFromPath("directory", pathStr);

		return newDirectory;
	}

	addFileFromPath(pathStr) {
		let newFile = this.addItemFromPath("file", pathStr);

		return newFile;
	}

	clear() {
		let body = this.element.getBody();

		this.items.directories = [];
		this.items.files = [];

		//Clear elements in DOM
		while (body.firstChild) {
			body.removeChild(body.lastChild);
		}
	}

	sort(type) {
		let elements = [];
		let parent = this.parent.element.getMain();

		//Get elements in parent
		elements = Array.from(parent.querySelectorAll(`.drawer-${type}`));

		//Sort
		const sortedElements = elements.sort((a, b) => b.innerText.localeCompare(a.innerText));

		if (type == "directory") {
			sortedElements.forEach(e => e.parentElement.prepend(e));
		} else {
			sortedElements.forEach(e => e.parentElement.append(e));
		}
	}

	sortDirectories() {
		this.sort("directory");
	}

	sortFiles() {
		this.sort("file");
	}

	refreshFiles() {
		for (let i = 0; i < this.items.files.length; i++) {
			let file = this.items.files[i];
			file.refresh();
		}

		if (this.options.autoSortFiles) {
			this.sortFiles();
		}
	}

	refresh() {
		this.appendToParent();

		this.level = this.parent.level + 1;
		if (this.options.autoSortDirectories) {
			this.sortDirectories();
		}

		// Indent
		this.element.getHead().style.paddingLeft = (this.level * 1.5 - 0.5) + "em";
		this.refreshFiles();
	}

	addDirectory(title) {
		let directory = new DrawerDirectory(title, this.options);
		directory.setParent(this);

		this.items.directories.push(directory);

		if (this.options.autoRefresh) {
			directory.refresh();
		}

		this.emit("addDirectory", directory);
		this.ascendantsEmit("addDirectory", directory);

		return directory;
	}

	addFile(title) {
		let file = new DrawerFile(title, this.options);
		file.setParent(this);

		this.items.files.push(file);

		file.refresh();

		this.emit("addFile", file);
		this.ascendantsEmit("addFile", file);

		return file;
	}

	serialize(options = {}) {
		options = Object.assign({
			fileContent: false,
			childrenOnly: false
		}, options);

		let treeData;

		function deepscan(items, parentNode) {
			// Scan files
			for (let file of items.files) {
				let fileData = {
					title: file.title
				};

				// Include file's content?
				if (options.fileContent) {
					fileData.content = file.content;
				}

				// Instantiate array if it doesn't exist
				if (!parentNode.files) {
					parentNode.files = [];
				}

				parentNode.files.push(fileData);
			}

			// Scan directories
			for (let directory of items.directories) {
				let directoryData = {
					title: directory.title
				};

				// Instantiate array if it doesn't exist
				if (!parentNode.directories) {
					parentNode.directories = [];
				}

				parentNode.directories.push(directoryData);

				// Continue scanning if either directories or files has an item in it
				if (directory.items.directories.length != 0 || directory.items.files.length != 0) {
					deepscan(directory.items, directoryData);
				}
			}
		}

		if (this.options.drawer === this || !options.childrenOnly) {
			treeData = {};
			deepscan(this.items, treeData);
		} else {
			treeData = {
				directories: [{
					title: this.title
				}]
			};

			deepscan(this.items, treeData.directories[0]);
		}


		let serial = JSON.stringify(treeData);
		return serial;
	}

	import(serial, merge = false) {
		let treeData;
		if (typeof serial == "string") {
			try {
				treeData = JSON.parse(serial);
			} catch (e) {
				throw new Error("Import must be a proper JSON string or object.");
			}
		} else {
			treeData = serial;
		}

		// Clear tree
		if (!merge) this.clear();

		function deepscan(data, parentDirectory) {
			if (data.files) {
				// Scan files
				for (let file of data.files) {
					parentDirectory.addFile(file.title);
				}
			}

			if (data.directories) {
				// Scan directories
				for (let directory of data.directories) {
					let newDir = parentDirectory.addDirectory(directory.title);

					// Continue scanning if either directories or files has an item in it
					if (directory.directories != undefined || directory.files != undefined) {
						deepscan(directory, newDir);
					}
				}
			}
		}

		deepscan(treeData, this);
	}
}

export default DrawerDirectory;
