const uid = require("./uid.js");
const constants = require("./constants.js");
const hashmaps = {};
var counter = 0;
module.exports = {
	add: (name) => {
		let value = `${constants.prefix}-${uid(constants.idLength)}`;
		hashmaps[counter] = {name, value};
		counter++;
	},
	get: (name) => {
		let result = null;
		Object.values(hashmaps).forEach((item, i) => {
			if (item.name === name) result = item.value;
		});

		return result;
	},
	getAll: () => {
		return hashmaps;
	}
}
