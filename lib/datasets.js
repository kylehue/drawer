const uid = require("./uid.js");
const constants = require("./constants.js");
const path = require("path");
const datasets = [];

window.datasets = datasets;
module.exports = {
	add: function(value) {
		//Check if there's a duplicate
		if (this.get(value)) {
			//If there's a duplicate, don't continue
			return false;
		}

		//If there's no duplicate, then add
		let id = `${constants.prefix}-${uid(constants.idLength)}`;

		//Create object for dataset
		let dataset = {
			id: id,
			name: value.name,
			path: value.path,
			type: value.type
		}

		//Add object to dataset array
		datasets.push(dataset)

		return dataset;
	},
	get: function(value) {
		var result = null;
		datasets.forEach((item, i) => {
			if (item.name == value.name && item.type == value.type && item.path == value.path) result = item;
		});

		return result;
	},
	getAll: function() {
		return datasets;
	}
}
