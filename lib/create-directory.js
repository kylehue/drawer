const constants = require("./constants.js");
const datasets = require("./datasets.js");

module.exports = function createDirectory(value, parentElement, callbacks) {
	if (!parentElement) return;
	
	//Create wrapper for directory
	let wrapper = document.createElement("div");
	let treeId = datasets.get(value).id;
	wrapper.setAttribute(treeId, "");
	wrapper.classList.add(`${constants.prefix}-directory`);

	//Create wrapper for directory header
	let headerWrapper = document.createElement("div");
	headerWrapper.innerHTML = `
	<button class="${constants.prefix}-collapse-button"></button>
	<h6 class="${constants.prefix}-directory-name">${value.name}</h6>
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
	for (var i = 0; i < callbacks.add.length; i++) {
		let addCallback = callbacks.add[i];
		if (typeof addCallback == "function") {
			addCallback(value, wrapper);
		}
	}

	return wrapper;
}
