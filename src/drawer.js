import DrawerDirectory from "./drawer.item.directory";
import DrawerDirectoryElement from "./drawer.element.directory";
import {sep as pathSeperator} from "path";
/**
 * TODO:
 * [x] optional context menu
 * [x] drag and drop
 * [x] fix animation
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

		let mainElement = this.element.getMain();
		let bodyElement = this.element.getBody();
		getElement(this.options.element).append(mainElement);

		mainElement.style.height = "100%";
		bodyElement.style.height = "100%";
	}

	getDirectoryById(id) {
		let result = null;
		this.scanItems((directory) => {
			if (directory.id === id) {
				result = directory;
				return;
			}
		});

		return result;
	}
}

export default Drawer;
