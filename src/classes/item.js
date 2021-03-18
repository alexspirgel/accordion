class Item {

	static isItem(item) {
		return item instanceof this;
	}

	static get instanceCount() {
		if (typeof this._instanceCount !== 'number') {
			this._instanceCount = 0;
		}
		return this._instanceCount;
	}

	static set instanceCount(count) {
		if (typeof count !== 'number') {
			throw('`instanceCount` must be a number.');
		}
		else {
			return this._instanceCount = count;
		}
	}

	static instanceCountIncrement() {
		return this.instanceCount = this.instanceCount + 1;
	}

	constructor(options) {
		this.bundle = options.accordion;
		this.element = options.element;
		this.id = this.constructor.instanceCountIncrement();
		return this;
	}

	get bundle() {
		return this._bundle;
	}

	set bundle(bundle) {
		if (!(bundle instanceof require('./bundle.js'))) {
			throw new Error('`bundle` must be an instance of the Bundle class.');
		}
		this._bundle = bundle;
	}

	get options() {
		return this.bundle.accordion.options;
	}

	get element() {
		return this._element;
	}

	set element(element) {
		if (!this.bundle.accordion.constructor.isElement(element)) {
			throw new Error('`element` must be an element.');
		}
		this._element = element;
		return this._element;
	}

}

module.exports = Item;