import DrawerContent from "./drawer.content";
import DrawerFile from "./drawer.content.file";
import DrawerDirectoryElement from "./drawer.element.directory";

class DrawerDirectory extends DrawerContent {
	constructor(title, options = {}) {
		super(title);
		this.options = options;
		this.type = "directory";

		this.content = {
			directories: [],
			files: []
		};

		this.element = new DrawerDirectoryElement(this.title, this.options);

		let element = this.element.getHead();
		element.addEventListener("click", (event) => {
			this.emit("click", event);
		});
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

		this.level = this.parent.level + 1;

		// Indent
		this.element.getHead().style.paddingLeft = (this.level * 1.5 + 0.5) + "em";
		this.refreshFiles();
	}

	addDirectory(title) {
		let directory = new DrawerDirectory(title, this.options);
		directory.setParent(this);

		this.content.directories.push(directory);

		directory.refresh();

		this.emit("addDirectory", directory);
		this.ascendantsEmit("addDirectory", directory);

		return directory;
	}

	addFile(title) {
		let file = new DrawerFile(title, this.options);
		file.setParent(this);

		this.content.files.push(file);

		file.refresh();

		this.emit("addFile", file);
		this.ascendantsEmit("addFile", file);

		return file;
	}
}

export default DrawerDirectory;
