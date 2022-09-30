class DrawerContent {
	constructor(title) {
		this.title = title;
		this.parent = null;
	}

	appendToParent() {
		let hasParent = !!this.parent;
		if (hasParent) {
			let parent = this.parent;
			let parentElement = parent.element;
			// Append this directory's element to parent DrawerDirectory element
			if (parent.title != "drawer") {
				if (!parentElement.has(this.element)) {
					parentElement.append(this.element);
				}
			} else {
				// Simply append this directory's element to main HTML element if the parent is the main directory.
				let element = this.element.getMain();
				let isInDOM = parentElement.contains(element);
				if (!isInDOM) {
					parentElement.append(element);
				}
			}
		}
	}

	setParent(parent) {
		this.parent = parent || null;
	}
}

module.exports = DrawerContent;
