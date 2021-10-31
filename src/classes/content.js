module.exports = class Content {

	constructor(parameters) {
		this.boundUpdateAriaLabelledBy = this.updateAriaLabelledBy.bind(this);
		this.item = parameters.item;
		this.element = parameters.element;
		if (this.options.elements.contentInner) {
			this.addContentInner(this.options.elements.contentInner);
		}
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
		element.setAttribute(this.constructor.elementDataAttribute, 'content');
		
		this.usingExistingId = true;
		if (!element.getAttribute('id')) {
			element.setAttribute('id', 'accordion-content-' + this.item.count);
			this.usingExistingId = false;
		}

		this.updateAriaLabelledBy();
		this.item.element.addEventListener(this.item.constructor.accordionItemAddTriggerEventName, this.boundUpdateAriaLabelledBy);
		
		this.existingStyleHeight = 	element.style.height;
		if (this.item.state === 'closed') {
			element.style.height = 0;
		}
		
		return this._element;
	}

	updateAriaLabelledBy() {
		if (this.element && this.item.trigger) {
			this.element.setAttribute('aria-labelledby', this.item.trigger.element.getAttribute('id'));
		}
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

	destroy() {
		if (this.contentInner) {
			this.contentInner.destroy();
		}
		delete this.element[this.constructor.elementProperty];
		this.element.removeAttribute(this.constructor.elementDataAttribute);
		if (!this.usingExistingId) {
			this.element.removeAttribute('id');
		}
		this.element.removeAttribute('aria-labelledby');
		this.item.element.removeEventListener(this.item.constructor.accordionItemAddTriggerEventName, this.boundUpdateAriaLabelledBy);
		this.element.style.height = this.existingStyleHeight;
	}

};