import DrawerDirectory from "./drawer.item.directory";
import DrawerDirectoryElement from "./drawer.element.directory";
import { sep as pathSeperator } from "path";

function getElement(element) {
	if (typeof element == "string") {
		return document.querySelector(element);
	} else {
		return element;
	}
}

class Drawer extends DrawerDirectory {
	constructor(options = {}) {
		let parent = null;
		let title = "";
		super(parent, title);

		options.directoryButton = Object.assign({
			addDirectory: true,
			addFile: true,
			rename: true,
			cut: true,
			copy: true,
			paste: true,
			remove: true
		}, options.directoryButton || {});

		options.fileButton = Object.assign({
			rename: true,
			cut: true,
			copy: true,
			remove: true
		}, options.fileButton || {});

		this.options = Object.assign({
			element: undefined,
			autoSortFiles: true,
			autoSortDirectories: true,
			highlight: true,
			animate: true,
			autoRefresh: true,
			fileIcons: true,
			directoryIcons: true,
			warnings: true,
			draggableFiles: true,
			draggableDirectories: true,
			renameFileOnDoubleClick: true,
			renameDirectoryOnDoubleClick: true,
			directoryButton: {},
			fileButton: {}
		}, options);

		this.element = new DrawerDirectoryElement(this);

		if (this.options.element) {
			this.appendTo(this.options.element);
		}
	}

	appendTo(el) {
		let mainElement = this.element.getMain();
		let bodyElement = this.element.getBody();
		getElement(el).append(mainElement);

		mainElement.style.height = "100%";
		bodyElement.style.height = "100%";

		this.options.element = el;
	}

	getDirectoryById(id) {
		let result = null;
		this.scanItems((directory) => {
			if (directory.id === id) {
				result = directory;
				return;
			}
		});

		return result;
	}
}

export default Drawer;
