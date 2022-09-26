# tree-view
A simple library for tree views.

### Installation
```bash
npm i @kylehue/tree-view
```

### Usage
```js
const files = {
	"index.html": {
		type: "file"
	},
	"scripts": {
		type: "directory",
		content: {
			"main.js": {
				type: "file"
			},
			"counter.js": {
				type: "file"
			}
		}
	}
}

const tree = new TreeView("#files", files);

tree.on("add", (value, element) => {

});

tree.initialize();
```
