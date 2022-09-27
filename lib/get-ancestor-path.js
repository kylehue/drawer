const constants = require("./constants.js");

module.exports = function getAncestorPath(obj) {
	var ancestorPath = "";

	function scanAncestors(_obj) {
		if (_obj.parent) {
			ancestorPath = _obj.name + "/" + ancestorPath;
			scanAncestors(_obj.parent);
		}
	}

	scanAncestors(obj);
	ancestorPath = constants.prefix + "/" + ancestorPath;
	ancestorPath = ancestorPath.substring(0, ancestorPath.length - 1);

	return {
		objectPath: "['" + ancestorPath.replace(/\//g, "']['") + "']",
		path: ancestorPath
	};
}
