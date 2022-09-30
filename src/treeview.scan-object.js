const { getAncestorPath } = require("./treeview.path.js");

module.exports = function scanObject(object, callback, parentObject) {
	if (!object instanceof Object || typeof callback != "function") return;

	// Scan every value in the object
	let keys = Object.keys(object);
	for (var i = 0; i < keys.length; i++) {
		let key = keys[i];
		let value = object[key];

		// Only do an inner scan if it's an object
		if (value instanceof Object) {
			let result = {
				name: key,
				value: value,
				parent: parentObject || null
			}

			// value.name = key;
			// value.parent = parentObject || null;
			//
			// let path = "";
			// function test(o) {
			// 	if (o.parent) {
			// 		path = o.parent.name + "." + path;
			// 		test(o.parent);
			// 	}
			// }
			// test(value);
			//
			// result.path = path;

			callback(result);
			scanObject(value, callback, object);
		}
	}
}
