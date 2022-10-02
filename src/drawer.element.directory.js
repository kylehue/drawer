import DrawerElement from "./drawer.element";

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
		this.getMain().classList.toggle(...styles.collapsed);
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
			const iconElement = DrawerElement.createText("");
			iconElement.classList.add("material-icons-round", ...styles.arrow);

			head.append(iconElement);
		}

		function addTitle() {
			const textElement = DrawerElement.createText(title);

			head.append(textElement);
		}

		function addFolderIcon() {
			const iconElement = DrawerElement.createText("");
			iconElement.classList.add("material-icons-round", ...styles.folder);

			head.append(iconElement);
		}

		addArrow();
		if (options.insertDirectoryIcons) {
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
