const styles = {
	text: ["drawer-text"],
	icon: ["drawer-icon"],
	iconButton: ["drawer-icon-button"]
}
import {extname as getExtname} from "path";
class DrawerElement {
	constructor() {
		this.elements = {};
	}

	//TODO: come up with a better solution
	makeEditable() {
		let input;
		let selectRange = 0;
		if (this.file) {
			input = this.getMain().querySelector("input");
		} else {
			input = this.getHead().querySelector("input");
		}

		input.classList.add("drawer-text-focus");
		input.focus();

		// Select name on focus
		let newTitle = input.value;

		if (!this.file) {
			selectRange = newTitle.length;
		} else {
			let extname = getExtname(newTitle);
			selectRange = newTitle.indexOf(extname);
		}

		input.setSelectionRange(0, selectRange);
	}

	getHTMLElement(element) {
		let htmlElement = null;
		if (element instanceof DrawerElement) {
			htmlElement = element.getMain();
		} else if (element instanceof HTMLElement) {
			htmlElement = element;
		} else {
			throw new Error("Invalid element.");
		}

		return htmlElement;
	}

	has(element) {
		let htmlElement = this.getHTMLElement(element);
		let mainHasElement = this.getMain().contains(htmlElement);
		return mainHasElement;
	}

	static createIconButton() {
		const button = document.createElement("button");
		button.classList.add(...styles.iconButton);
		return button;
	}

	static createText(text) {
		const input = document.createElement("input");
		input.classList.add(...styles.text);
		input.value = text;
		return input;
	}

	static createIcon() {
		const span = document.createElement("span");
		span.classList.add(...styles.icon);
		return span;
	}
}

export default DrawerElement;
