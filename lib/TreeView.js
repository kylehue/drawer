const path = require("path");
const lodashGet = require("lodash.get");
const lodashSet = require("lodash.set");
const getAncestorPath = require("./get-ancestor-path");

const constants = require("./constants.js");
const datasets = require("./datasets.js");
const uid = require("./uid.js");
const scanObject = require("./scan-object.js");
const createDirectory = require("./create-directory.js");
const createFile = require("./create-file.js");
const highlightFiles = require("./highlight-files.js");


class TreeView {
	constructor(el, obj, options) {
		this.element = typeof el == "string" ? document.querySelector(el) : el;
		this.obj = obj;
		this.callbacks = {
			add: []
		};
		this.options = options || {};

		this.element.setAttribute("treeview-main", "");

		if (options.highlight) highlightFiles(this.element);
	}

	get(dest) {
		//Resolve
		let formattedDest = path.resolve(dest);

		if (formattedDest == "/") return {
			content: this.obj
		};

		//Remove the first slash
		formattedDest = formattedDest.substring(1, formattedDest.length);

		//Transform "some/path" to "['some']['content']['path']"
		formattedDest = "['" + formattedDest.replace(/\//g, "']['content']['") + "']";

		return lodashGet(this.obj, formattedDest);
	}

	add(pathStr, type, name) {
		//Get object value from path
		let treeObj = this.get(pathStr);

		//Create object for the new file/directory
		let newObj = {
			name,
			type,
			parent: treeObj.parent
		}

		//Add to tree's object
		treeObj.content[name] = newObj;

		//Call refresh to add new file/directory in DOM
		if (this.options.autorefresh) this.refresh();
	}

	refresh() {
		//Refresh function that won't reset every element in the DOM
		scanObject(this.obj, value => {
			let treeId = datasets.get(value).id;
			let treeItem = document.querySelector(`[${treeId}]`);

			//If the tree item (directory/file) doesn't exist in the DOM
			if (!treeItem) {
				//...then add it to DOM
				let parentId = value.parent != this.obj ? datasets.get(value.parent).id : "treeview-main";
				let parentElement = document.querySelector(`[${parentId}]`);

				//If directory
				if (value.type == "directory") {
					createDirectory(value, parentElement, this.callbacks);
				}

				//If file
				if (value.type == "file") {
					createFile(value, parentElement, this.callbacks);
				}
			}
		});

		if (this.options.sort) this.sort();
	}

	sort() {
		//Sort files
		const files = Array.from(this.element.querySelectorAll(`.${constants.prefix}-file-wrapper`));

		const sortedFiles = files.sort((a, b) =>  path.extname(a.innerText).localeCompare(path.extname(b.innerText)) || a.innerText.localeCompare(b.innerText));

		sortedFiles.forEach(e => e.parentElement.appendChild(e));

		//Sort folders
		const folders = Array.from(this.element.querySelectorAll(`.${constants.prefix}-directory`));

		const sortedFolders = folders.sort((a, b) => b.innerText.localeCompare(a.innerText));

		sortedFolders.forEach(e => e.parentElement.prepend(e));
	}

	on(eventName, callback) {
		if (typeof callback != "function") return;
		if (eventName == "add") {
			this.callbacks.add.push(callback);
		}
	}
}

module.exports = TreeView;
