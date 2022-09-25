const ids = [];

function generateId(length) {
	var chars = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

	var id = "";
	for (var i = 0; i < length; i++) {
		id += chars[Math.floor(Math.random() * chars.length)];
	}

	return id;
}

module.exports = function uid(length) {
	var id = generateId(length);
	while (ids.includes(id)) {
		id = generateId(length);
	}

	ids.push(id);

	return id;
}
