import DrawerEventEmitter from "./drawer.event-emitter";

class DrawerItem extends DrawerEventEmitter {
	constructor(parent, title) {
		super();
		this.title = title;
		this.parent = parent;

		this.level = 0;
	}

	setParent(parent) {
		if (!parent) {
			throw new Error("Cannot set parent to null or undefined.")
		}

		// Remove dependent listeners
		let hasParent = !!this.parent;
		if (hasParent) {
			this.parent.removeListener("removeHighlight");
		}

		// Set
		this.parent = parent;
	}

	rename(title) {
		this.title = title;
		this.refresh();

		let hasParent = !!this.parent;
		if (hasParent) {
			this.parent.refresh();
		}

		this.emit("change", "rename");
		this.ascendantsEmit("change", "rename");
	}

	appendToParent() {
		let hasParent = !!this.parent;
		if (hasParent) {
			let parent = this.parent;
			let parentElement = parent.element;
			// Append this directory's element to parent DrawerDirectory element
			if (!parentElement.has(this.element)) {
				parentElement.append(this.element);
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

export default DrawerItem;
