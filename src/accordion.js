const ObjectManager = require('./object-manager.js');
const Bundle = require('./bundle.js');
const isElement = require('@alexspirgel/is-element');
const normalizeElements = require('@alexspirgel/normalize-elements');

module.exports = class Accordion {

	static get accordions() {
		if (!Array.isArray(this._accordions)) {
			this._accordions = [];
		}
		return this._accordions;
	}

	static set accordions(accordions) {
		if (!Array.isArray(accordions)) {
			throw new Error(`'accordions' must be an array.`);
		}
		if (!accordions.every(this.isAccordion)) {
			throw new Error(`'accordions' must only contain instances of Accordion.`);
		}
		this._accordions = accordions;
	}

	static isAccordion(accordion) {
		return (accordion instanceof this);
	}

	static getAccordion(accordion) {
		if (this.isAccordion(accordion)) {
			return this.accordions.find((item) => {
				return item === accordion;
			});
		}
	}

	static addAccordion(accordion) {
		if (!this.isAccordion(accordion)) {
			throw new Error(`'accordion' must be an accordion.`);
		}
		const existingAccordion = this.getAccordion(accordion);
		if (!existingAccordion) {
			this.accordions.push(accordion);
		}
	}

	static removeAccordion(accordion) {
		const existingAccordion = this.getAccordion(accordion);
		if (existingAccordion) {
			const existingAccordionIndex = this.accordions.indexOf(existingAccordionIndex);
			if (existingAccordionIndex >= 0) {
				this.accordions.splice(existingAccordionIndex, 1);
			}
		}
	}

	static getAccordionObject(element) {
		for (const accordion of this.accordions) {
			for (const bundle of accordion.bundles) {
				if (element === bundle.element) {
					return bundle;
				}
				for (const item of bundle.items) {
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
	}

	// static isElementContainedBy(element, containedByElementsInput = [], operator = 'and') {
	// 	if (!isElement(element)) {
	// 		throw new Error(`'element' must be an element.`);
	// 	}
	// 	const containedByElements = normalizeElements(containedByElementsInput);
	// 	if (typeof operator !== 'string') {
	// 		throw new Error(`'operator' must be a string.`);
	// 	}
	// 	operator = operator.toLowerCase();
	// 	if (operator !== 'and' && operator !== 'or') {
	// 		throw new Error(`'operator' must be 'and' or 'or'.`);
	// 	}
	// 	let isContainedBy = false;
	// 	for (const containedByElement of containedByElements) {
	// 		if (containedByElement.contains(element) && containedByElement !== element) {
	// 			isContainedBy = true;
	// 			if (operator === 'or') {
	// 				break;
	// 			}
	// 		}
	// 		else {
	// 			isContainedBy = false;
	// 			if (operator === 'and') {
	// 				break;
	// 			}
	// 		}
	// 	}
	// 	return isContainedBy;
	// }

	// static getNestedBundles(element) {
	// 	if (!isElement(element)) {
	// 		throw new Error(`'element' must be an element.`);
	// 	}
	// 	const nestedBundles = [];
	// 	for (const accordion of this.accordions) {
	// 		for (const bundle of accordion.bundles) {
	// 			if (isElement(bundle.element) && element.contains(bundle.element) && element !== bundle.element) {
	// 				nestedBundles.push(bundle);
	// 			}
	// 		}
	// 	}
	// 	return nestedBundles;
	// }

	static get defaultOptions() {
		return {
			selectors: {
				bundle: undefined,
				item: undefined,
				trigger: undefined,
				content: undefined,
				contentInner: undefined
			},
			defaultOpenItems: undefined,
			accessibilityWarnings: true,
			closeNestedItems: false,
			multipleOpenItems: true,
			openAnchoredItems: true,
			dataAttributes: {
				elementType: 'data-accordion',
				itemState: 'data-accordion-state',
			},
			debug: false
		};
	}

	static get optionsValidation() {
		const validateSelector = ({value, pathId}) => {
			if (typeof value !== 'string' && typeof value !== 'undefined') {
				throw new Error(`'${pathId}' must be a string or undefined.`);
			}
		};
		const validateBoolean = ({value, pathId}) => {
			if (typeof value !== 'boolean') {
				throw new Error(`'${pathId}' must be a boolean.`);
			}
		};
		const validateString = ({value, pathId}) => {
			if (typeof value !== 'string') {
				throw new Error(`'${pathId}' must be a string.`);
			}
		};
		return {
			'selectors': ({value, pathId}) => {
				if ((typeof value !== 'object' || value === null) && typeof value !== 'undefined') {
					throw new Error(`'${pathId}' must be an object or undefined.`);
				}
			},
			'selectors.bundle': validateSelector,
			'selectors.item': validateSelector,
			'selectors.trigger': validateSelector,
			'selectors.content': validateSelector,
			'selectors.contentInner': validateSelector,
			'defaultOpenItems': ({value, pathId}) => {
				if (typeof value !== 'number'
				&& typeof value !== 'string'
				&& (typeof value !== 'object' || value === null)
				&& typeof value !== 'undefined') {
					throw new Error(`'${pathId}' must be an number (zero indexed), selector string, element reference, or undefined.`);
				}
			},
			'accessibilityWarnings': validateBoolean,
			'closeNestedItems': validateBoolean,
			'multipleOpenItems': validateBoolean,
			'openAnchoredItems': validateBoolean,
			'dataAttributes': ({value, pathId}) => {
				if (typeof value !== 'object' || value === null) {
					throw new Error(`'${pathId}' must be an object.`);
				}
			},
			'dataAttributes.elementType': validateString,
			'dataAttributes.itemState': validateString,
			'debug': validateBoolean
		};
	}

	constructor(userOptions = {}) {

		this.options = new ObjectManager(this.constructor.defaultOptions, this.constructor.optionsValidation);
		this.options.merge(userOptions);

		this.constructor.addAccordion(this);

		if (!this.initialized) {

			// bundle
			const bundleSelector = this.options.get('selectors.bundle');
			if (bundleSelector) {
				const bundleElements = Array.from(document.querySelectorAll(bundleSelector));
				for (const bundleElement of bundleElements) {
					this.addBundle(bundleElement);
				}
				bundleElements.reverse();
				const bundles = bundleElements.map((bundleElement) => {
					return this.constructor.getAccordionObject(bundleElement);
				});
				// item
				const itemSelector = this.options.get('selectors.item');
				const triggerSelector = this.options.get('selectors.trigger');
				if (itemSelector) {
					for (const bundle of bundles) {
						const itemElements = bundle.element.querySelectorAll(itemSelector);
						for (const itemElement of itemElements) {
							const existingAccordionElement = this.constructor.getAccordionObject(itemElement);
							if (!existingAccordionElement) {
								bundle.addItem(itemElement);
								const item = this.constructor.getAccordionObject(itemElement);
								// trigger
								if (triggerSelector) {}
							}
						}
					}
				}
			}

			this.initialized = true;

		}

		this.log(this);

	}

	get bundles() {
		if (!Array.isArray(this._bundles)) {
			this._bundles = [];
		}
		return this._bundles;
	}

	set bundles(bundles) {
		if (!Array.isArray(bundles)) {
			throw new Error(`'bundles' must be an array.`);
		}
		if (!bundles.every(Bundle.isBundle)) {
			throw new Error(`'bundles' must only contain instances of Bundle.`);
		}
		this._bundles = bundles;
	}

	getBundle(bundle) {
		if (Bundle.isBundle(bundle)) {
			return this.bundles.find((value) => {
				return value === bundle;
			});
		}
		else if (isElement(bundle)) {
			return this.bundles.find((value) => {
				return value.element === bundle;
			});
		}
	}

	addBundle(element) {
		const bundle = new Bundle(this, element);
		this.bundles.push(bundle);
	}

	removeBundle(bundle) {
		const existingBundle = this.getBundle(bundle);
		if (existingBundle) {
			const existingBundleIndex = this.bundles.indexOf(existingBundle);
			if (existingBundleIndex >= 0) {
				this.bundles.splice(existingBundleIndex, 1);
			}
		}
	}

	destroy() {
		for (const bundle of this.bundles) {
			bundle.destroy();
		}
		this.constructor.removeAccordion(this);
	}

	log(...messages) {
		if (this.options.get('debug')) {
			console.log(`Accordion:`, ...messages);
		}
	}

};