const Base = require('./base.js');
const CodedError = require('./coded-error.js');
const Item = require('./item.js');

module.exports = class Bundle extends Base {

	constructor(parameters) {
		super();
		this.accordion = parameters.accordion;
		this.element = parameters.element;
		this.addItems(this.options.elements.item);
		return this;
	}

	get accordion() {
		return this._accordion;
	}

	set accordion(accordion) {
		if (!(accordion instanceof require('./accordion.js'))) {
			throw new Error(`'accordion' must be an instance of the Accordion class.`);
		}
		this._accordion = accordion;
		return this._accordion;
	}

	get options() {
		return this.accordion.options;
	}

	get element() {
		return this._element;
	}

	set element(element) {
		if (!this.constructor.isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		if (this.constructor.isElementInitialized(element)) {
			throw new CodedError('already-initialized', `'element' already exists as part of an accordion.`);
		}
		this._element = element;
		element[this.constructor.elementProperty] = this;
		element.setAttribute(this.constructor.elementDataAttribute, 'bundle');
		return this._element;
	}

	filterElementsByScope(elementsInput) {
		let elements = this.constructor.normalizeElements(elementsInput);
		const nestedBundleElements = this.element.querySelectorAll('[' + this.constructor.elementDataAttribute + '="bundle"]');
		return this.constructor.filterElementsByContainer(elements, this.element, nestedBundleElements);
	}

	get items() {
		if (!this._items) {
			this._items = new Set();
		}
		return this._items;
	}

	set items(items) {
		if (!(items instanceof Set)) {
			throw new Error(`'items' must be a Set.`);
		}
		if (!Array.from(items).every(Item.isInstanceOfThis)) {
			throw new Error(`'items' must only contain Item class instances.`);
		}
		this._items = items;
		return this._items;
	}

	addItem(element) {
		try {
			const item = new Item({
				bundle: this,
				element: element
			});
			this.items.add(item);
			return true;
		}
		catch (error) {
			if (error.code === 'already-initialized') {
				this.debug(error, element);
				return false;
			}
			else {
				throw error;
			}
		}
	}
	
	addItems(elementsInput) {
		const elements = this.filterElementsByScope(elementsInput);
		for (const element of elements) {
			this.addItem(element);
		}
	}

	removeItem(item) {
		if (this.items.has(item)) {
			this._items.delete(item);
			item.destroy();
			return true;
		}
		else {
			return false;
		}
	}

	getFirstLastItem(firstLast) {
		if (firstLast !== 'first' && firstLast !== 'last') {
			throw new Error(`'firstLast' must be 'first' or 'last'.`);
		}
		const items = Array.from(this.items);
		const itemElements = items.map(item => item.element);
		const orderedItemElements = this.constructor.orderElementsByDOMTree(itemElements, 'desc');
		const orderedItems = orderedItemElements.map(itemElement => itemElement[this.constructor.elementProperty]);
		const returnItemIndex = (firstLast === 'first') ? 0 : orderedItems.length - 1;
		const returnItem = orderedItems[returnItemIndex];
		return returnItem;
	}

	get firstItem() {
		return this.getFirstLastItem('first');
	}

	get lastItem() {
		return this.getFirstLastItem('last');
	}
	
	destroy() {
		for (const item of Array.from(this.items)) {
			item.destroy();
		}
		delete this.element[this.constructor.elementProperty];
		this.element.removeAttribute(this.constructor.elementDataAttribute);
		this.accordion.removeBundle(this);
	}

};