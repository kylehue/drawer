import DrawerElement from "./drawer.element";
import { pathToSVG, ghostDrag } from "./utils";
import {
	mdiFolder as folderSVGPath,
	//mdiFolderOpen as folderOpenSVGPath,
	mdiChevronDown as arrowDownSVGPath
} from "@mdi/js";

const styles = {
	wrapper: ["drawer-directory"],
	head: ["drawer-head"],
	body: ["drawer-body"],
	collapseButton: ["drawer-collapse-button"],
	collapsed: ["drawer-collapsed"],
	arrow: ["drawer-icon", "drawer-icon-arrow"],
	folder: ["drawer-icon", "drawer-icon-folder"],
	animate: ["drawer-animated"]
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

		//Collapse drawer on click
		this.getHead().addEventListener("mouseup", () => {
			// Only collapse if not dragged
			this.toggleCollapse();
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

		// Add drag and drop functionality
		ghostDrag(head, {
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
				let targetDirectory = directory.parent.root.getDirectoryById(targetId);
				if (!targetDirectory) {
					directory.moveToDirectory(directory.parent.root);
				} else {
					directory.moveToDirectory(targetDirectory);
				}
			}
		});

		return head;
	}

	static createBody() {
		const body = document.createElement("div");
		body.classList.add(...styles.body);

		return body;
	}
}

export default DrawerDirectoryElement;
