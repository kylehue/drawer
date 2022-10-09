import DrawerDirectory from "./drawer.content.directory";
import DrawerDirectoryElement from "./drawer.element.directory";
/**
 * TODO:
 * [x] toJSON/fromJSON
 * [/] method for clearing a directory
 * [x] method for adding dirs/files from path string
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

	toJSON(options = {}) {
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

		let treeJSON = JSON.stringify(treeData);
		return treeJSON;
	}

	fromJSON() {

	}
}

export default Drawer;
