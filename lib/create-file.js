const constants = require("./constants.js");

module.exports = function createFile(value, parentElement, callbacks) {
	//Create wrapper for file
	const wrapper = document.createElement("div");
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
	if (typeof callbacks.add == "function") {
		callbacks.add(value, wrapper);
	}

	return wrapper;
}
