const Base = require('./base.js');
const CodedError = require('./coded-error.js');
const Item = require('./item.js');

module.exports = class Bundle extends Base {

	constructor(parameters) {
		super();
		this.accordion = parameters.accordion;
		this.element = parameters.element;
		if (this.options.elements.item) {
			this.addItems(this.options.elements.item);
		}
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
		if (!this.element) {
			throw new Error(`Cannot filter elements by scope without a defined 'this.element'.`);
		}
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
		if (elements.length > 0) {
			for (const element of elements) {
				this.addItem(element);
			}
		}
		else {
			this.debug(`No elements were found when trying to add items.`);
		}
	}

	removeItem(item) {
		if (this.items.has(item)) {
			this._items.delete(item);
			item.destroy();
			return true;
		}
		else {
			this.debug(`Item to be removed was not found in the set.`);
			return false;
		}
	}

	getItemsOrderedByDOMTree() {
		const items = Array.from(this.items);
		let itemElements = items.map(item => item.element);
		if (!itemElements.every(this.constructor.isElement)) {
			this.debug(`When ordering items by DOM tree, some items do not have elements, those without elements will be omitted from the ordered list.`);
			itemElements = itemElements.filter(this.constructor.isElement);
		}
		if (itemElements.length < 1) {
			throw new Error(`No items have an element to order by DOM tree.`);
		}
		const orderedItemElements = this.constructor.orderElementsByDOMTree(itemElements, 'desc');
		const orderedItems = orderedItemElements.map(itemElement => itemElement[this.constructor.elementProperty]);
		return orderedItems;
	}

	get firstItem() {
		const items = this.getItemsOrderedByDOMTree();
		return items[0];
	}

	get lastItem() {
		const items = this.getItemsOrderedByDOMTree();
		return items[items.length - 1];
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