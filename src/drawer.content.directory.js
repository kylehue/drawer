const DrawerContent = require("./drawer.content.js");
const DrawerFile = require("./drawer.content.file.js");
const DrawerDirectoryElement = require("./drawer.element.directory.js");

class DrawerDirectory extends DrawerContent {
	constructor(title, options = {}) {
		super(title);
		this.type = "directory";

		this.content = {
			directories: [],
			files: []
		};

		this.element = new DrawerDirectoryElement(this.title);
	}

	scanContent(callback) {
		if (this.type == "directory") {
			function scan(directory, callback) {
				let directories = directory.content.directories;
				for (var i = 0; i < directories.length; i++) {
					let subDirectory = directories[i];
					let subDirectoryFiles = subDirectory.content.files;
					callback(subDirectory, subDirectoryFiles);
					scan(subDirectory, callback);
				}
			}

			scan(this, callback);
		}
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

		this.emit("addDirectory", directory);
		this.ascendantsEmit("addDirectory", directory);

		return directory;
	}

	addFile(title) {
		let file = new DrawerFile(title);
		file.setParent(this);

		this.content.files.push(file);

		file.refresh();

		this.emit("addFile", file);
		this.ascendantsEmit("addFile", file);

		return file;
	}
}

module.exports = DrawerDirectory;
