const DrawerDirectory = require("./drawer.content.directory.js");

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
			autoRefresh: false
		}, options);

		this.element = getElement(this.options.element);
		this.main = this;
	}

	toJSON() {

	}

	fromJSON() {

	}
}

module.exports = Drawer;
