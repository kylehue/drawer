const DrawerElement = require("./drawer.element.js");
const fileIcon = require("file-icons-js").getClassWithColor;

const styles = {
	wrapper: ["drawer-file"],
	text: ["drawer-text"]
}

class DrawerFileElement extends DrawerElement {
	constructor(title, insertIcons) {
		super(title);

		this.elements.main = DrawerFileElement.createMain(this.title, insertIcons);
	}

	getMain() {
		return this.elements.main;
	}

	static createMain(title, insertIcons) {
		const wrapper = document.createElement("div");
		wrapper.classList.add(...styles.wrapper);

		function addTitle() {
			const textElement = DrawerElement.createText(title);

			wrapper.append(textElement);
		}

		function addIcon() {
			const iconElement = DrawerElement.createIcon();
			const iconClass = fileIcon(title);

			if (iconClass) {
				let iconClassArray = iconClass.split(" ");
				iconElement.classList.add(...iconClassArray);
				wrapper.append(iconElement);
			}
		}

		if (insertIcons) addIcon();
		if (title) {
			addTitle();
		}

		return wrapper;
	}
}

module.exports = DrawerFileElement;
