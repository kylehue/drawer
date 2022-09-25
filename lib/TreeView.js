const uid = require("./uid.js");

const prefix = "treeview";
const classHashmap = {};
classHashmap[prefix] = `${prefix}-${uid(6)}`;

function scanObject(obj, callback, parent) {
	if (!obj instanceof Object || typeof callback != "function") return;
	let keys = Object.keys(obj);

	for (var i = 0; i < keys.length; i++) {
		let key = keys[i];
		let value = obj[key];
		if (parent) {
			value.parent = parent;
		} else value.parent = prefix;

		if (value.type == "file") {
			callback(key, value);
		} else if (value.type == "directory") {
			classHashmap[key] = `${prefix}-${uid(6)}`;
			callback(key, value);
			scanObject(value.content, callback, key);
		}
	}
}

class TreeView {
	constructor(el, obj) {
		this.element = typeof el == "string" ? document.querySelector(el) : el;
		this.obj = obj;
		this.callbacks = {};
	}

	initialize() {
		this.element.classList.add(classHashmap[prefix]);

		//Create the tree
		scanObject(this.obj, (name, value) => {
			let wrapper = document.createElement("div");
			let parentElement = document.querySelector("." + classHashmap[value.parent]);

			//Create folders
			if (value.type == "directory") {
				wrapper.classList.add(classHashmap[name]);

				let contentWrapper = parentElement.querySelector("[data-treeview-content-wrapper]");
				contentWrapper.append(wrapper);

				//Add elements for directory header
				wrapper.classList.add(`${prefix}-directory`);
				const collapseButton = document.createElement("button");
				collapseButton.classList.add(`${prefix}-collapse-button`);
				const headerElement = document.createElement("div");
				headerElement.classList.add(`${prefix}-directory-header`);
				const titleElement = document.createElement("h6");
				titleElement.classList.add(`${prefix}-directory-name`);
				titleElement.innerText = name;

				headerElement.append(titleElement, collapseButton);
				wrapper.append(headerElement);
				//headerElement.dataset[`${prefix}Directory`] = "";
				//draggable(headerElement);


				//Add listener for collapse/expand
				headerElement.addEventListener("click", event => {
					const contentWrapper = wrapper.querySelector("[data-treeview-content-wrapper]");

					contentWrapper.classList.toggle(`${prefix}-directory-collapsed`);
					collapseButton.classList.toggle(`${prefix}-button-expand`);
				});
			}

			//Create files
			if (value.type == "file") {
				var contentWrapper = parentElement.querySelector(`[data-${prefix}-content-wrapper]`);
				if (!contentWrapper) {
					contentWrapper = document.createElement("div");
					contentWrapper.dataset[`${prefix}ContentWrapper`] = "";
					parentElement.append(contentWrapper);

				}
				contentWrapper.append(wrapper);

				//Create elements for file
				const fileWrapper = document.createElement("div");
				fileWrapper.classList.add(`${prefix}-file-wrapper`);
				const fileButton = document.createElement("button");
				fileButton.innerText = name;
				fileButton.classList.add(`${prefix}-file-button`);
				fileWrapper.append(fileButton);
				wrapper.append(fileWrapper);
				//fileButton.dataset[`${prefix}File`] = "";
				//draggable(fileWrapper);

				const fileOptionsWrapper = document.createElement("div");
			}

			//Call the callback for add
			if (typeof this.callbacks.add == "function") {
				this.callbacks.add(name, value, wrapper);
			}
		});
	}

	on(eventName, callback) {
		if (typeof callback != "function") return;
		if (eventName == "add") {
			this.callbacks.add = callback;
		}
	}
}

module.exports = TreeView;
