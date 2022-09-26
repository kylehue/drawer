const constants = require("./constants.js");
const uid = require("./uid.js");

constants.idHashmap[constants.prefix] = `${constants.prefix}-${uid(6)}`;

module.exports = function scanObject(obj, callback, parent) {
	if (!obj instanceof Object || typeof callback != "function") return;
	let keys = Object.keys(obj);

	for (var i = 0; i < keys.length; i++) {
		let key = keys[i];
		let value = obj[key];
		if (parent) {
			value.parent = parent;
		} else value.parent = constants.prefix;

		value.name = key;

		if (value.type == "file") {
			callback(value);
		} else if (value.type == "directory") {
			constants.idHashmap[key] = `${constants.prefix}-${uid(6)}`;
			callback(value);
			scanObject(value.content, callback, key);
		}
	}
}
