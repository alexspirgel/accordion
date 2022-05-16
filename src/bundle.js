const isElement = require('@alexspirgel/is-element');
const Item = require('./item.js');

module.exports = class Bundle {

	static isBundle(bundle) {
		return (bundle instanceof this);
	}

	constructor(accordion, element) {
		this.accordion = accordion;
		this.element = element;
	}

	get options() {
		if (this.accordion) {
			return this.accordion.options;
		}
	}

	get element() {
		return this._element;
	}

	set element(element) {
		if (!isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		if (this.accordion.constructor.getAccordionObject(element)) {
			throw new Error(`'element' is already used in another accordion.`);
		}
		element.setAttribute(this.accordion.options.get('dataAttributes.elementType'), 'bundle');
		this._unsetElement();
		this._element = element;
	}

	_unsetElement() {
		if (isElement(this.element)) {
			this.element.removeAttribute(this.accordion.options.get('dataAttributes.elementType'));
		}
		this._element = undefined;
	}

	get items() {
		if (!Array.isArray(this._items)) {
			this._items = [];
		}
		return this._items;
	}

	set items(items) {
		if (!Array.isArray(items)) {
			throw new Error(`'items' must be an array.`);
		}
		if (!items.every(Item.isItem)) {
			throw new Error(`'items' must only contain instances of Item.`);
		}
		this._items = items;
	}
	
	addItem(element) {
		const item = new Item(this, element);
		this.items.push(item);
	}
	
	removeItem(item) {
		if (Item.isItem(item)) {
			const itemIndex = this.items.indexOf(item);
			if (itemIndex >= 0) {
				this.items.splice(itemIndex, 1);
			}
		}
	}

	destroy() {
		for (const item of this.items) {
			item.destroy();
		}
		this._unsetElement();
		this.accordion.removeBundle(this);
	}

};