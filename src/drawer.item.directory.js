import DrawerItem from "./drawer.item";
import DrawerFile from "./drawer.item.file";
import DrawerDirectoryElement from "./drawer.element.directory";
import {
	resolve as resolvePath,
	basename as getBasename,
	dirname as getDirname,
	join as joinPath,
	sep as pathSeperator
} from "path";

import {
	toObjectPath,
	getRoot,
	getPath
} from "./utils";


class DrawerDirectory extends DrawerItem {
	constructor(parent, title) {
		super(parent, title);
		this.type = "directory";
		this.path = getPath(this);
		this.root = getRoot(this);
		this.isRoot = this.root === this;

		this.items = {
			directories: [],
			files: []
		};

		if (!this.isRoot) {
			this.element = new DrawerDirectoryElement(this);

			let element = this.element.getHead();
			element.addEventListener("click", (event) => {
				this.emit("click", event);
			});
		}
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

		let result = null;
		let path = joinPath(this.path, pathStr);
		let pathArray = path.substr(1).split(pathSeperator);
		let targetTitle = getBasename(path);

		// If type is file, remove file name from path
		if (type == "file") {
			pathArray.pop();
		}

		// If path array is empty, it means that we're looking for a file in the root directory.
		// So in that case, we don't need to deepscan this directory's directories.
		if (pathArray.length == 0) {
			for (let file of this.items.files) {
				if (file.title == targetTitle) {
					result = file;
				}
			}
		} else {
			function deepscan(directories, scanLevel) {
				scanLevel = scanLevel || 0;
				for (let directory of directories) {
					let currentBasename = pathArray[scanLevel];
					if (directory.title == currentBasename) {
						if (type == "file") {
							for (let file of directory.items.files) {
								if (file.title == targetTitle) {
									result = file;
									return;
								}
							}
						} else {
							if (directory.title == targetTitle) {
								result = directory;
								return;
							}
						}

						deepscan(directory.items.directories, scanLevel + 1);
						break;
					}
				}
			}

			deepscan(this.root.items.directories);
		}

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

	getItem(type, compare) {
		let searchArray = type == "file" ? this.items.files : this.items.directories;
		let result = null;
		for (let item of searchArray) {
			if (typeof compare == "string") {
				if (item.title == compare) {
					result = item;
					break;
				}
			} else {
				if (item === compare) {
					result = item;
					break;
				}
			}
		}

		return result;
	}

	addItemFromPath(type, pathStr) {
		if (type != "file" && type != "directory") {
			throw new Error("Item type must either be 'file' or 'directory'.");
		}

		let path = resolvePath(joinPath(this.path, pathStr));
		let targetTitle = getBasename(path);
		let parentPath = getDirname(path);
		let pathArray = path.substr(1).split(pathSeperator);
		pathArray.pop();

		function addItem(directory) {
			if (type == "file") {
				return directory.addFile(targetTitle);
			} else {
				return directory.addDirectory(targetTitle);
			}
		}

		let newItem;

		if (pathArray.length == 0) {
			newItem = addItem(this.root);
		} else {
			let directory = this.root;
			for (let currentBasename of pathArray) {
				let base = directory.getItem("directory", currentBasename);
				if (!base) {
					base = directory.addDirectory(currentBasename);
				}

				directory = base;

				if (directory.path == parentPath) {
					newItem = addItem(base);
					break;
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

	remove() {
		if (!this.isRoot) {
			let parentDirectories = this.parent.items.directories;

			// Remove from parent's array
			for (var i = 0; i < parentDirectories.length; i++) {
				let parentDir = parentDirectories[i];
				if (parentDir === this) {
					parentDirectories.splice(i, 1);
					break;
				}
			}

			// Remove from DOM
			this.element.getMain().remove();
		} else {
			if (this.root.options.warnings) {
				console.warn("Cannot remove root directory. Using clear() instead.");
				this.clear();
			}
		}

		this.emit("removeDirectory", this);
		this.ascendantsEmit("removeDirectory", this);
		this.emit("change", "removeDirectory");
		this.ascendantsEmit("change", "removeDirectory");
	}

	sort(type) {
		let elements = [];

		let parent;
		if (!this.isRoot) {
			parent = this.parent.element.getMain();
		} else {
			parent = this.element.getMain();
		}

		//Get elements in parent
		elements = Array.from(parent.querySelectorAll(`.drawer-${type}`));

		//Sort
		const sortedElements = elements.sort((a, b) => b.innerText.localeCompare(a.innerText));

		sortedElements.forEach(e => e.parentElement.prepend(e));
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

		if (this.root.options.autoSortFiles) {
			this.sortFiles();
		}
	}

	refresh() {
		this.appendToParent();

		let head = this.element.getHead();

		// Reset title
		if (this.title != head.textContent) {
			let textElement = head.querySelector(".drawer-text");
			textElement.textContent = this.title;
		}

		// Reset level
		if (!this.isRoot) {
			this.level = this.parent.level + 1;
		}

		// Reset path
		this.path = getPath(this);

		if (this.root.options.autoSortDirectories) {
			this.sortDirectories();
		}

		// Indent
		head.style.paddingLeft = (this.level * 1.5 - 0.5) + "em";
		this.refreshFiles();
	}

	removeDirectoryFromPath(pathStr) {
		let directory = this.getDirectoryFromPath(pathStr);
		let directoryExists = !!directory;
		if (directoryExists) {
			directory.remove();
		}
	}

	removeFileFromPath(pathStr) {
		let file = this.getFileFromPath(pathStr);
		let fileExists = !!file;
		if (fileExists) {
			file.remove();
		}
	}

	removeDirectory(title) {
		for (let directory of this.items.directories) {
			if (directory.title == title) {
				directory.remove();
				break;
			}
		}
	}

	removeFile(title) {
		for (let file of this.items.files) {
			if (file.title == title) {
				file.remove();
				break;
			}
		}
	}

	has(type, compare) {
		return !!this.getItem(type, compare);
	}

	addDirectory(title) {
		if (this.has("directory", title)) {
			if (this.root.options.warnings) {
				console.warn(`Directory '${title}' from path '${this.path}' already exists.`);
			}

			return null;
		}

		let directory = new DrawerDirectory(this, title);

		this.items.directories.push(directory);

		if (this.root.options.autoRefresh) {
			directory.refresh();
		}

		this.emit("addDirectory", directory);
		this.ascendantsEmit("addDirectory", directory);
		this.emit("change", "addDirectory");
		this.ascendantsEmit("change", "addDirectory");

		return directory;
	}

	addFile(title) {
		if (this.has("file", title)) {
			if (this.root.options.warnings) {
				console.warn(`File '${title}' from path '${this.path}' already exists.`);
			}
			return null;
		}

		let file = new DrawerFile(this, title);

		this.items.files.push(file);

		file.refresh();

		this.emit("addFile", file);
		this.ascendantsEmit("addFile", file);
		this.emit("change", "addFile");
		this.ascendantsEmit("change", "addFile");

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

		if (this.isRoot || !options.childrenOnly) {
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
