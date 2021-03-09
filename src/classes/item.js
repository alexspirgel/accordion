class Item {

	constructor(options) {
		this.bundle = options.accordion;
		this.element = options.element;
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