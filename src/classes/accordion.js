module.exports = class Accordion {
	
	static get extend() {
		return require('@alexspirgel/extend');
	}

	static get Schema() {
		return require('@alexspirgel/schema');
	}

	static get transitionAuto() {
		return require('@alexspirgel/transition-auto');
	}

	static get CodedError() {
		return require('./coded-error.js');
	}
	
	static get Bundle() {
		return require('./bundle.js');
	}

	static get Item() {
		return require('./item.js');
	}

	static get Trigger() {
		return require('./trigger.js');
	}

	static get Content() {
		return require('./content.js');
	}

	static get ContentInner() {
		return require('./content-inner.js');
	}

	static get dataAttributes() {
		return {
			elementType: 'data-accordion',
			itemState: 'data-accordion-item-state'
		};
	}

	static get eventNames() {
		return {
			addBundle: {
				before: 'accordionBeforeAddBundle',
				after: 'accordionAfterAddBundle'
			},
			removeBundle: {
				before: 'accordionBeforeRemoveBundle',
				after: 'accordionAfterRemoveBundle'
			},
			addItem: {
				before: 'accordionBeforeAddItem',
				after: 'accordionAfterAddItem'
			},
			removeItem: {
				before: 'accordionBeforeRemoveItem',
				after: 'accordionAfterRemoveItem'
			},
			addTrigger: {
				before: 'accordionBeforeAddTrigger',
				after: 'accordionAfterAddTrigger'
			},
			removeTrigger: {
				before: 'accordionBeforeRemoveTrigger',
				after: 'accordionAfterRemoveTrigger'
			},
			addContent: {
				before: 'accordionBeforeAddContent',
				after: 'accordionAfterAddContent'
			},
			removeContent: {
				before: 'accordionBeforeRemoveContent',
				after: 'accordionAfterRemoveContent'
			},
			addContentInner: {
				before: 'accordionBeforeAddContentInner',
				after: 'accordionAfterAddContentInner'
			},
			removeContentInner: {
				before: 'accordionBeforeRemoveContentInner',
				after: 'accordionAfterRemoveContentInner'
			},
			openItem: {
				before: 'accordionBeforeOpenItem',
				after: 'accordionAfterOpenItem'
			},
			closeItem: {
				before: 'accordionBeforeCloseItem',
				after: 'accordionAfterCloseItem'
			}
		};
	}

	static get optionsDefault() {
		return {
			elements: {
				bundle: null,
				item: null,
				trigger: null,
				content: null,
				contentInner: null
			},
			accessibilityWarnings: true,
			closeNestedItems: false,
			defaultOpenItems: null,
			multipleOpenItems: true,
			openAnchoredItems: true,
			debug: false
		};
	}

	static get optionsSchema() {
		const elementsModel = [
			{
				type: 'string'
			},
			{
				type: 'object',
				instanceOf: [Element, NodeList]
			},
			{
				type: 'array',
				allPropertySchema: [
					{
						type: 'string'
					},
					{
						type: 'object',
						instanceOf: [Element, NodeList]
					}
				]
			}
		];
		const optionsModel = {
			type: 'object',
			allowUnvalidatedProperties: false,
			propertySchema: {
				elements: {
					type: 'object',
					allowUnvalidatedProperties: false,
					propertySchema: {
						bundle: elementsModel,
						item: elementsModel,
						trigger: elementsModel,
						content: elementsModel,
						contentInner: elementsModel
					}
				},
				accessibilityWarnings: {
					type: 'boolean'
				},
				closeNestedItems: {
					type: 'boolean'
				},
				defaultOpenItems: elementsModel,
				multipleOpenItems: {
					type: 'boolean'
				},
				openAnchoredItems: {
					type: 'boolean'
				},
				debug: {
					type: 'boolean'
				}
			}
		};
		return new this.Schema(optionsModel);
	}

	static get accordions() {
		if (!this._accordions) {
			this._accordions = new Set();
		}
		return this._accordions;
	}

	static isElement(element) {
		return element instanceof Element;
	}

	static normalizeElements(inputValue, elementsSet = new Set()) {
		if (Array.isArray(inputValue) || inputValue instanceof NodeList) {
			for (let value of inputValue) {
				this.normalizeElements(value, elementsSet);
			}
		}
		else if (typeof inputValue === 'string') {
			let elements = document.querySelectorAll(inputValue);
			this.normalizeElements(elements, elementsSet);
		}
		else if (this.isElement(inputValue)) {
			elementsSet.add(inputValue);
		}
		const optionElements = Array.from(elementsSet);
		return optionElements;
	}

	static orderElementsByDOMTree(elements, order = 'asc') {
		if (!Array.isArray(elements)) {
			throw new Error(`'elements' must be an array.`);
		}
		if (!elements.every(this.isElement)) {
			throw new Error(`'elements' array must only contain elements.`);
		}
		order = order.toLowerCase();
		if (order !== 'asc' && order !== 'desc') {
			throw new Error(`'order' must be 'asc' or 'desc'.`);
		}
		const temporaryClass = 'orderElementsByDOMTree-' + Date.now().toString();
		for (const element of elements) {
			element.classList.add(temporaryClass);
		}
		const orderedElements = Array.from(document.querySelectorAll('.' + temporaryClass));
		for (const element of elements) {
			element.classList.remove(temporaryClass);
		}
		if (order === 'asc') {
			orderedElements.reverse();
		}
		return orderedElements;
	}

	static isElementContainedBy(element, containedByElementsInput = [], operator = 'and') {
		if (!this.isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		const containedByElements = this.normalizeElements(containedByElementsInput);
		if (typeof operator !== 'string') {
			throw new Error(`'operator' must be a string.`);
		}
		operator = operator.toLowerCase();
		if (operator !== 'and' && operator !== 'or') {
			throw new Error(`'operator' must be 'and' or 'or'.`);
		}
		let flag = false;
		for (const containedByElement of containedByElements) {
			if (containedByElement.contains(element) && containedByElement !== element) {
				flag = true;
				if (operator === 'or') {
					break;
				}
			}
			else {
				flag = false;
				if (operator === 'and') {
					break;
				}
			}
		}
		return flag;
	}

	static isElementNotContainedBy(element, notContainedByElementsInput = [], operator = 'and') {
		if (typeof operator !== 'string') {
			throw new Error(`'operator' must be a string.`);
		}
		operator = operator.toLowerCase();
		if (operator === 'and') {
			return !this.isElementContainedBy(element, notContainedByElementsInput, 'or');
		}
		else if (operator === 'or') {
			return !this.isElementContainedBy(element, notContainedByElementsInput, 'and');
		}
		else {
			throw new Error(`'operator' must be 'and' or 'or'.`);
		}
	}

	static filterElementsByContainer(elements, containedBy = [], notContainedBy = [], operator = 'and') {
		if (!Array.isArray(elements)) {
			throw new Error(`'elements' must be an array.`);
		}
		if (!elements.every(this.isElement)) {
			throw new Error(`'elements' array must only contain elements.`);
		}
		const filteredElements = elements.filter((element) => {
			let flag = true;
			if (containedBy) {
				if (!this.isElementContainedBy(element, containedBy, operator)) {
					flag = false;
				}
			}
			if (notContainedBy) {
				if (flag) {
					if (!this.isElementNotContainedBy(element, notContainedBy, operator)) {
						flag = false;
					}
				}
			}
			return flag;
		});
		return filteredElements;
	}

	static isElementInitialized(element) {
		if (this.dataFromElement(element)) {
			return true;
		}
		else {
			return false;
		}
	}

	static dataFromElement(element) {
		if (!this.isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		for (const accordion of this.accordions) {
			for (const bundle of accordion.bundles) {
				if (element === bundle.element) {
					return bundle;
				}
				for (const item of bundle.items) {
					if (element === item.element) {
						return item;
					}
					if (item.content) {
						if (element === item.content.element) {
							return item.content;
						}
						if (item.content.contentInner) {
							if (element === item.content.contentInner.element) {
								return item.content.contentInner;
							}
						}
					}
					if (item.trigger) {
						if (element === item.trigger.element) {
							return item.trigger;
						}
					}
				}
			}
		}
		return false;
	}

	static isAccordion(instance) {
		return instance instanceof this;
	}

	static addAccordion(accordion) {
		if (!this.isAccordion(accordion)) {
			throw new Error(`'accordion' must be an Accordion class instance.`);
		}
		if (this.accordions.has(accordion)) {
			throw new Error(`'accordion' has already been added.`);
		}
		this._accordions.add(accordion);
		return accordion;
	}

	static removeAccordion(accordion) {
		if (this.accordions.has(accordion)) {
			this.accordions.delete(accordion);
			return accordion;
		}
		else {
			this.debug(`Accordion to be removed was not found.`);
			return false;
		}
	}

	static initializeHashChangeListener() {
		if (!this.initializedHashListener) {
			window.addEventListener('hashchange', this.hashChangeHandler.bind(this));
			this.initializedHashListener = true;
		}
	}

	static hashChangeHandler(event) {
		this.openAnchoredItem(event.target.location.hash);
	}

	static openAnchoredItem(hash = location.hash) {
		if (hash) {
			const hashElement = document.querySelector(hash);
			if (hashElement) {
				let itemOpened = false;
				for (const accordion of this.accordions) {
					if (accordion.options.openAnchoredItems) {
						for (const bundle of accordion.bundles) {
							for (const item of bundle.items) {
								if (item.element) {
									if (item.element.contains(hashElement)) {
										item.open(true);
										itemOpened = true;
									}
								}
							}
						}
					}
				}
				if (itemOpened) {
					hashElement.scrollIntoView();
				}
			}
		}
	}

	constructor(options) {
		this.options = options;
		this.Accordion.initializeHashChangeListener();
		this.Accordion.addAccordion(this);
		if (this.options.elements.bundle) {
			this.addBundles(this.options.elements.bundle);
			this.Accordion.openAnchoredItem();
		}
		this.debug(this);
		return this;
	}

	get options() {
		if (!this._options) {
			this._options = this.Accordion.extend({}, this.Accordion.optionsDefault);
		}
		return this._options;
	}

	set options(options) {
		this.Accordion.optionsSchema.validate(options);
		this._options = this.Accordion.extend(this.options, options);
		return this._options;
	}

	get Accordion() {
		return this.constructor;
	}

	get bundles() {
		if (!this._bundles) {
			this._bundles = new Set();
		}
		return this._bundles;
	}

	set bundles(bundles) {
		if (!(bundles instanceof Set)) {
			throw new Error(`'bundles' must be a Set.`);
		}
		if (!Array.from(bundles).every(this.Accordion.Bundle.isBundle)) {
			throw new Error(`'bundles' must only contain Bundle class instances.`);
		}
		this._bundles = bundles;
		return bundles;
	}

	addBundle(element) {
		this.dispatchEvent(this.Accordion.eventNames.addBundle.before, [element]);
		try {
			const bundle = new this.Accordion.Bundle({
				accordion: this,
				element: element
			});
			this.bundles.add(bundle);
			this.dispatchEvent(this.Accordion.eventNames.addBundle.after, [bundle]);
			return true;
		}
		catch (error) {
			if (error.code === 'already-initialized') {
				this.debug(error, element);
				return false;
			}
			else {
				throw error;
			}
		}
	}

	addBundles(elementsInput) {
		let elements = this.Accordion.normalizeElements(elementsInput);
		if (elements.length > 0) {
			elements = this.Accordion.orderElementsByDOMTree(elements, 'asc');
			for (const element of elements) {
				this.addBundle(element);
			}
		}
		else {
			this.debug(`No elements were found when trying to add bundles.`);
		}
	}

	removeBundle(bundle) {
		if (this.bundles.has(bundle)) {
			this.dispatchEvent(this.Accordion.eventNames.removeBundle.before, [bundle]);
			this.bundles.delete(bundle);
			bundle.destroy();
			this.dispatchEvent(this.Accordion.eventNames.removeBundle.after, [bundle.element]);
			return bundle;
		}
		else {
			this.debug(`Bundle to be removed was not found in the set.`);
			return false;
		}
	}

	get eventListeners() {
		if (!this._eventListeners) {
			this._eventListeners = {};
		}
		return this._eventListeners;
	}

	addEventListener(eventName, listener) {
		if (typeof eventName !== 'string') {
			throw new Error(`'eventName' must be a string.`);
		}
		if (typeof listener !== 'function') {
			throw new Error(`'listener' must be a function.`);
		}
		if (!Array.isArray(this.eventListeners[eventName])) {
			this.eventListeners[eventName] = [];
		}
		if (!this.eventListeners[eventName].includes(listener)) {
			this.eventListeners[eventName].push(listener);
		}
	}

	removeEventListener(eventName, listener) {
		if (typeof eventName !== 'string') {
			throw new Error(`'eventName' must be a string.`);
		}
		if (typeof listener !== 'function') {
			throw new Error(`'listener' must be a function.`);
		}
		const thisEventListeners = this.eventListeners[eventName];
		if (Array.isArray(thisEventListeners)) {
			const listenerIndex = thisEventListeners.indexOf(listener);
			if (listenerIndex >= 0) {
				thisEventListeners.splice(listenerIndex, 1);
			}
		}
	}

	dispatchEvent(eventName, parameters) {
		if (typeof eventName !== 'string') {
			throw new Error(`'eventName' must be a string.`);
		}
		if (!Array.isArray(parameters)) {
			throw new Error(`'parameters' must be an array.`);
		}
		const thisEventListeners = this.eventListeners[eventName];
		if (Array.isArray(thisEventListeners)) {
			for (const listener of thisEventListeners) {
				listener.apply(this, parameters);
			}
		}
	}

	destroy() {
		for (const bundle of this.bundles) {
			bundle.destroy();
		}
		this.Accordion.removeAccordion(this);
	}

	debug(...parameters) {
		if (this.options.debug) {
			console.log('Accordion Debug:', ...parameters);
		}
	}

	accessibilityWarn(...parameters) {
		if (this.options.accessibilityWarnings) {
			console.warn('Accordion Accessibility Warning:', ...parameters);
		}
	}

};