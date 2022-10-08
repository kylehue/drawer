import DrawerDirectory from "./drawer.content.directory";

/**
 * TODO:
 * 1. toJSON/fromJSON
 * 2. method for clearing a directory
 * 3. method for adding dirs/files from path string
 * 4. animations
 * 5. optional context menu
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
			autoRefresh: true,
			fileIcons: true,
			directoryIcons: true,
			drawer: this
		}, options);

		this.element = getElement(this.options.element);
	}

	toJSON() {

	}

	fromJSON() {

	}
}

export default Drawer;
