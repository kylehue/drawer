const constants = require("./constants.js");

module.exports = function highlightFiles(parentElement) {
	var highlighter = document.createElement("div");
	highlighter.classList.add(`${constants.prefix}-highlighter`);
	var previousHighlightTarget;
	const highlight = (event) => {
		const fixSize = (el) => {
			let x = -el.offsetLeft + parentElement.offsetLeft;
			let width = el.offsetWidth - x;
			let height = el.offsetHeight;
			highlighter.style.display = "block";
			highlighter.style.left = x + "px";
			highlighter.style.width = width + "px";
			highlighter.style.height = height + "px";
			if (!el.contains(highlighter)) el.prepend(highlighter);
		}

		let target = event.target;
		if (target.classList.contains(`${constants.prefix}-highlightable`)) {
			fixSize(target);
			previousHighlightTarget = target;
		} else {
			if (previousHighlightTarget) {
				fixSize(previousHighlightTarget);
			}
		}
	}

	addEventListener("click", highlight);
	addEventListener("contextmenu", highlight);

	const resizeObserver = new ResizeObserver(() => {
		let width = parentElement.offsetWidth;
		highlighter.style.width = width + "px";
	});

	resizeObserver.observe(parentElement);
}
