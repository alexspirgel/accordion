const Base = require('./base.js');
const CodedError = require('./coded-error.js');
const Item = require('./item.js');

module.exports = class Bundle extends Base {

	static get dataAttribute() {
		return 'data-accordion';
	}

	constructor(options) {
		super();
		this.accordion = options.accordion;
		this.element = options.element;
		if (this.constructor.isElementInitialized(this.element)) {
			throw new CodedError('bundle-exists', 'A bundle already exists for this element.');
		}
		this.element.setAttribute(this.constructor.dataAttribute, '');
		this.initializeItems();
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
		if (!Array.isArray(items)) {
			throw new Error('`items` must be an array.');
		}
		if (!items.every(Item.isInstanceOfThis(item))) {
			throw new Error('`items` must only contain Item class instances.');
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
			this.items.push(item);
			return true;
		}
		catch (error) {
			if (error.code = 'item-exists') {
				this.debug(error, element);
				return false;
			}
			else {
				throw error;
			}
		}
	}
	
	addItems(elements) {
		if (!Array.isArray(elements) && !(elements instanceof NodeList)) {
			throw new Error('`elements` must be an array or node list.');
		}
		if (elements instanceof NodeList) {
			elements = Array.from(elements);
		}
		for (const element of elements) {
			this.addItem(element);
		}
	}

	initializeItems() {
		let elements = this.constructor.getElementsFromInput(this.options.elements.item);
		const nestedBundles = this.element.querySelectorAll('[' + this.constructor.dataAttribute + ']');
		elements = this.constructor.filterElementsByContainers(elements, this.element, nestedBundles);
		this.addItems(elements);
	}

};