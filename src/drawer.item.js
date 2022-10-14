import DrawerEventEmitter from "./drawer.event-emitter";

class DrawerItem extends DrawerEventEmitter {
	constructor(parent, title) {
		super();
		this.title = title;
		this.parent = parent;

		this.level = 0;
	}

	changeParent(newParent) {
		if (!newParent) {
			throw new Error("Cannot set parent to null or undefined.")
		}

		// Remove from parent's array
		let parentArray = this.type == "file" ? this.parent.items.files : this.parent.items.directories;
		for (var i = 0; i < parentArray.length; i++) {
			let item = parentArray[i];
			if (item === this) {
				parentArray.splice(i, 1);
			}
		}

		// Push to new parent's array
		if (this.type == "file") {
			newParent.items.files.push(this);
		} else {
			newParent.items.directories.push(this);
		}

		// Move in DOM
		let element = this.element.getMain();
		newParent.element.getBody().append(element);
		newParent.refresh(); // Refresh to fix stuff

		// Assign new parent
		this.parent = newParent;

		// Lastly, refresh the directory itself
		this.refresh();
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
