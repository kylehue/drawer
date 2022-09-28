const constants = require("./constants.js");
const path = require("path");
const scanObject = require("./scan-object.js");

module.exports.getAncestorPath = function(obj) {
	var ancestorPath = "";

	//Scan upwards
	function scanAncestors(_obj) {
		//Continue recursion as long as there's a parent
		if (_obj.parent) {
			//Concat the object's name to path string
			ancestorPath = _obj.name + "/" + ancestorPath;

			//Then scan the object's parent
			scanAncestors(_obj.parent);
		}
	}

	scanAncestors(obj);

	//Format
	ancestorPath = constants.prefix + "/" + ancestorPath;
	ancestorPath = ancestorPath.substring(0, ancestorPath.length - 1);

	return ancestorPath;
}

module.exports.getObjectPath = function(pathStr) {
	//Resolve
	var objectPath = path.resolve(pathStr);

	//Remove the first slash
	objectPath = objectPath.substring(1, objectPath.length);

	//Transform "some/path" to "['some']['content']['path']"
	objectPath = "['content']['" + objectPath.replace(/\//g, "']['content']['") + "']";

	return objectPath;
}
