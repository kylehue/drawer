const constants = require("./constants.js");

module.exports = function createDirectory(value, parentElement, callbacks) {
	if (!parentElement) return;
	//Create wrapper for directory
	let wrapper = document.createElement("div");
	wrapper.setAttribute(constants.idHashmap[value.name], "");
	wrapper.classList.add(`${constants.prefix}-directory`);

	//Create wrapper for directory header
	let headerWrapper = document.createElement("div");
	headerWrapper.innerHTML = `
	<h6 class="${constants.prefix}-directory-name">${value.name}</h6>
	<button class="${constants.prefix}-collapse-button"></button>
	`;
	headerWrapper.classList.add(`${constants.prefix}-directory-header`);

	//Create wrapper for directory's content
	var contentWrapper = document.createElement("div");
	contentWrapper.classList.add(`${constants.prefix}-content-wrapper`);

	//Add listener for collapse/expand
	headerWrapper.addEventListener("click", event => {
		const collapseButton = headerWrapper.querySelector(`.${constants.prefix}-collapse-button`);
		contentWrapper.classList.toggle(`${constants.prefix}-directory-collapsed`);
		collapseButton.classList.toggle(`${constants.prefix}-button-expand`);
	});

	//Append things
	wrapper.append(headerWrapper);
	wrapper.append(contentWrapper);

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
