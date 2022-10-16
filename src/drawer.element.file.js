import DrawerElement from "./drawer.element";
import { getClassWithColor as fileIcon } from "file-icons-js";
import { extname as getExtname } from "path";
import { makeDraggable, makeRenameable } from "./utils";

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

			// Rename on double click
			if (file.parent.root.options.renameFileOnDoubleClick) {
				makeRenameable(textElement, {
					triggerElement: wrapper,
					focusClass: "drawer-text-focus",
					onRename: () => {
						// Rename
						file.rename(textElement.value);

						// If file can't be renamed, set the input's value back to the old one.
						let newTitle = file.title;
						if (newTitle !== textElement.value) {
							textElement.value = newTitle;
						}
					}
				});
			}

			// Add icon
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
					let newTitle = textElement.value;
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
					attributes: true,
					childList: false,
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
		if (file.parent.root.options.draggableFiles) {
			makeDraggable(wrapper, {
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
		}

		return wrapper;
	}
}

export default DrawerFileElement;
