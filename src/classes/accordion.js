const Base = require('./base.js');
const extend = require('@alexspirgel/extend');
const Schema = require('@alexspirgel/schema');

module.exports = class Accordion extends Base {

	static get Bundle() {
		return require('./bundle.js');
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
		return new Schema(optionsModel);
	}

	static get accordions() {
		if (!this._accordions) {
			this._accordions = new Set();
		}
		return this._accordions;
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
			this._accordions.delete(accordion);
			return accordion;
		}
		else {
			this.debug(`Accordion to be removed was not found in the set.`);
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

	static isElement(element) {
		if (element instanceof Element) {
			return true;
		}
		else {
			return false;
		}
	}

	static isAccordion(instance) {
		return instance instanceof this;
	}

	constructor(options) {
		super();
		this.options = options;
		this.constructor.initializeHashChangeListener();
		this.constructor.addAccordion(this);
		if (this.options.elements.bundle) {
			this.addBundles(this.options.elements.bundle);
			this.constructor.openAnchoredItem();
		}
		this.debug(this);
		return this;
	}

	get options() {
		if (!this._options) {
			this._options = extend({}, this.constructor.optionsDefault);
		}
		return this._options;
	}

	set options(options) {
		this.constructor.optionsSchema.validate(options);
		this._options = extend(this.options, options);
		return this._options;
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
		if (!Array.from(bundles).every(this.constructor.Bundle.isInstanceOfThis)) {
			throw new Error(`'bundles' must only contain Bundle class instances.`);
		}
		this._bundles = bundles;
		return this._bundles;
	}

	addBundle(element) {
		try {
			const bundle = new this.constructor.Bundle({
				accordion: this,
				element: element
			});
			this.bundles.add(bundle);
			this.dispatchEvent('addBundle', [bundle]);
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
		let elements = this.constructor.normalizeElements(elementsInput);
		if (elements.length > 0) {
			elements = this.constructor.orderElementsByDOMTree(elements, 'asc');
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
			this.bundles.delete(bundle);
			bundle.destroy();
			this.dispatchEvent('removeBundle', [bundle]);
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
		this.constructor.removeAccordion(this);
	}

};