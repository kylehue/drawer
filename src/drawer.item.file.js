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

		let main = this.element.getMain();

		// Reset title
		if (this.title != main.textContent) {
			let textElement = main.querySelector(".drawer-text");
			textElement.textContent = this.title;
		}

		this.level = this.parent.level;

		// Indent
		main.style.paddingLeft = (this.level * 1.5 + 2.5) + "em";
		if (!this.parent.parent) {
			main.style.paddingLeft = "2.5em";
		}
	}

	remove() {
		let hasParent = !!this.parent;
		if (hasParent) {
			let parentFiles = this.parent.items.files;

			// Remove from parent's array
			for (var i = 0; i < parentFiles.length; i++) {
				let parentFile = parentFiles[i];
				if (parentFile === this) {
					parentFiles.splice(i, 1);
					break;
				}
			}

			// Remove from DOM
			this.element.getMain().remove();

			this.emit("removeFile", this);
			this.ascendantsEmit("removeFile", this);
			this.emit("change", "removeFile");
			this.ascendantsEmit("change", "removeFile");
		}
	}

	addContent(name, value) {
		this.content[name] = value;

		return this;
	}
}

export default DrawerFile;
