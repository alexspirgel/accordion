const Base = require('./base.js');
const CodedError = require('./coded-error.js');

module.exports = class Trigger extends Base {

	constructor(parameters) {
		super();
		this.boundTriggerHandler = this.triggerHandler.bind(this);
		this.boundUpdateAriaControls = this.updateAriaControls.bind(this);
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

		this._element = element;

		element[this.constructor.elementProperty] = this;
		
		element.addEventListener('click', this.boundTriggerHandler);

		element.setAttribute(this.constructor.elementDataAttribute, 'trigger');

		this.usingExistingId = true;
		if (!element.getAttribute('id')) {
			element.setAttribute('id', 'accordion-trigger-' + this.item.count);
			this.usingExistingId = false;
		}

		this.updateAriaControls();
		this.item.element.addEventListener(this.item.constructor.accordionItemAddContentEventName, this.boundUpdateAriaControls);

		this.updateAriaExpanded();

		if (!(element instanceof HTMLButtonElement)) {
			this.accessibilityWarn(`Accordion trigger should be a <button> element.`);
		}

		return element;
	}

	updateAriaControls() {
		if (this.item.content) {
			this.element.setAttribute('aria-controls', this.item.content.element.getAttribute('id'));
		}
	}

	updateAriaExpanded() {
		if (this.item.state === 'closing' || this.item.state === 'closed') {
			this.element.setAttribute('aria-expanded', 'false');
		}
		else if (this.item.state === 'opening' || this.item.state === 'opened') {
			this.element.setAttribute('aria-expanded', 'true');
		}
	}

	triggerHandler() {
		this.item.toggle();
	}

	destroy() {
		delete this.element[this.constructor.elementProperty];
		this.element.removeAttribute(this.constructor.elementDataAttribute);
		this.element.removeEventListener('click', this.boundTriggerHandler);
		if (!this.usingExistingId) {
			this.element.removeAttribute('id');
		}
		this.element.removeAttribute('aria-expanded');
		this.element.removeAttribute('aria-controls');
		this.item.element.removeEventListener(this.item.constructor.accordionItemAddContentEventName, this.boundUpdateAriaControls);
	}

};