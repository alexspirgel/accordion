const Base = require('./base.js');
const CodedError = require('./coded-error.js');
const Container = require('./container.js');

module.exports = class Content extends Base {

	constructor(parameters) {
		super();
		this.item = parameters.item;
		this.element = parameters.element;
		if (this.constructor.isElementInitialized(this.element)) {
			throw new CodedError('already-initialized', 'This element already exists as part of an accordion.');
		}
		this.initializeElement();
		this.initializeContainer();
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
		this._element = element;
		return this._element;
	}

	initializeElement() {
		this.element[this.constructor.elementProperty] = this;
		this.element.setAttribute(this.constructor.elementDataAttribute, 'content');
	}

	filterElementsByScope(elementsInput) {
		let elements = this.constructor.normalizeElements(elementsInput);
		const nestedBundleElements = this.element.querySelectorAll('[' + this.constructor.elementDataAttribute + '="bundle"]');
		return this.constructor.filterElementsByContainer(elements, this.element, nestedBundleElements);
	}

	get container() {
		return this._container;
	}

	set container(container) {
		if (!(container instanceof Container)) {
			throw new Error(`'container' must be a Container class instance.`);
		}
		this._container = container;
		return this._container;
	}

	addContainer(elementsInput) {
		const elements = this.filterElementsByScope(elementsInput);
		const element = elements[0];
		try {
			const container = new Container({
				content: this,
				element: element
			});
			this.container = container;
			return true;
		}
		catch (error) {
			if (error.code = 'already-initialized') {
				this.debug(error, element);
				return false;
			}
			else {
				throw error;
			}
		}

	}

	initializeContainer() {
		this.addContainer(this.options.elements.container);
	}

};