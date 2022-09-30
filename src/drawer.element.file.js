const DrawerElement = require("./drawer.element.js");

const styles = {
	wrapper: ["drawer-file"],
	text: ["drawer-text"]
}

class DrawerFileElement extends DrawerElement {
	constructor(title) {
		super(title);

		this.elements.main = DrawerFileElement.createMain(this.title);
	}

	getMain() {
		return this.elements.main;
	}

	static createMain(title) {
		const wrapper = document.createElement("div");
		wrapper.classList.add(...styles.wrapper);

		function addTitle() {
			const textElement = DrawerElement.createText(title);

			wrapper.append(textElement);
		}

		if (title) {
			addTitle();
		}

		return wrapper;
	}
}

module.exports = DrawerFileElement;
