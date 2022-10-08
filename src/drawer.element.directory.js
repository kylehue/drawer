import DrawerElement from "./drawer.element";
import { pathToSVG } from "./utils";
import {
	mdiFolder as folderSVGPath,
	mdiChevronDown as arrowDownSVGPath
} from "@mdi/js";

const styles = {
	wrapper: ["drawer-wrapper"],
	head: ["drawer-head"],
	body: ["drawer-body"],
	collapseButton: ["drawer-collapse-button"],
	collapsed: ["drawer-collapsed"],
	arrow: ["drawer-icon", "drawer-icon-arrow"],
	folder: ["drawer-icon", "drawer-icon-folder"]
}

class DrawerDirectoryElement extends DrawerElement {
	constructor(title, options = {}) {
		super(title);

		this.elements.main = DrawerDirectoryElement.createMain(this.title);

		this.elements.head = DrawerDirectoryElement.createHead(this.title, options);

		this.elements.body = DrawerDirectoryElement.createBody(this.title);

		this.getMain().append(this.getHead());
		this.getMain().append(this.getBody());

		//Collapse drawer on click
		this.getHead().addEventListener("click", () => {
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
	}

	static createMain() {
		const wrapper = document.createElement("div");
		wrapper.classList.add(...styles.wrapper);
		return wrapper;
	}

	static createHead(title, options) {
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
			const textElement = DrawerElement.createText(title);

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
		if (options.directoryIcons) {
			addFolderIcon();
		}

		if (title) {
			addTitle();
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
