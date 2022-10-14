import DrawerEventEmitter from "./drawer.event-emitter";
import {
	join as joinPath,
	sep as pathSeperator
} from "path";
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

		// Assign new parent
		this.parent = newParent;

		// Refresh to fix stuff
		this.refresh();
		newParent.refresh();
	}

	moveToDirectory(targetDirectory) {
		if (this.isRoot) {
			throw new Error("Cannot move root directory.");
			return;
		}

		let directory = this.type == "file" ? this.parent : this;

		// Will this item have a title conflict in the target directory?
		let duplicate = targetDirectory.getItem(this.type, this.title);
		let duplicateExists = !!duplicate;
		if (duplicateExists && directory.root.options.warnings) {
			let targetPath = targetDirectory.path == pathSeperator ? "root" : targetDirectory.path;
			console.warn(`Cannot move ${this.title} to ${targetPath} because the ${this.type} '${this.title}' already exists in ${targetPath}.`);
			return;
		}

		// Set new parent
		this.changeParent(targetDirectory);

		this.emit("move", this);
		this.ascendantsEmit("move", this);

		return this;
	}

	moveToPath(pathStr) {
		if (this.isRoot) {
			throw new Error("Cannot move root directory.");
			return;
		}

		let directory = this.type == "file" ? this.parent : this;

		let targetDirectory = this.parent.getDirectoryFromPath(pathStr);
		let targetPath = joinPath(this.parent.path, pathStr);

		// Is the target path the root?
		if (targetPath == directory.root.path) {
			// ...If so, simply move this to the root
			this.moveToDirectory(directory.root);
		} else {
			// Does the path exist?
			let targetDirectoryExists = !!targetDirectory;
			if (!targetDirectoryExists) {
				// ...If not, then create path
				targetDirectory = directory.addDirectoryFromPath(pathStr);
			}

			this.moveToDirectory(targetDirectory);
		}

		return this;
	}

	rename(title) {
		if (title === this.title) return;

		this.title = title;
		this.refresh();

		let hasParent = !!this.parent;
		if (hasParent) {
			this.parent.refresh();
		}

		this.emit("rename", this);
		this.ascendantsEmit("rename", this);
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
