const isElement = require('@alexspirgel/is-element');
const Item = require('./item.js');

module.exports = class Bundle {

	static isBundle(bundle) {
		return (bundle instanceof this);
	}

	constructor({accordion, element, items}) {
		this.accordion = accordion;
		this.element = element;
		if (Array.isArray(items)) {
			this.addItems(items);
		}
	}

	get options() {
		if (this.accordion) {
			return this.accordion.options;
		}
	}

	get accordion() {
		return this._accordion;
	}

	set accordion(accordion) {
		if (this.initialized) {
			throw new Error(`The 'accordion' property should not be changed after construction. Instead, destroy the instance and create a new one.`);
		}
		const Accordion = require('./accordion.js');
		if (!Accordion.isAccordion(accordion)) {
			throw new Error(`'accordion' must be an instance of the 'Accordion' class.`);
		}
		this._accordion = accordion;
	}

	get element() {
		return this._element;
	}

	set element(element) {
		if (!isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		if (this.accordion.constructor.getAccordionObject(element)) {
			throw new Error(`'element' is already used in an accordion.`);
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
	
	addItem({element, header, panel, panelInner}) {
		const item = new Item({
			bundle: this,
			element: element,
			header: header,
			panel: panel,
			panelInner: panelInner
		});
		this.items.push(item);
		return item;
	}

	addItems(items) {
		const addedItems = [];
		if (!Array.isArray(items)) {
			throw new Error(`'items' must be an array.`);
		}
		for (const item of items) {
			const addedItem = this.addItem(item);
			addedItems.push(addedItem);
		}
		return addedItems;
	}
	
	removeItem(item) {
		const itemIndex = this.items.indexOf(item);
		if (itemIndex >= 0) {
			this.items.splice(itemIndex, 1);
			return item;
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