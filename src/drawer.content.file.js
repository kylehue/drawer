import DrawerContent from "./drawer.content";
import DrawerFileElement from "./drawer.element.file";

class DrawerFile extends DrawerContent {
	constructor(title, options = {}) {
		super(title);
		this.options = options;

		this.type = "file";

		this.content = {};
		this.element = new DrawerFileElement(this.title, options);

		let element = this.element.getMain();
		element.addEventListener("click", (event) => {
			this.emit("click", event);
		});
	}

	refresh() {
		this.appendToParent();

		// Highlight on click
		if (this.options.highlight) {
			this.on("click", event => {
				let drawer = this.options.drawer;
				drawer.descendantsEmit("removeHighlight");
				drawer.emit("removeHighlight");

				this.element.highlight();
			});

			// Listen to remove highlight event
			this.parent.on("removeHighlight", () => {
				this.element.removeHighlight();
			});
		}

		// Indent
		this.element.getMain().style.paddingLeft = (this.parent.level * 1.5 + 3.5) + "em";
		if (!this.parent.parent) {
			this.element.getMain().style.paddingLeft = "2em";
		}
	}

	addContent(name, value) {
		this.content[name] = value;

		return this;
	}
}

export default DrawerFile;
