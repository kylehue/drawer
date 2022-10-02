import DrawerElement from "./drawer.element";

const styles = {
	wrapper: ["drawer-wrapper"],
	head: ["drawer-head"],
	body: ["drawer-body"],
	collapseButton: ["drawer-collapse-button"],
	arrow: ["drawer-arrow"],
	collapsed: ["drawer-collapsed"]
}

class DrawerDirectoryElement extends DrawerElement {
	constructor(title) {
		super(title);

		this.elements.main = DrawerDirectoryElement.createMain(this.title);

		this.elements.head = DrawerDirectoryElement.createHead(this.title);

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

	static createHead(title) {
		const head = document.createElement("div");
		head.classList.add(...styles.head);

		function addArrow() {
			const textElement = DrawerElement.createText("");
			textElement.classList.add(...styles.arrow);

			head.append(textElement);
		}

		function addTitle() {
			const textElement = DrawerElement.createText(title);

			head.append(textElement);
		}

		function addFolderIcon() {
			const iconElement = DrawerElement.createIcon();
			iconElement.classList.add("mdi", "mdi-folder");

			head.append(iconElement);
		}

		addArrow();
		//addFolderIcon();
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
