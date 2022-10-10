import {
	resolve as resolvePath,
	basename as getBasename,
	dirname as getDirname
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

export function toObjectPath(pathStr) {
	let path = resolvePath(pathStr);

	path = path.substring(1, path.length);

	let divider = "']['";
	let format = path.replace(/\//g, divider);
	let objectPath = `['${format}']`;

	return objectPath;
}
