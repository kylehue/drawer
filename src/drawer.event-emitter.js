class DrawerEventEmitter {
	constructor() {
		this._listeners = {};
	}

	transformCallback(callback, options) {
		return Object.assign({
			method: callback
		}, options);
	}

	addListener(object, eventName, callback) {
		if (!object[eventName]) {
			object[eventName] = [];
		}

		// Add listener
		if (typeof callback == "function") {
			callback = this.transformCallback(callback, {
				once: false
			});
		}

		object[eventName].push(callback);
	}

	on(eventName, callback) {
		this.addListener(this._listeners, eventName, callback);

		return this;
	}

	once(eventName, callback) {
		let listener = this.transformCallback(callback, {
			once: true
		});

		this.on(eventName, listener);
	}

	dispatchListener(object, eventName, ...args) {
		let callbacks = object[eventName];

		if (callbacks) {
			function triggerCallbacks() {
				for (var i = 0; i < callbacks.length; i++) {
					let callback = callbacks[i];
					let method = callback.method;
					method.apply(this, args);

					if (callback.once) {
						this.removeListener(eventName, method);
					}
				}
			}

			triggerCallbacks.call(this);
		}

		// Trigger event to DOM element
		if (this.element.getMain) {
			let htmlEvent = this.createEvent(`drawer:${eventName}`, { args });

			this.element.getMain().dispatchEvent(htmlEvent);
		}
	}

	emit(eventName, ...args) {
		this.dispatchListener(this._listeners, eventName, ...args);

		return this;
	}

	createEvent(eventName, detail) {
		let options = {
			bubbles: true,
			cancelable: true,
			detail: detail
		};

		let event = new CustomEvent(eventName, options);

		return event;
	}

	removeListener(eventName, callback) {
    if (typeof eventName == "string" && arguments.length == 1) {
      delete this._listeners[eventName];
    }

		if (typeof callback == "function") {
			let callbacks = this._listeners[eventName];
			for (var i = 0; i < callbacks.length; i++) {
				if (callback === callbacks[i].method) {
					callbacks.splice(i, 1);
					break;
				}
			}
		}

    return this;
	}
}

export default DrawerEventEmitter;
