import DrawerElement from "./drawer.element";
import { getClassWithColor as fileIcon } from "file-icons-js";

const styles = {
	wrapper: ["drawer-file"],
	text: ["drawer-text"],
	highlight: ["drawer-highlight"]
}

class DrawerFileElement extends DrawerElement {
	constructor(title, options = {}) {
		super(title);

		this.elements.main = DrawerFileElement.createMain(this.title, options);
	}

	highlight() {
		this.getMain().classList.add(...styles.highlight);
	}

	removeHighlight() {
		this.getMain().classList.remove(...styles.highlight);
	}

	getMain() {
		return this.elements.main;
	}

	static createMain(title, options) {
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

		if (options.fileIcons) {
			addIcon();
		}

		if (title) {
			addTitle();
		}

		return wrapper;
	}
}

export default DrawerFileElement;
