const constants = require("./constants.js");
const uid = require("./uid.js");
const path = require("path");
const getAncestorPath = require("./get-ancestor-path");
const datasets = require("./datasets.js");

module.exports = function scanObject(obj, callback, parent) {
	if (!obj instanceof Object || typeof callback != "function") return;
	let keys = Object.keys(obj);

	//Scan the object
	for (var i = 0; i < keys.length; i++) {
		let key = keys[i];
		let value = obj[key];
		if (parent) {
			value.parent = parent;
		} else value.parent = obj;

		//Set value name as key's name
		value.name = key;

		//Set value path
		value.path = path.dirname(getAncestorPath(value).path);

		//If content object is missing inside the value, then add an empty content object
		value.content = !value.content ? {} : value.content;

		datasets.add(value);

		if (value.type == "file") {
			callback(value);
		} else if (value.type == "directory") {
			callback(value);

			//Recursion
			scanObject(value.content, callback, value);
		}
	}
}
