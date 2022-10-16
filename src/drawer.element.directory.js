import DrawerElement from "./drawer.element";
import {
	pathToSVG,
	makeDraggable,
	makeRenameable
} from "./utils";

import {
	mdiFolder as folderSVGPath,
	mdiChevronDown as arrowDownSVGPath,
	mdiFilePlus as addFileSVGPath,
	mdiFolderPlus as addDirectorySVGPath,
	mdiContentCopy as copySVGPath,
	mdiContentCut as cutSVGPath,
	mdiContentPaste as pasteSVGPath,
	mdiPencilBoxOutline as renameSVGPath,
	mdiTrashCan as removeSVGPath
} from "@mdi/js";

const styles = {
	wrapper: ["drawer-directory"],
	head: ["drawer-head"],
	body: ["drawer-body"],
	collapseButton: ["drawer-collapse-button"],
	collapsed: ["drawer-collapsed"],
	arrow: ["drawer-icon", "drawer-icon-arrow"],
	folder: ["drawer-icon", "drawer-icon-folder"],
	icon: ["drawer-icon"],
	animate: ["drawer-animated"],
	buttonsWrapper: ["drawer-item-buttons"]
}

class DrawerDirectoryElement extends DrawerElement {
	constructor(directory) {
		super();

		this.directory = directory;

		this.elements.main = DrawerDirectoryElement.createMain(this.directory);

		this.elements.head = DrawerDirectoryElement.createHead(this.directory);

		this.elements.body = DrawerDirectoryElement.createBody();

		if (!this.directory.isRoot) {
			this.getMain().append(this.getHead());
		}

		this.getMain().append(this.getBody());

		let isDragged = false;
		let isMouseDown = false;

		window.addEventListener("mousedown", () => {
			isMouseDown = true;
		});

		window.addEventListener("mouseup", () => {
			isMouseDown = false;
			isDragged = false;
		});

		window.addEventListener("mousemove", () => {
			if (isMouseDown) {
				isDragged = true;
			}
		});

		//Collapse drawer on click
		this.getHead().addEventListener("mouseup", event => {
			let isTarget = event.target === this.getHead();
			// Only collapse if not dragged
			if (!isDragged && isTarget) {
				this.toggleCollapse();
			}
		});
	}

	getMain() {
		return this.elements.main;
	}

	getHead() {
		return this.elements.head;
	}

	getBody() {
		return this.elements.body;
	}

	append(element) {
		let htmlElement = this.getHTMLElement(element);
		this.getBody().append(htmlElement);
	}

	toggleCollapse() {
		let main = this.getMain();
		main.classList.toggle(...styles.collapsed);


		// function toggleFolderIcon() {
		// 	let isCollapsed = main.classList.contains(styles.collapsed[0]);
		//
		// 	let head = this.getHead();
		// 	let folderSVG = head.querySelector("." + styles.folder.join("."));
		// 	if (isCollapsed) {
		// 		folderSVG.querySelector("path").setAttribute("d", folderSVGPath);
		// 	} else {
		// 		folderSVG.querySelector("path").setAttribute("d", folderOpenSVGPath);
		// 	}
		// }
		//
		// toggleFolderIcon.call(this);
	}

	static createMain(directory) {
		const wrapper = document.createElement("div");
		let id = directory.id;
		wrapper.setAttribute(`data-drawer-id`, id);
		wrapper.classList.add(...styles.wrapper);

		if (directory.root.options.animate) {
			wrapper.classList.add(...styles.animate);
		}

		return wrapper;
	}

	static createHead(directory) {
		const head = document.createElement("div");
		head.classList.add(...styles.head);

		function addArrow() {
			const svg = pathToSVG(arrowDownSVGPath, {
				size: 15
			});
			svg.classList.add(...styles.arrow);
			head.append(svg);
		}

		function addTitle() {
			const textElement = DrawerElement.createText(directory.title);

			// Rename on double click
			if (directory.root.options.renameDirectoryOnDoubleClick) {
				makeRenameable(textElement, {
					triggerElement: head,
					focusClass: "drawer-text-focus",
					excludeExtname: true,
					onEdit: () => {
						directory.element.makeEditable();
					},
					onRename: () => {
						// Rename
						directory.rename(textElement.value);

						// If file can't be renamed, set the input's value back to the old one.
						let newTitle = directory.title;
						if (newTitle !== textElement.value) {
							textElement.value = newTitle;
						}
					}
				});
			}

			head.append(textElement);
		}

		function addFolderIcon() {
			let hasIcon = head.contains(document.querySelector("." + styles.folder.join(", .")));
			if (hasIcon) return;

			const svg = pathToSVG(folderSVGPath);
			svg.classList.add(...styles.folder);
			head.append(svg);
		}

		addArrow();
		if (directory.root.options.directoryIcons) {
			addFolderIcon();
		}

		if (directory.title) {
			addTitle();
		}

		// Add buttons
		let buttonOptions = directory.root.options.directoryButton;

		// Create wrapper for buttons
		const buttonsWrapper = document.createElement("div");
		buttonsWrapper.classList.add(...styles.buttonsWrapper);
		head.append(buttonsWrapper);

		for (let key of Object.keys(buttonOptions)) {
			let isEnabled = buttonOptions[key] === true;
			let svgPath;

			switch (key) {
				case "addDirectory":
					svgPath = addDirectorySVGPath;
					break;
				case "addFile":
					svgPath = addFileSVGPath;
					break;
				case "rename":
					svgPath = renameSVGPath;
					break;
				case "copy":
					svgPath = copySVGPath;
					break;
				case "cut":
					svgPath = cutSVGPath;
					break;
				case "paste":
					svgPath = pasteSVGPath;
					break;
				case "remove":
					svgPath = removeSVGPath;
					break;
			}

			if (isEnabled) {
				const iconButton = DrawerElement.createIconButton();

				// Icon
				const icon = pathToSVG(svgPath, {
					size: 14
				});

				icon.classList.add(...styles.icon);

				iconButton.append(icon);
				buttonsWrapper.append(iconButton);

				// Listener for click
				iconButton.addEventListener("click", event => {
					let emitArgs = [key + "Click", directory, event];
					directory.emit(...emitArgs);
					directory.ascendantsEmit(...emitArgs);
				});
			}
		}

		// Add drag and drop functionality
		if (directory.root.options.draggableDirectories) {
			makeDraggable(head, {
				highlightClass: "drawer-drop-target",
				highlightSelector: ".drawer-directory",
				constraintSelector: "[class^=drawer-]",
				cloneExcludeSelector: ".drawer-item-buttons",
				onDrop: (el, event) => {
					let target = event.target;
					while (target.parentElement) {
						if (target.dataset.drawerId) {
							break;
						}
						target = target.parentElement;
					}

					let targetId = target.dataset.drawerId;
					let targetDirectory = directory.parent.root.getDirectoryById(targetId);
					if (!targetDirectory) {
						directory.moveToDirectory(directory.parent.root);
					} else {
						directory.moveToDirectory(targetDirectory);
					}
				}
			});
		}

		return head;
	}

	static createBody() {
		const body = document.createElement("div");
		body.classList.add(...styles.body);

		return body;
	}
}

export default DrawerDirectoryElement;
