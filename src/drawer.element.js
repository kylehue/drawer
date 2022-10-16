const styles = {
	text: ["drawer-text"],
	icon: ["drawer-icon"],
	iconButton: ["drawer-icon-button"]
}

class DrawerElement {
	constructor() {
		this.elements = {};
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
