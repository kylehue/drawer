const path = require("path");
const { getAncestorPath } = require("./treeview-path.js");
const datasets = require("./datasets.js");

module.exports = function scanObject(obj, callback) {
	if (!obj instanceof Object || typeof callback != "function") return;
	let keys = Object.keys(obj);
	//Scan the object
	for (var i = 0; i < keys.length; i++) {
		let key = keys[i];
		let value = obj[key];

		callback(value);

		//Scan object inside the object
		scanObject(value.content, callback);
	}
}
