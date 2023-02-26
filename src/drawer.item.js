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

	moveToDirectory(targetDirectory) {
		let directory = this.type == "file" ? this.parent : this;
		if (!targetDirectory) {
			if (directory.root.options.warnings) {
				console.warn("Cannot move to null or undefined.");
			}

			return null;
		}

		if (this.isRoot) {
			if (directory.root.options.warnings) {
				console.warn("Cannot move root directory.");
			}

			return null;
		}

		if (this === targetDirectory) {
			if (directory.root.options.warnings) {
				console.warn("Cannot move a directory inside itself.");
			}

			return null;
		}

		// Make sure the directory isn't being moved in its subdirectories
		if (this.type == "directory") {
			let targetIsDescendant = false;
			directory.scanItems((dir) => {
				if (dir === targetDirectory) {
					targetIsDescendant = true;
					return;
				}
			});

			if (targetIsDescendant) {
				if (directory.root.options.warnings) {
					console.warn("Cannot move a directory inside its descendant.");
				}

				return null;
			}
		}

		// Will this item have a title conflict in the target directory?
		let duplicateExists = targetDirectory.has(this.type, this.title);
		if (duplicateExists) {
			if (directory.root.options.warnings) {
				let targetPath = targetDirectory.path == pathSeperator ? "root" : targetDirectory.path;
				console.warn(`Cannot move '${this.title}' to ${targetPath} because the ${this.type} '${this.title}' already exists in ${targetPath}.`);
			}

			this.emit("error", 1, this);
			this.ascendantsEmit("error", 1, this);

			return null;
		}

		// Remove from parent's array
		let parentArray = this.type == "file" ? this.parent.items.files : this.parent.items.directories;
		for (var i = 0; i < parentArray.length; i++) {
			let item = parentArray[i];
			if (item === this) {
				parentArray.splice(i, 1);
			}
		}

		let from = joinPath("/", this.parent.path, this.title);

		// Push to new parent's array
		if (this.type == "file") {
			targetDirectory.items.files.push(this);
		} else {
			targetDirectory.items.directories.push(this);
		}

		// Move in DOM
		let element = this.element.getMain();
		targetDirectory.element.getBody().append(element);

		// Assign new parent
		this.parent = targetDirectory;

		// Refresh to fix stuff
		this.refresh();
		targetDirectory.refresh();

		let to = joinPath("/", this.parent.path, this.title);

		this.emit("move", this, from, to);
		this.ascendantsEmit("move", this, from, to);
		this.emit("change", "move", this, from, to);
		this.ascendantsEmit("change", "move", this, from, to);

		return this;
	}

	moveToPath(pathStr) {
		let directory = this.type == "file" ? this.parent : this;
		if (this.isRoot) {
			if (directory.root.options.warnings) {
				console.warn("Cannot move root directory.");
			}

			return null;
		}

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
		let directory = this.type == "file" ? this.parent : this;

		// Will the new title have a title conflict among its siblings?
		let scanArray = this.type == "file" ? this.parent.items.files : this.parent.items.directories;
		for (let item of scanArray) {
			if (item.title === title) {
				if (directory.root.options.warnings) {
					console.warn(`The title ${title} already exists in ${this.parent.path}.`);
				}

				this.emit("error", 1, this);
				this.ascendantsEmit("error", 1, this);
				return null;
			}
		}

		let from = joinPath("/", this.parent.path, this.title);

		this.title = title;
		this.refresh();

		let hasParent = !!this.parent;
		if (hasParent) {
			this.parent.refresh();
		}

		let to = joinPath("/", this.parent.path, this.title);

		this.emit("rename", this, from, to);
		this.ascendantsEmit("rename", this, from, to);
		this.emit("change", "rename", this, from, to);
		this.ascendantsEmit("change", "rename", this, from, to);

		return this;
	}

	remove() {
		if (this.type == "directory" && this.isRoot) {
			if (this.root.options.warnings) {
				console.warn("Cannot remove root directory. Using clear() instead.");
				this.clear();
			}
		} else {
			// Remove from parent array
			let parentArray = this.type == "file" ? this.parent.items.files : this.parent.items.directories;

			for (var i = 0; i < parentArray.length; i++) {
				let item = parentArray[i];
				if (item === this) {
					parentArray.splice(i, 1);
					break;
				}
			}

			// Remove in DOM
			this.element.getMain().remove();
		}

		this.emit("remove", this);
		this.ascendantsEmit("remove", this);
		this.emit("change", "remove", this);
		this.ascendantsEmit("change", "remove", this);
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

		return this;
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

		return this;
	}

	descendantsListener(type, eventName, ...args) {
		let directory = this.type == "file" ? this.parent : this;
		directory.scanItems((subDirectory, subDirectoryFiles) => {
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

		return this;
	}

	ascendantsEmit(eventName, ...args) {
		this.ascendantsListener("emit", eventName, ...args);

		return this;
	}

	ascendantsOn(eventName, callback) {
		this.ascendantsListener("on", eventName, callback);

		return this;
	}

	ascendantsOnce(eventName, callback) {
		this.ascendantsListener("once", eventName, callback);

		return this;
	}

	descendantsEmit(eventName, ...args) {
		this.descendantsListener("emit", eventName, ...args);

		return this;
	}

	descendantsOn(eventName, callback) {
		this.descendantsListener("on", eventName, callback);

		return this;
	}

	descendantsOnce(eventName, callback) {
		this.descendantsListener("once", eventName, callback);

		return this;
	}
}

export default DrawerItem;
