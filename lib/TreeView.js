const path = require("path");
const lodashGet = require("lodash.get");
const lodashSet = require("lodash.set");

const constants = require("./constants.js");
const datasets = require("./datasets.js");
const uid = require("./uid.js");
const scanObject = require("./scan-object.js");
const createDirectory = require("./create-directory.js");
const createFile = require("./create-file.js");
const highlightFiles = require("./highlight-files.js");
const { getObjectPath, getAncestorPath } = require("./treeview-path.js");

function bind(obj, parent) {
	let keys = Object.keys(obj);
	//Scan the object
	for (var i = 0; i < keys.length; i++) {
		let key = keys[i];
		let value = obj[key];

		//Set parent
		value.parent = parent;

		//Set value name as key's name
		value.name = key;

		//Set value path
		value.path = path.dirname(getAncestorPath(value));

		//If content object is missing inside the value, then add an empty content object
		value.content = !value.content ? {} : value.content;

		//Add the value to dataset
		datasets.add(value);

		bind(value.content, value);
	}
}

const callbacks = {
	add: [],
	remove: []
};

class TreeView {
	constructor(el, obj, options) {
		this.element = typeof el == "string" ? document.querySelector(el) : el;
		this.obj = {
			type: "directory",
			name: constants.prefix,
			path: "/",
			content: obj
		};

		//Bind necessary data in obj
		bind(this.obj.content, this.obj);

		//Define options
		this.options = options || {};
		this.options.autoSortFiles = this.options.autoSortFiles || false;
		this.options.autoSortDirectories = this.options.autoSortDirectories || false;
		this.options.autoRefresh = this.options.autoRefresh || false;
		this.options.highlight = this.options.highlight || false;

		//Add an id on the main element so we know where to add every element
		datasets.add(this.obj);
		this.element.setAttribute(datasets.get(this.obj).id, "");

		//Highlight files on click if options.highlight is true
		if (this.options.highlight) highlightFiles(this.element);
	}

	clear() {
		//Clear obj content
		this.obj.content = {};

		//Reset datasets
		datasets.clear();

		//Clear elements in DOM
		while (this.element.firstChild) {
			this.element.removeChild(this.element.lastChild);
		}
	}

	get(pathStr) {
		//Get object path
		let objectPath = getObjectPath(pathStr);

		//If path is "/" then return this.obj
		if (objectPath == "['content']['']") return this.obj;

		//Get the object using object path
		let result = lodashGet(this.obj, objectPath);

		//If there's no result, return null and warn the user
		if (!result) {
			console.warn(`The path "${pathStr}" does not exist.`);
			return null;
		}

		return result;
	}

	add(pathStr, type, name) {
		//Get object value from path
		let treeObj = this.get(pathStr);

		if (treeObj) {
			//Create object for the new file/directory
			let newObj = {
				name,
				type,
				parent: treeObj.parent
			}

			//Add to tree's object
			treeObj.content[name] = newObj;

			//Bind necessary data
			bind(treeObj.content, treeObj);

			//Call refresh to add new file/directory in DOM
			if (this.options.autoRefresh) this.refresh();
		}
	}

	remove(pathStr) {
		//Get parent object value
		let treeObj = this.get(pathStr);
		if (treeObj) {
			var treeElement;
			//Check whether the treeObj is the main obj or not
			if (treeObj == this.obj) {
				//If treeObj is the main obj, clear treeview
				this.clear();
				treeElement = this.element;
			} else {
				let treeId = datasets.get(treeObj).id;

				//Remove children from datasets
				scanObject(treeObj.content, value => {
					if (getAncestorPath(value).startsWith(getAncestorPath(treeObj))) {
						datasets.remove(value);
					}
				});

				//Remove itself from datasets
				datasets.remove(treeObj);

				//Remove from this.obj
				if (treeObj == this.obj) {
					//If treeObj is the main object, empty the main object
					this.obj = {};
				} else {
					let treeObjName = path.basename(pathStr);
					delete treeObj.parent.content[treeObjName];
				}

				//Remove from DOM
				treeElement = document.querySelector(`[${treeId}]`);
				treeElement.remove();
			}

			//Call the callback for remove
			for (var i = 0; i < callbacks.remove.length; i++) {
				let removeCallback = callbacks.remove[i];
				if (typeof removeCallback == "function") {
					removeCallback(treeObj, treeElement);
				}
			}
		}
	}

	refresh() {
		scanObject(this.obj.content, value => {
			let treeId = datasets.get(value).id;
			let treeItem = document.querySelector(`[${treeId}]`);

			//If the tree item (directory/file) doesn't exist in the DOM
			if (!treeItem) {
				//...then add it to DOM
				//Get parent
				//This is where we'll append the element
				let parentId = datasets.get(value.parent).id;
				let parentElement = document.querySelector(`[${parentId}]`);

				//Creating elements...
				//If value is a directory
				if (value.type == "directory") {
					createDirectory(value, parentElement, callbacks);
				}

				//If value is a file
				if (value.type == "file") {
					createFile(value, parentElement, callbacks);
				}
			}
		});

		//Sorting
		if (this.options.autoSortFiles) this.sortFiles();
		if (this.options.autoSortDirectories) this.sortDirectories();
	}

	sort(pathStr, type) {
		var elements = [];
		var parent = this.element;

		if (pathStr) {
			//If there's a path indicated, only sort the elements in that path
			let treeObj = this.get(pathStr);
			console.log(treeObj);
			let treeId = datasets.get(treeObj).id;
			parent = document.querySelector(`[${treeId}]`);
		}

		//Get elements in parent
		elements = Array.from(parent.querySelectorAll(`.${constants.prefix}-${type}`));

		//Sort
		const sortedElements = elements.sort((a, b) => b.innerText.localeCompare(a.innerText));

		sortedElements.forEach(e => e.parentElement.prepend(e));
	}

	sortDirectories(pathStr) {
		this.sort(pathStr, "directory");
	}

	sortFiles(pathStr) {
		this.sort(pathStr, "file");
	}

	on(eventName, callback) {
		if (typeof callback != "function") return;
		if (eventName == "add") {
			callbacks.add.push(callback);
		}

		if (eventName == "remove") {
			callbacks.remove.push(callback);
		}
	}
}

module.exports = TreeView;
