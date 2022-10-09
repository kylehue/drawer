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

	toJSON() {

	}

	fromJSON() {

	}
}

export default Drawer;
