import DrawerElement from "./drawer.element";
import { getClassWithColor as fileIcon } from "file-icons-js";
import { extname as getExtname } from "path";

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

			function addIcon() {
				let iconElement = DrawerElement.createIcon();
				let iconClass = fileIcon(title);

				// Default
				if (!iconClass) {
					iconClass = fileIcon(".txt");
				}

				let iconClassArray = iconClass.split(" ");
				iconElement.classList.add(...iconClassArray);
				wrapper.append(iconElement);

				let oldExtname = getExtname(title);

				// Watch title
				const observer = new MutationObserver(() => {
					let newTitle = textElement.textContent;
					let newExtname = getExtname(newTitle);

					// Change file icon if file extension changes
					if (oldExtname != newExtname) {
						iconElement.classList.remove(...iconClass.split(" "));
						iconClass = fileIcon(newTitle);

						// Default
						if (!iconClass) {
							iconClass = fileIcon(".txt");
						}

						// Set
						let iconClassArray = iconClass.split(" ");
						iconElement.classList.add(...iconClassArray);

						oldExtname = newExtname;
					}
				});

				observer.observe(textElement, {
					characterData: false,
					attributes: false,
					childList: true,
					subtree: false
				});
			}

			if (options.fileIcons) {
				addIcon();
			}

			wrapper.append(textElement);
		}

		if (title) {
			addTitle();
		}

		return wrapper;
	}
}

export default DrawerFileElement;
