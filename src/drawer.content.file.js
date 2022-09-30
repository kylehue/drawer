const DrawerContent = require("./drawer.content.js");
const DrawerFileElement = require("./drawer.element.file.js");

class DrawerFile extends DrawerContent {
	constructor(title) {
		super(title);
		this.content = {};

		this.element = new DrawerFileElement(this.title);
	}
 
	refresh() {
		this.appendToParent();
	}

	addContent(name, value) {
		this.content[name] = value;
		return this;
	}
}

module.exports = DrawerFile;
