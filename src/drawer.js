import DrawerDirectory from "./drawer.content.directory";

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
			highlight: false,
			autoRefresh: false,
			insertFileIcons: false
		}, options);

		this.element = getElement(this.options.element);
	}

	toJSON() {

	}

	fromJSON() {

	}
}

export default Drawer;
