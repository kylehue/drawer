import DrawerItem from "./drawer.item";
import DrawerFileElement from "./drawer.element.file";

class DrawerFile extends DrawerItem {
	constructor(parent, title) {
		super(parent, title);
		this.type = "file";

		this.content = {};
		this.element = new DrawerFileElement(this);

		let element = this.element.getMain();
		element.addEventListener("click", (event) => {
			this.emit("click", event);
		});
	}

	refresh() {
		this.appendToParent();

		// Highlight on click
		if (this.parent.root.options.highlight) {
			this.on("click", event => {
				let root = this.parent.root;
				root.descendantsEmit("removeHighlight");
				root.emit("removeHighlight");

				this.element.highlight();
			});

			// Listen to remove highlight event
			this.parent.on("removeHighlight", () => {
				this.element.removeHighlight();
			});
		}

		// Sort
		if (this.parent.root.options.autoSortFiles) {
			this.parent.sortFiles();
		}

		let main = this.element.getMain();

		// Reset title
		let textElement = main.querySelector(".drawer-text");
		if (this.title != textElement.value) {

			textElement.value = this.title;
		}

		// Reset Level
		this.level = this.parent.level;

		// Indent
		main.style.paddingLeft = (this.level * 1.5 + 2.5) + "em";
		if (!this.parent.parent) {
			main.style.paddingLeft = "2.5em";
		}

		return this;
	}

	updateContent(name, value) {
		this.content[name] = value;

		return this;
	}

	removeContent(name) {
		delete this.content[name];

		return this;
	}

	getContent(name) {
		return this.content[name];
	}
}

export default DrawerFile;
