const path = require("path");
const _get = require("lodash.get");
const _set = require("lodash.set");

const constants = require("./constants.js");
const scanObject = require("./scan-object.js");
const createDirectory = require("./create-directory.js");
const createFile = require("./create-file.js");
const highlightFiles = require("./highlight-files.js");

class TreeView {
	constructor(el, obj, options) {
		this.element = typeof el == "string" ? document.querySelector(el) : el;
		this.obj = obj;
		this.callbacks = {};
		this.options = options || {};

		if (options.highlight) highlightFiles(this.element);
	}

	get(dest) {
		//Resolve
		let formattedDest = path.resolve(dest);

		if (formattedDest == "/") return this.obj;

		//Remove the first slash
		formattedDest = formattedDest.substring(1, formattedDest.length);

		//Transform "some/path" to "['some']['content']['path']"
		formattedDest = "['" + formattedDest.replace(/\//g, "']['content']['") + "']";
		console.log(formattedDest);

		return _get(this.obj, formattedDest);
	}

	addFile(name, destName) {
		let destVal = this.get(destName);
		// destVal.content[name] = {
		// 	name,
		// 	type: "file",
		// 	parent: destVal.parent
		// }

		console.log(destVal);
		//console.log(this.obj);

		this.refresh();
	}

	refresh() {
		//TODO: Create a refresh function that won't reset every element in the DOM
		scanObject(this.obj, value => {

		});

		//this.element.innerHTML = "";
		//this.initialize();
	}

	initialize() {
		this.element.setAttribute(constants.idHashmap[constants.prefix], "");
		//Create the tree
		scanObject(this.obj, value => {
			let parentElement = document.querySelector(`[${constants.idHashmap[value.parent]}]`);

			//Create folders
			if (value.type == "directory") {
				createDirectory(value, parentElement, this.callbacks, constants.idHashmap, constants.prefix);
			}

			//Create files
			if (value.type == "file") {
				createFile(value, parentElement, this.callbacks);
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
			this.callbacks.add = callback;
		}
	}
}

module.exports = TreeView;
