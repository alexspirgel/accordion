const AccordionError = require('./accordion-error.js');
const Item = require('./item.js');

class Bundle {

	static get dataAttribute() {
		return 'data-accordion-bundle';
	}

	static isBundle(bundle) {
		return bundle instanceof this;
	}

	static isExistingBundleElement(element) {
		return element.hasAttribute(this.dataAttribute);
	}

	constructor(options) {
		this.accordion = options.accordion;
		this.element = options.element;
		if (this.constructor.isExistingBundleElement(this.element)) {
			throw new AccordionError('bundle-exists', 'A bundle already exists for this element.');
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
		if (!Array.isArray(items)) {
			throw new Error('`items` must be an array.');
		}
		if (!items.every(Item.isItem(item))) {
			throw new Error('`items` must only contain Item class instances.');
		}
		this._items = items;
		return this._items;
	}

	initializeItems() {
		let elements = this.accordion.constructor.getElementsFromInput(this.options.elements.item);
		const nestedBundles = Array.from(this.element.querySelectorAll('[' + this.constructor.dataAttribute + ']'));
		elements = this.accordion.constructor.filterElementsByContainers(elements, this.element, nestedBundles);
		console.log(elements);
	}

}

module.exports = Bundle;