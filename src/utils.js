import {
	resolve as resolvePath,
	join as joinPath
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
