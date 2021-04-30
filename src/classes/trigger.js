const Base = require('./base.js');
const CodedError = require('./coded-error.js');

module.exports = class Trigger extends Base {

	constructor(parameters) {
		super();
		this.item = parameters.item;
		this.element = parameters.element;
		return this;
	}

	get item() {
		return this._item;
	}

	set item(item) {
		if (!(item instanceof require('./item.js'))) {
			throw new Error(`'item' must be an instance of the Item class.`);
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
			throw new Error(`'element' must be an element.`);
		}
		if (this.constructor.isElementInitialized(element)) {
			throw new CodedError('already-initialized', `'element' already exists as part of an accordion.`);
		}
		element[this.constructor.elementProperty] = this;
		element.setAttribute(this.constructor.elementDataAttribute, 'trigger');
		element.setAttribute('aria-controls', this.item.content.element.id);
		element.addEventListener('click', this.triggerHandler.bind(this));
		if (!(element instanceof HTMLButtonElement)) {
			this.accessibilityWarn(`Accordion trigger should be a <button> element.`);
		}
		this._element = element;
		return this._element;
	}

	triggerHandler(event) {
		this.item.toggle();
	}

};