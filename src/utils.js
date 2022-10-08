export function pathToSVG(pathStr, options = {}) {
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

	svg.setAttribute("viewBox", "0 0 24 24");
	svg.setAttribute("width", options.size || 18);
	svg.setAttribute("height", options.size || 18);
	path.setAttribute("d", pathStr);
	path.setAttribute("fill", options.color || "grey");

	svg.append(path);

	return svg;
}
