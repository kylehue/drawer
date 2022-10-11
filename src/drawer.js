import DrawerDirectory from "./drawer.content.directory";
import DrawerDirectoryElement from "./drawer.element.directory";
/**
 * TODO:
 * [x] optional context menu
 * [x] update dirs/files
 * [x] move dirs/files
 * [x] drag and drop
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
}

export default Drawer;
