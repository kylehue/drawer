import DrawerEventEmitter from "./drawer.event-emitter";

class DrawerContent extends DrawerEventEmitter {
	constructor(title) {
		super();
		this.title = title;
		this.parent = null;
		this.ascendantsCallbacks = {};

		this.level = -1;
	}

	setParent(parent) {
		this.parent = parent || null;
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

	ascendantsListener(type, eventName, ...args) {
		let currentParent = this.parent;
		while (currentParent) {
			if (type == "emit") {
				currentParent.emit(eventName, ...args);
			} else if (type == "on") {
				currentParent.on(eventName, args[0]);
			} else if (type == "once") {
				currentParent.once(eventName, args[0]);
			} else {
				throw new Error("Invalid listener type.");
			}

			currentParent = currentParent.parent;
		}
	}

	descendantsListener(type, eventName, ...args) {
		this.scanContent((subDirectory, subDirectoryFiles) => {
			if (type == "emit") {
				subDirectory.emit(eventName, ...args);
			} else if (type == "on") {
				subDirectory.on(eventName, args[0]);
			} else if (type == "once") {
				subDirectory.once(eventName, args[0]);
			} else {
				throw new Error("Invalid listener type.");
			}
		});

		if (type == "emit") {
			this.dispatchListener(this.ascendantsCallbacks, eventName, ...args);
		} else if (type == "on") {
			this.addListener(this.ascendantsCallbacks, eventName, args[0]);
		} else {
			throw new Error("Invalid listener type.");
		}
	}

	ascendantsEmit(eventName, ...args) {
		this.ascendantsListener("emit", eventName, ...args);
	}

	ascendantsOn(eventName, callback) {
		this.ascendantsListener("on", eventName, callback);
	}

	ascendantsOnce(eventName, callback) {
		this.ascendantsListener("once", eventName, callback);
	}

	descendantsEmit(eventName, ...args) {
		this.descendantsListener("emit", eventName, ...args);
	}

	descendantsOn(eventName, callback) {
		this.descendantsListener("on", eventName, callback);
	}

	descendantsOnce(eventName, callback) {
		this.descendantsListener("once", eventName, callback);
	}
}

export default DrawerContent;
