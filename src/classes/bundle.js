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
		if (!(accordion instanceof require('./accordion.js'))) {
			throw new Error('`accordion` must be an instance of the Accordion class.');
		}
		this._accordion = accordion;
	}

	get options() {
		return this.accordion.options;
	}

	get element() {
		return this._element;
	}

	set element(element) {
		if (!this.accordion.constructor.isElement(element)) {
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

	set items(items) {
		if (Array.isArray(items)) {
			this._items = items;
		}
		else {
			throw new Error('`items` must be an array.');
		}
		return this._items;
	}

	addItem(item) {
		if (!(item instanceof Item)) {
			throw new Error('`item` must be an instance of the Item class.');
		}
		const existingItem = this.items.find((existingItem) => {
			return existingItem.element === item.element;
		});
		if (existingItem) {
			this.debug('Item was already added.');
			return false;
		}
		this.items.push(item);
		return true;
	}

}

module.exports = Bundle;