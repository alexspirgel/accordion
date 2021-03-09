const extend = require('@alexspirgel/extend');
const Schema = require('@alexspirgel/schema');
const Bundle = require('./bundle.js');

class Accordion {

	static get optionsDefault() {
		return {
			elements: {
				bundle: '.accordion',
				item: '.accordion__item',
				trigger: '.accordion__trigger',
				content: '.accordion__content',
				container: '.accordion__container'
			},
			accessibilityWarnings: true,
			closeNestedItems: false,
			defaultOpenItems: null,
			inlineStyles: true,
			multipleOpenItems: true,
			openAnchoredItems: true,
			debug: false
		};
	}

	static get optionsSchema () {
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
						container: elementsModel
					}
				},
				accessibilityWarnings: {
					type: 'boolean'
				},
				closeNestedItems: {
					type: 'boolean'
				},
				defaultOpenItems: [
					{
						type: 'string'
					},
					{
						type: 'number',
						greaterThanOrEqualTo: 0,
						divisibleBy: 1
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
								type: 'number',
								greaterThanOrEqualTo: 0,
								divisibleBy: 1
							},
							{
								type: 'object',
								instanceOf: [Element, NodeList]
							}
						]
					}
				],
				inlineStyles: {
					type: 'boolean'
				},
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

	static isElement(element) {
		if (element instanceof Element && element.nodeType === 1) {
			return true;
		}
		else {
			return false;
		}
	}

	static getOptionElements(optionValue, elementsSet = new Set()) {
		if (Array.isArray(optionValue)) {
			for (let value of optionValue) {
				this.getOptionElements(value, elementsSet);
			}
		}
		else if (typeof optionValue === 'string') {
			let elements = document.querySelectorAll(optionValue);
			this.getOptionElements(elements, elementsSet);
		}
		else if (optionValue instanceof NodeList) {
			for (let element of optionValue) {
				this.getOptionElements(element, elementsSet);
			}
		}
		else if (optionValue instanceof Element && optionValue.nodeType === 1) {
			elementsSet.add(optionValue);
		}
		const optionElements = Array.from(elementsSet);
		return optionElements;
	}

	static sortElementsByMostNested(elements) {
		if (!Array.isArray(elements)) {
			throw new Error('`elements` must be an array.');
		}
		if (!elements.every(this.isElement)) {
			throw new Error('`elements` array must only contain elements.');
		}
		const elementsMapContainedElements = elements.map((mapElement, mapIndex) => {
			const contains = new Set();
			elements.forEach((element, index) => {
				if (mapIndex !== index) {
					if (mapElement.contains(element)) {
						contains.add(element);
					}
				}
			});
			return {
				'element': mapElement,
				'contains': contains
			};
		});
		elementsMapContainedElements.sort((a, b) => {
			if (a.contains.size < b.contains.size) {
				return -1;
			}
			else if (a.contains.size > b.contains.size) {
				return 1;
			}
			else {
				return 0;
			}
		});
		const sortedElements = elementsMapContainedElements.map((mapElement) => {
			return mapElement.element;
		});
		return sortedElements;
	}
	
	constructor(options) {
		this.options = options;
		this.initializeBundles();
		this.debug(this);
		return this;
	}

	get options() {
		if (this._options === undefined || this._options === null) {
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
			this._bundles = [];
		}
		return this._bundles;
	}

	set bundles(bundles) {
		if (Array.isArray(bundles)) {
			this._bundles = bundles;
		}
		else {
			throw new Error('`bundles` must be an array.');
		}
		return this._bundles;
	}

	addBundle(bundle) {
		if (!(bundle instanceof Bundle)) {
			throw new Error('`bundle` must be an instance of the Bundle class.');
		}
		const existingBundle = this.bundles.find((existingBundle) => {
			return existingBundle.element === bundle.element;
		});
		if (existingBundle) {
			this.debug('Bundle was already added.');
			return false;
		}
		this.bundles.push(bundle);
		return true;
	}

	initializeBundles() {
		let bundleElements = this.constructor.getOptionElements(this.options.elements.bundle);
		bundleElements = this.constructor.sortElementsByMostNested(bundleElements);
		console.log(bundleElements);
		
		// for (const bundleElement of bundleElements) {
		// 	this.addBundle(new Bundle({
		// 		accordion: this,
		// 		element: bundleElement
		// 	}));
		// }
	}

	debug(...messages) {
		if (this.options.debug) {
			console.log('Accordion Debug:', ...messages);
		}
	}

}

module.exports = Accordion;