const Base = require('./base.js');
const CodedError = require('./coded-error.js');
const ContentInner = require('./content-inner.js');

module.exports = class Content extends Base {

	constructor(parameters) {
		super();
		this.item = parameters.item;
		this.element = parameters.element;
		this.addContentInner(this.options.elements.contentInner);
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
		element.setAttribute(this.constructor.elementDataAttribute, 'content');
		element.id = 'accordion-content-' + this.item.count;
		if (this.item.state === 'closed') {
			element.style.height = 0;
		}
		this._element = element;
		return this._element;
	}

	filterElementsByScope(elementsInput) {
		let elements = this.constructor.normalizeElements(elementsInput);
		const nestedBundleElements = this.element.querySelectorAll('[' + this.constructor.elementDataAttribute + '="bundle"]');
		return this.constructor.filterElementsByContainer(elements, this.element, nestedBundleElements);
	}

	get contentInner() {
		return this._contentInner;
	}

	set contentInner(contentInner) {
		if (!(contentInner instanceof ContentInner)) {
			throw new Error(`'contentInner' must be a ContentInner class instance.`);
		}
		this._contentInner = contentInner;
		return this._contentInner;
	}

	addContentInner(elementsInput) {
		const elements = this.filterElementsByScope(elementsInput);
		const element = elements[0];
		try {
			const contentInner = new ContentInner({
				content: this,
				element: element
			});
			this.contentInner = contentInner;
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

};