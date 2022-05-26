const ObjectManager = require('./object-manager.js');
const isElement = require('@alexspirgel/is-element');
const normalizeElements = require('@alexspirgel/normalize-elements');
const Bundle = require('./bundle.js');

module.exports = class Accordion {

	static isAccordion(accordion) {
		return (accordion instanceof this);
	}

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

	static addAccordion(accordion) {
		if (!this.isAccordion(accordion)) {
			throw new Error(`'accordion' must be an accordion.`);
		}
		if (this.accordions.includes(accordion)) {
			throw new Error(`'accordion' already exists in the array of accordions.`);
		}
		this.accordions.push(accordion);
	}

	static removeAccordion(accordion) {
		const accordionIndex = this.accordions.indexOf(accordion);
		if (accordionIndex >= 0) {
			this.accordions.splice(accordionIndex, 1);
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
					if (item.header) {
						if (element === item.header.element) {
							return item.header;
						}
					}
					if (item.panel) {
						if (element === item.panel.element) {
							return item.panel;
						}
						if (item.panel.panelInner) {
							if (element === item.panel.panelInner.element) {
								return item.panel.panelInner;
							}
						}
					}
				}
			}
		}
	}

	static removeExistingAccordionObjectElementsFromArray(elements) {
		if (!Array.isArray(elements)) {
			throw new Error(`'elements' must be an array.`);
		}
		elements = elements.filter((element) => {
			if (!this.getAccordionObject(element)) {
				return true;
			}
		});
		return elements;
	}

	static getNestedBundles(element) {
		if (!isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		const nestedBundles = [];
		for (const accordion of this.accordions) {
			for (const bundle of accordion.bundles) {
				if (isElement(bundle.element) && element.contains(bundle.element) && element !== bundle.element) {
					nestedBundles.push(bundle);
				}
			}
		}
		return nestedBundles;
	}

	static isElementContainedBy(element, containedByElementsInput = [], operator = 'and') {
		if (!isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		const containedByElements = normalizeElements(containedByElementsInput);
		if (typeof operator !== 'string') {
			throw new Error(`'operator' must be a string.`);
		}
		operator = operator.toLowerCase();
		if (operator !== 'and' && operator !== 'or') {
			throw new Error(`'operator' must be 'and' or 'or'.`);
		}
		let isContainedBy = false;
		for (const containedByElement of containedByElements) {
			if (containedByElement.contains(element) && containedByElement !== element) {
				isContainedBy = true;
				if (operator === 'or') {
					break;
				}
			}
			else {
				isContainedBy = false;
				if (operator === 'and') {
					break;
				}
			}
		}
		return isContainedBy;
	}

	static get defaultOptions() {
		return {
			selectors: {
				bundle: undefined,
				item: undefined,
				header: undefined,
				panel: undefined,
				panelInner: undefined
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
			'selectors.header': validateSelector,
			'selectors.panel': validateSelector,
			'selectors.panelInner': validateSelector,
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

			const bundleSelector = this.options.get('selectors.bundle');
			const itemSelector = this.options.get('selectors.item');
			const headerSelector = this.options.get('selectors.header');
			const panelSelector = this.options.get('selectors.panel');
			const panelInnerSelector = this.options.get('selectors.panelInner');

			const initialBundles = [];
			const initialItems = [];
			const initialHeaders = [];
			const initialPanels = [];
			const initialPanelInners = [];

			// bundle
			if (bundleSelector) {
				let initialBundleElements = Array.from(document.querySelectorAll(bundleSelector));
				initialBundleElements = this.constructor.removeExistingAccordionObjectElementsFromArray(initialBundleElements);
				for (const initialBundleElement of initialBundleElements) {
					const initialBundle = this.addBundle({
						element: initialBundleElement
					});
					initialBundles.push(initialBundle);
				}
			}

			// item
			if (itemSelector) {
				for (const initialBundle of initialBundles) {
					let initialItemElements = Array.from(initialBundle.element.querySelectorAll(itemSelector));
					initialItemElements = this.constructor.removeExistingAccordionObjectElementsFromArray(initialItemElements);
					const nestedBundles = this.constructor.getNestedBundles(initialBundle.element);
					const nestedBundleElements = [];
					for (const nestedBundle of nestedBundles) {
						if (isElement(nestedBundle.element)) {
							nestedBundleElements.push(nestedBundle.element);
						}
					}
					initialItemElements = initialItemElements.filter((element) => {
						return !this.constructor.isElementContainedBy(element, nestedBundleElements, 'or');
					});
					for (const initialItemElement of initialItemElements) {
						const initialItem = initialBundle.addItem({
							element: initialItemElement
						});
						initialItems.push(initialItem);
					}
				}
			}

			// header
			if (headerSelector) {
				for (const initialItem of initialItems) {
					let initialHeaderElement = initialItem.element.querySelector(headerSelector);
					if (initialHeaderElement) {
						const initialHeader = initialItem.addHeader({
							element: initialHeaderElement
						});
						initialHeaders.push(initialHeader);
					}
				}
			}
			
			// panel
			if (panelSelector) {
				for (const initialItem of initialItems) {
					let initialPanelElement = initialItem.element.querySelector(panelSelector);
					if (initialPanelElement) {
						const initialPanel = initialItem.addPanel({
							element:initialPanelElement
						});
						initialPanels.push(initialPanel);
					}
				}
			}
			
			// panel inner
			if (panelInnerSelector) {
				for (const initialPanel of initialPanels) {
					let initialPanelInnerElement = initialPanel.element.querySelector(panelInnerSelector);
					if (initialPanelInnerElement) {
						const initialPanelInner = initialPanel.addPanelInner({
							element: initialPanelInnerElement
						});
						initialPanelInners.push(initialPanelInner);
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

	addBundle({element, items}) {
		const bundle = new Bundle({
			accordion: this,
			element: element,
			items: items
		});
		this.bundles.push(bundle);
		return bundle;
	}

	removeBundle(bundle) {
		const existingBundleIndex = this.bundles.indexOf(bundle);
		if (existingBundleIndex >= 0) {
			this.bundles.splice(existingBundleIndex, 1);
			return bundle;
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