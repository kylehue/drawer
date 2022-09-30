const scanObject = require("./treeview.scan-object.js");
const Directory = require("./treeview.directory.js");

function getElement(element) {
	if (typeof element == "string") {
		return document.querySelector(element);
	} else {
		return element;
	}
}

class TreeView extends Directory {
	constructor(treeObject = {}, options = {}) {
		console.clear();
		// Main tree object
		this.treeObject = {
			name: "treeview",
			path: "/",
			content: treeObject
		}

		// Options
		this.options = Object.assign({
			element: null,
			autoSortFiles: false,
			autoSortDirectories: false,
			highlight: false,
			autoRefresh: false
		}, options);

		// Element where we'll put everything
		this.element = getElement(this.options.element);

		this.bind(this.treeObject);
	}

	scanContent(treeObject, callback) {
		scanObject(treeObject, result => {
			if (result.value.type) {
				callback(result);
			}
		});
	}

	bind(treeObject) {
		let res = {};
		// this.scanContent(this.treeObject, result => {
		// 	let value = result.value;
		//
		// 	console.log(result.value);
		//
		// 	//Initiate directory types as a class
		// 	if (value.type == "directory") {
		// 		let directory = new Directory({
		// 			content: value.content,
		// 			name: value.name
		// 		});
		//
		// 	}
		// });

		scanObject(treeObject, result => {
			if (result.value.type == "directory") {
				let directory = new Directory({
					name: result.name,
					content: result.value.content,
					parent: result.parent,
					path: result.path
				});



			}
			console.log("------------------------");
			console.log("PATH: " + result.path);
			console.log("PARENT:");
			console.log(result.parent);
			console.log("CHILD:");
			console.log(result.value);
			console.log("------------------------");
		});

		console.log(res);
	}
}

module.exports = TreeView;
