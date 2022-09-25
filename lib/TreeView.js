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

/*function draggable(el) {
	var ghost = null;
	var target = null;
	var dragStart = false;
	var dragging = false;
	var dragEnd = true;
	el.addEventListener("mousedown", e => {
		e.preventDefault();
		dragStart = true;
		dragEnd = false;
	});

	addEventListener("mouseup", e => {
		e.preventDefault();

		if (target) {
			target.append(ghost.cloneNode(true));
		}

		//Reset
		dragEnd = true;
		dragStart = false;
		if (ghost) ghost.remove();
		ghost = null;
		target = null;
	});

	function addGuide(el, target) {
		let elementIsFile = typeof el.dataset[`${prefix}-file`] == "string";
		let elementIsDirectory = typeof el.dataset[`${prefix}-directory`] == "string";
		let targetIsFile = typeof target.dataset[`${prefix}-file`] == "string";
		let targetIsDirectory = typeof target.dataset[`${prefix}Directory`] == "string";
		if (targetIsDirectory) {
			target.style.borderBottom = "3px solid #563bda";
		}
	}

	addEventListener("mousemove", e => {
		e.preventDefault();
		if (dragStart) {
			if (!ghost) ghost = el.cloneNode(true);
			if (ghost) {
				target = e.target;
				ghost.style.position = "absolute";
				ghost.style.pointerEvents = "none";
				ghost.style.zIndex = "9999";
				ghost.style.width = "fit-content";
				ghost.style.background = "black";

				let x = e.pageX - 1;
				let y = e.pageY - 1;
				ghost.style.left = `${x}px`;
				ghost.style.top = `${y}px`;
				document.body.append(ghost);


				//addGuide(el, e.target);

			}
		}
	});
}*/

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
