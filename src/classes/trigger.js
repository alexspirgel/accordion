const Base = require('./base.js');
const CodedError = require('./coded-error.js');

module.exports = class Trigger extends Base {

	static get dataAttribute() {
		return 'data-accordion-trigger';
	}

	constructor(parameters) {
		super();
		this.item = parameters.item;
		this.element = parameters.element;
		if (this.constructor.isElementInitialized(this.element)) {
			throw new CodedError('trigger-exists', 'A trigger already exists for this element.');
		}
		this.element.setAttribute(this.constructor.dataAttribute, '');
		return this;
	}

	get item() {
		return this._item;
	}

	set item(item) {
		if (!(item instanceof require('./item.js'))) {
			throw new Error('`item` must be an instance of the Item class.');
		}
		this._item = item;
	}

	get options() {
		return this.item.bundle.accordion.options;
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

};