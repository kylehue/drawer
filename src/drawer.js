import DrawerDirectory from "./drawer.content.directory";
import DrawerDirectoryElement from "./drawer.element.directory";
/**
 * TODO:
 * [/] serialize/import
 * [/] method for clearing a directory
 * [/] method for adding dirs/files from path string
 * [/] animations
 * [x] optional context menu
 */
function getElement(element) {
	if (typeof element == "string") {
		return document.querySelector(element);
	} else {
		return element;
	}
}

class Drawer extends DrawerDirectory {
	constructor(options = {}) {
		super("drawer", options);
		console.clear();

		this.options = Object.assign({
			element: null,
			autoSortFiles: false,
			autoSortDirectories: false,
			highlight: true,
			animate: true,
			autoRefresh: true,
			fileIcons: true,
			directoryIcons: true,
			drawer: this
		}, options);

		this.element = new DrawerDirectoryElement(this);

		getElement(this.options.element).append(this.element.getMain())
	}

	serialize(options = {}) {
		let treeData = {};

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

		deepscan(this.items, treeData);

		let serial = JSON.stringify(treeData);
		return serial;
	}

	import(serial) {
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
		this.clear();

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

		console.log(treeData);
	}
}

export default Drawer;
