const Base = require('./base.js');
const extend = require('@alexspirgel/extend');
const Schema = require('@alexspirgel/schema');
const Bundle = require('./bundle.js');

module.exports = class Accordion extends Base {

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

	static set accordions(accordions) {
		if (!(accordions instanceof Set)) {
			throw new Error(`'accordions' must be a Set.`);
		}
		if (!Array.from(accordions).every(this.isInstanceOfThis)) {
			throw new Error(`'accordions' must only contain Accordion class instances.`);
		}
		this._accordions = accordions;
		return this._accordions;
	}

	static addAccordion(accordion) {
		if (!this.isInstanceOfThis(accordion)) {
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
								if (item.element.contains(hashElement)) {
									item.open(true);
									itemOpened = true;
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
		for (const accordion of Array.from(this.accordions)) {
			for (const bundle of Array.from(accordion.bundles)) {
				if (element === bundle.element) {
					return bundle;
				}
				for (const item of Array.from(bundle.items)) {
					if (element === item.element) {
						return item;
					}
					if (item.trigger) {
						if (element === item.trigger.element) {
							return item.trigger;
						}
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
				}
			}
		}
		return false;
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
		if (!Array.from(bundles).every(Bundle.isInstanceOfThis)) {
			throw new Error(`'bundles' must only contain Bundle class instances.`);
		}
		this._bundles = bundles;
		return this._bundles;
	}

	addBundle(element) {
		try {
			const bundle = new Bundle({
				accordion: this,
				element: element
			});
			this.bundles.add(bundle);
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
			return bundle;
		}
		else {
			this.debug(`Bundle to be removed was not found in the set.`);
			return false;
		}
	}

	destroy() {
		for (const bundle of Array.from(this.bundles)) {
			bundle.destroy();
		}
		this.constructor.removeAccordion(this);
	}

};