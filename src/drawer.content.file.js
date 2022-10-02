import DrawerContent from "./drawer.content";
import DrawerFileElement from "./drawer.element.file";

class DrawerFile extends DrawerContent {
	constructor(title, options = {}) {
		super(title);

		this.type = "file";

		this.content = {};
		this.element = new DrawerFileElement(this.title, options.insertFileIcons);
	}

	refresh() {
		this.appendToParent();
	}

	addContent(name, value) {
		this.content[name] = value;

		return this;
	}
}

export default DrawerFile;
