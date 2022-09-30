const scanObject = require("./treeview.scan-object.js");

class Directory {
	constructor(options = {}) {
		this.type = "directory";

		options = Object.assign({
			name: undefined,
			content: {},
			path: "/"
		}, options);

		this.name = options.name;
		this.content = options.content;
		this.path = options.path;

		this.test = 1;
	}

	createDirectory() {

	}

	createFile() {

	}
}

module.exports = Directory;
