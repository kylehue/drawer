import {
	resolve as resolvePath,
	join as joinPath,
	extname as getExtname
} from "path";

export function pathToSVG(pathStr, options = {}) {
	options = Object.assign({
		size: 18,
		color: "grey"
	}, options);

	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

	svg.setAttribute("viewBox", "0 0 24 24");
	svg.setAttribute("width", options.size);
	svg.setAttribute("height", options.size);
	path.setAttribute("d", pathStr);
	path.setAttribute("fill", options.color);

	svg.append(path);

	return svg;
}

export function getRoot(directory) {
	let root = directory;
	while (root.parent) {
		root = root.parent;
	}

	return root;
}

export function getPath(directory) {
	let path = directory.title;
	let root = directory;
	while (root.parent) {
		path = joinPath(root.parent.title, path);
		root = root.parent;
	}

	path = resolvePath(path);

	return path;
}

const ids = [];

function generateId(length) {
	var chars = "1234567890abcdefghijklmnopqrstuvwxyz";

	var id = "";
	for (var i = 0; i < length; i++) {
		id += chars[Math.floor(Math.random() * chars.length)];
	}

	return id;
}

export function uid(length = 8) {
	var id = generateId(length);
	while (ids.includes(id)) {
		id = generateId(length);
	}

	ids.push(id);

	return id;
}

export function makeDraggable(element, options = {}) {
	options = Object.assign({
		offset: 10,
		onDrop: null,
		onDrag: null,
		highlightClass: "",
		highlightSelector: "",
		constraintSelector: ""
	}, options);

	let isDragging = false;
	let isMouseDown = false;
	let nodeCopy = element.cloneNode(true);
	nodeCopy.classList.add("drawer-ghost");

	// Replace node copy's inputs with a span
	nodeCopy.querySelectorAll("input").forEach((input, i) => {
		let span = document.createElement("span");
		span.textContent = input.value;
		nodeCopy.append(span);
		input.remove();
	});

	let markX = 0;
	let markY = 0;

	element.addEventListener("mousedown", event => {
		if (event.target.tagName.toLowerCase() !== "input") {
			isMouseDown = true;
			markX = event.clientX;
			markY = event.clientY;
		}
	});

	window.addEventListener("mouseup", event => {
		isMouseDown = false;
		isDragging = false;
		if (document.body.contains(nodeCopy)) {
			nodeCopy.remove();
			element.style.opacity = "1";
			// Reset all highlight class
			document.querySelectorAll("." + options.highlightClass).forEach(item => {
				item.classList.remove(options.highlightClass);
			});

			if (typeof options.onDrop == "function") {
				options.onDrop(element, event);
			}
		}
	});

	window.addEventListener("mousemove", event => {
		let mouseX = event.clientX;
		let mouseY = event.clientY;
		let fromMarkX = Math.abs(markX - mouseX);
		let fromMarkY = Math.abs(markY - mouseY);
		let outOfRange = fromMarkX > options.offset || fromMarkY > options.offset;
		if (isMouseDown && outOfRange) {
			event.preventDefault();
			markX = Infinity;
			markY = Infinity;
			isDragging = true;

			// highlight
			if (options.highlightClass) {
				// Reset all highlight class
				document.querySelectorAll("." + options.highlightClass).forEach(item => {
					item.classList.remove(options.highlightClass);
				});

				let target = event.target;
				if (options.highlightSelector) {
					while (target.parentElement) {
						if (target.matches(options.highlightSelector)) {
							break;
						}
						target = target.parentElement;
					}
				}

				if (target) {
					if (options.constraintSelector) {
						if (target.matches(options.constraintSelector)) {
							target.classList.add(options.highlightClass);
						}
					} else {
						target.classList.add(options.highlightClass);
					}
				}
			}

			// Append clone to DOM
			if (!document.body.contains(nodeCopy)) {
				document.body.append(nodeCopy);
				element.style.opacity = "0.5";
			}

			// Follow mouse
			let targetX = mouseX - nodeCopy.offsetWidth / 2;
			let targetY = mouseY - nodeCopy.offsetHeight / 2;
			nodeCopy.style.top = targetY + "px";
			nodeCopy.style.left = targetX + "px";

			// Callback
			if (typeof options.onDrag == "function") {
				options.onDrag(element, event);
			}
		} else {
			isDragging = false;
		}
	});
}

export function makeRenameable(input, options = {}) {
	options = Object.assign({
		triggerElement: input,
		onEdit: null,
		onRename: null,
		excludeExtname: false,
		focusClass: ""
	}, options);

	input.setAttribute("spellcheck", "false");
	input.setAttribute("autocomplete", "false");
	input.setAttribute("autofill", "false");

	options.triggerElement.addEventListener("dblclick", event => {
		let isActive = input === document.activeElement;
		// Only focus if not active
		if (!isActive) {
			input.classList.add(options.focusClass);
			input.focus();

			// Select name on focus
			let newTitle = input.value;
			let selectRange = 0;
			if (options.excludeExtname) {
				selectRange = newTitle.length;
			} else {
				let extname = getExtname(newTitle);
				selectRange = newTitle.indexOf(extname);
			}

			input.setSelectionRange(0, selectRange);

			if (typeof options.onEdit == "function") {
				options.onEdit();
			}
		}
	});

	function removeTextFocus(event) {
		let enterKeyPressed = event.keyCode == 13;
		let isTarget = event.target === input;
		// Remove focus if target isn't the element or enter key is pressed
		if (!isTarget || enterKeyPressed) {
			input.classList.remove(options.focusClass);
			input.blur();

			if (typeof options.onRename == "function") {
				options.onRename();
			}
		}
	}

	// Listen
	input.addEventListener("keypress", removeTextFocus);
	input.addEventListener("blur", removeTextFocus);
	window.addEventListener("click", removeTextFocus);
}
