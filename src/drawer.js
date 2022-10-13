import DrawerDirectory from "./drawer.item.directory";
import DrawerDirectoryElement from "./drawer.element.directory";
import {sep as pathSeperator} from "path";
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
		let parent = null;
		let title = "";
		super(parent, title);
		console.clear();

		this.options = Object.assign({
			element: undefined,
			autoSortFiles: false,
			autoSortDirectories: false,
			highlight: true,
			animate: true,
			autoRefresh: true,
			fileIcons: true,
			directoryIcons: true,
			warnings: true
		}, options);

		this.element = new DrawerDirectoryElement(this);

		getElement(this.options.element).append(this.element.getMain())
	}
}

export default Drawer;
