const Base = require('./base.js');
const CodedError = require('./coded-error.js');

module.exports = class ContentInner extends Base {

	constructor(parameters) {
		super();
		this.content = parameters.content;
		this.element = parameters.element;
		return this;
	}

	get content() {
		return this._content;
	}

	set content(content) {
		if (!(content instanceof require('./content.js'))) {
			throw new Error(`'content' must be an instance of the Content class.`);
		}
		this._content = content;
	}

	get options() {
		return this.content.item.bundle.accordion.options;
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
		element.setAttribute(this.constructor.elementDataAttribute, 'content-inner');
		return this._element;
	}

	destroy() {
		delete this.element[this.constructor.elementProperty];
		this.element.removeAttribute(this.constructor.elementDataAttribute);
	}

};