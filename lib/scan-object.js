const constants = require("./constants.js");
const uid = require("./uid.js");

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

		//If content object is missing inside the value, then add an empty content object
		value.content = !value.content ? {} : value.content;

		//Check if the id hashmap doesn't contain the name yet
		if (!constants.idHashmap[key]) {
			//If it doesn't, then add it to id hashmap
			constants.idHashmap[key] = `${constants.prefix}-${value.type}-${uid(constants.idLength)}`;
		}

		if (value.type == "file") {
			callback(value);
		} else if (value.type == "directory") {
			callback(value);

			//Recursion
			scanObject(value.content, callback, value);
		}
	}
}
