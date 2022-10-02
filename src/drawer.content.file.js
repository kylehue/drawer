import DrawerContent from "./drawer.content";
import DrawerFileElement from "./drawer.element.file";

class DrawerFile extends DrawerContent {
	constructor(title, options = {}) {
		super(title);
		this.drawer = options.drawer;

		this.type = "file";

		this.content = {};
		this.element = new DrawerFileElement(this.title, options);

		let element = this.element.getMain();
		element.addEventListener("click", (event) => {
			this.emit("click", event);
		});
	}

	highlight() {
		this.element.getMain().style.background = "rgba(120, 120, 120, 0.2)";
	}

	removeHighlight() {
		this.element.getMain().style.background = "none";
	}

	refresh() {
		this.appendToParent();
		Object.keys(this.parent.ascendantsCallbacks).forEach((key, i) => {
			let value = this.parent.ascendantsCallbacks[key];
			this.callbacks[key].push(...value);
		});



		// Highlight on click
		this.on("click", event => {
			let drawer = this.drawer;
			drawer.descendantsEmit("removeHighlight");

			this.highlight();
		});

		this.parent.on("removeHighlight", () => {
			this.removeHighlight();
		})

		//console.log(this.callbacks);

		this.element.getMain().style.paddingLeft = (this.parent.level + 3.2) + "em";
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
