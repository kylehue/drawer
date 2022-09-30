const scanObject = require("./treeview.scan-object.js");
const Directory = require("./treeview.directory.js");

function getElement(element) {
	if (typeof element == "string") {
		return document.querySelector(element);
	} else {
		return element;
	}
}

class TreeView extends Directory {
	constructor(options = {}) {
		super();
		console.clear();

		// Options
		this.options = Object.assign({
			element: null,
			autoSortFiles: false,
			autoSortDirectories: false,
			highlight: false,
			autoRefresh: false
		}, options);

		this.element = getElement(this.options.element);
	}

}

module.exports = TreeView;
