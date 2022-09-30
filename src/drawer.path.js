const path = require("path");

module.exports.getAncestorPath = function(object) {
	var ancestorPath = "";

	//Scan upwards
	function scanAncestors(_object) {
		//Continue recursion as long as there's a parent
		if (_object.parent) {
			//Concat the object's name to path string
			ancestorPath = _object.value.name + "." + ancestorPath;

			//Then scan the object's parent
			scanAncestors({
				parent: _object.parent
			});
		}
	}

	scanAncestors(object);

	//Format
	ancestorPath = "/" + ancestorPath;
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
