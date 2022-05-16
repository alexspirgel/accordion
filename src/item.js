const isElement = require('@alexspirgel/is-element');

module.exports = class Item {

	static isItem(item) {
		return (item instanceof this);
	}

	constructor(bundle, element) {
		this.bundle = bundle;
		this.element = element;
	}

	get accordion() {
		if (this.bundle) {
			return this.bundle.accordion;
		}
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
		element.setAttribute(this.accordion.options.get('dataAttributes.elementType'), 'item');
		this._unsetElement();
		this._element = element;
	}

	_unsetElement(element) {
		if (isElement(this.element)) {
			element.removeAttribute(this.accordion.options.get('dataAttributes.elementType'));
		}
		this._element = undefined;
	}

	destroy() {
		this._unsetElement();
		this.bundle.removeItem(this);
	}

};