const Base = require('./base.js');
const CodedError = require('./coded-error.js');

module.exports = class Container extends Base {

	constructor(parameters) {
		super();
		this.content = parameters.content;
		this.element = parameters.element;
		if (this.constructor.isElementInitialized(this.element)) {
			throw new CodedError('already-initialized', 'This element already exists as part of an accordion.');
		}
		this.initializeElement();
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
		this._element = element;
		return this._element;
	}

	initializeElement() {
		this.element[this.constructor.elementProperty] = this;
		this.element.setAttribute(this.constructor.elementDataAttribute, 'container');
	}

};