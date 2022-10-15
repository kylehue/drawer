import DrawerElement from "./drawer.element";
import { getClassWithColor as fileIcon } from "file-icons-js";
import { extname as getExtname } from "path";
import { ghostDrag } from "./utils";

const styles = {
	wrapper: ["drawer-file"],
	text: ["drawer-text"],
	highlight: ["drawer-highlight"]
}

class DrawerFileElement extends DrawerElement {
	constructor(file) {
		super();
		this.file = file;

		this.elements.main = DrawerFileElement.createMain(this.file);
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

	static createMain(file) {
		const wrapper = document.createElement("div");
		wrapper.classList.add(...styles.wrapper);

		function addTitle() {
			const textElement = DrawerElement.createText(file.title);

			function addIcon() {
				let iconElement = DrawerElement.createIcon();
				let iconClass = fileIcon(file.title);

				// Default
				if (!iconClass) {
					iconClass = fileIcon(".txt");
				}

				let iconClassArray = iconClass.split(" ");
				iconElement.classList.add(...iconClassArray);
				wrapper.append(iconElement);

				let oldExtname = getExtname(file.title);

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

			if (file.parent.root.options.fileIcons) {
				addIcon();
			}

			wrapper.append(textElement);
		}

		if (file.title) {
			addTitle();
		}

		// Add drag and drop functionality
		// Drag
		ghostDrag(wrapper, {
			highlightClass: "drawer-drop-target",
			highlightSelector: ".drawer-directory",
			constraintSelector: "[class^=drawer-]",
			onDrop: (el, event) => {
				let target = event.target;
				while (target.parentElement) {
					if (target.dataset.drawerId) {
						break;
					}
					target = target.parentElement;
				}

				let targetId = target.dataset.drawerId;
				let targetDirectory = file.parent.root.getDirectoryById(targetId);
				if (!targetDirectory) {
					file.moveToDirectory(file.parent.root);
				} else {
					file.moveToDirectory(targetDirectory);
				}
			}
		});

		// Drop
		// let drag = null;
		// wrapper.addEventListener("mousedown", () => {
		// 	drag = wrapper;
		// });
		//
		// window.addEventListener("mouseup", () => {
		// 	if (drag) {
		// 		console.log(drag);
		// 		drag = null;
		// 	}
		// });
		return wrapper;
	}
}

export default DrawerFileElement;
