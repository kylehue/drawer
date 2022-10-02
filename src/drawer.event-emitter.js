class DrawerEventEmitter {
	constructor() {
		this.callbacks = {};
	}

	transformCallback(callback, options) {
		return Object.assign({
			method: callback
		}, options);
	}

	on(eventName, callback) {
		if (!this.callbacks[eventName]) {
			this.callbacks[eventName] = [];
		}

		// Add listener
		if (typeof callback == "function") {
			callback = this.transformCallback(callback, {
				once: false
			});
		}

		this.callbacks[eventName].push(callback);

		return this;
	}

	once(eventName, callback) {
		let listener = this.transformCallback(callback, {
			once: true
		});

		this.on(eventName, listener);
	}

	emit(eventName, ...args) {
		let callbacks = this.callbacks[eventName];

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
      delete this.callbacks[eventName];
    }

		if (typeof callback == "function") {
			let callbacks = this.callbacks[eventName];
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
