const styles = {
	text: ["drawer-text"]
}

class DrawerElement {
	constructor(title) {
		this.title = title;
		this.elements = {};
	}

	getHTMLElement(element) {
		let htmlElement = null;
		if (element instanceof DrawerElement) {
			htmlElement = element.getMain();
		} else if (element instanceof HTMLElement) {
			htmlElement = element;
		} else {
			console.error("Invalid element.");
		}

		return htmlElement;
	}

	has(element) {
		let htmlElement = this.getHTMLElement(element);
		let mainHasElement = this.getMain().contains(htmlElement);
		return mainHasElement;
	}

	static createText(text) {
		const span = document.createElement("span");
		span.classList.add(...styles.text);
		span.textContent = text;
		return span;
	}
}

module.exports = DrawerElement;
