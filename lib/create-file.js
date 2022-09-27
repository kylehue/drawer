const constants = require("./constants.js");

module.exports = function createFile(value, parentElement, callbacks) {
	//Create wrapper for file
	const wrapper = document.createElement("div");
	wrapper.setAttribute(constants.idHashmap[value.name], "");
	wrapper.classList.add(`${constants.prefix}-file-wrapper`, `${constants.prefix}-highlightable`);
	wrapper.innerHTML = `<span>${value.name}</span>`;

	//Check if parent has content wrapper
	let parentContentWrapper = parentElement.querySelector(`:scope > .${constants.prefix}-content-wrapper`);
	if (parentContentWrapper) {
		//...if it does, then append the directory in the parent's content wrapper
		parentContentWrapper.append(wrapper);
	} else {
		//...if it doesn't, then append it to parent element itself
		parentElement.append(wrapper);
	}

	//Call the callback for add
	for (var i = 0; i < callbacks.add.length; i++) {
		let addCallback = callbacks.add[i];
		if (typeof addCallback == "function") {
			addCallback(value, wrapper);
		}
	}


	return wrapper;
}
