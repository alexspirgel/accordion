const Item = require('./item.js');

class Bundle {

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
		this.id = this.constructor.instanceCountIncrement();
		this.accordion = options.accordion;
		this.element = options.element;
		return this;
	}

	get accordion() {
		return this._accordion;
	}

	set accordion(accordion) {
		if (accordion.constructor.name !== 'Accordion') {
			throw new Error('`accordion` must be an instance of the Accordion class.');
		}
		this._accordion = accordion;
	}

	get element() {
		return this._element;
	}

	set element(element) {
		if (element.nodeType !== 1) {
			throw new Error('`element` must be an element.');
		}
		this._element = element;
		return this._element;
	}

	get items() {
		if (!this._items) {
			this._items = [];
		}
		return this._items;
	}

}

module.exports = Bundle;