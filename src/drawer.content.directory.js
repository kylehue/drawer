const DrawerContent = require("./drawer.content.js");
const DrawerFile = require("./drawer.content.file.js");
const DrawerDirectoryElement = require("./drawer.element.directory.js");

class DrawerDirectory extends DrawerContent {
	constructor(title, options = {}) {
		super(title);
		this.content = {
			directories: [],
			files: []
		};

		this.element = new DrawerDirectoryElement(this.title);
	}

	refreshFiles() {
		for (let i = 0; i < this.content.files.length; i++) {
			let file = this.content.files[i];
			file.refresh();
		}
	}

	refresh() {
		this.appendToParent();
		this.refreshFiles();
	}

	addDirectory(title, options = {}) {
		let directory = new DrawerDirectory(title, options);
		directory.setParent(this);

		this.content.directories.push(directory);

		directory.refresh();

		return directory;
	}

	addFile(title) {
		let file = new DrawerFile(title);
		file.setParent(this);

		this.content.files.push(file);

		file.refresh();

		return file;
	}
}

module.exports = DrawerDirectory;
