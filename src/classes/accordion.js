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

	static getElementsFromInput(inputValue, elementsSet = new Set()) {
		if (Array.isArray(inputValue)) {
			for (let value of inputValue) {
				this.getElementsFromInput(value, elementsSet);
			}
		}
		else if (typeof inputValue === 'string') {
			let elements = document.querySelectorAll(inputValue);
			this.getElementsFromInput(elements, elementsSet);
		}
		else if (inputValue instanceof NodeList) {
			for (let element of inputValue) {
				this.getElementsFromInput(element, elementsSet);
			}
		}
		else if (inputValue instanceof Element && inputValue.nodeType === 1) {
			elementsSet.add(inputValue);
		}
		const optionElements = Array.from(elementsSet);
		return optionElements;
	}

	static filterElementsByContainers(elements, containedBy = [], notContainedBy = []) {
		if (!Array.isArray(elements)) {
			throw new Error('`elements` must be an array.');
		}
		if (!elements.every(this.isElement)) {
			throw new Error('`elements` array must only contain elements.');
		}
		if (!this.isElement(containedBy) && !Array.isArray(containedBy)) {
			throw new Error('`containedBy` must be an element or an array.');
		}
		if (Array.isArray(containedBy)) {
			if (!containedBy.every(this.isElement)) {
				throw new Error('`containedBy` array must only contain elements.');
			}
		}
		else {
			containedBy = [containedBy];
		}
		if (!this.isElement(notContainedBy) && !Array.isArray(notContainedBy)) {
			throw new Error('`notContainedBy` must be an element or an array.');
		}
		if (Array.isArray(notContainedBy)) {
			if (!notContainedBy.every(this.isElement)) {
				throw new Error('`notContainedBy` array must only contain elements.');
			}
		}
		else {
			notContainedBy = [notContainedBy];
		}
		const filteredElements = [];
		for (let element of elements) {
			let keep = true;
			for (let containedByElement of containedBy) {
				if (!containedByElement.contains(element)) {
					keep = false;
					break;
				}
			}
			if (keep) {
				for (let notContainedByElement of notContainedBy) {
					if (notContainedByElement.contains(element)) {
						keep = false;
						break;
					}
				}
			}
			if (keep) {
				filteredElements.push(element);
			}
		}
		return filteredElements;
	}

	static sortElementsByMostNestedFirst(elements) {
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
		if (!Array.isArray(bundles)) {
			throw new Error('`bundles` must be an array.');
		}
		if (!bundles.every(Bundle.isBundle(bundle))) {
			throw new Error('`bundles` must only contain Bundle class instances.');
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
			this.bundles.push(bundle);
			return true;
		}
		catch (error) {
			if (error.code = 'bundle-exists') {
				this.debug(error, element);
				return false;
			}
			else {
				throw error;
			}
		}
	}

	addBundles(elements) {
		if (!Array.isArray(elements) && !(elements instanceof NodeList)) {
			throw new Error('`elements` must be an array or node list.');
		}
		if (elements instanceof NodeList) {
			elements = Array.from(elements);
		}
		elements = this.constructor.sortElementsByMostNestedFirst(elements);
		for (const element of elements) {
			this.addBundle(element);
		}
	}

	initializeBundles() {
		let elements = this.constructor.getElementsFromInput(this.options.elements.bundle);
		this.addBundles(elements);
	}

	destroy() {}

	debug(...messages) {
		if (this.options.debug) {
			console.log('Accordion Debug:', ...messages);
		}
	}

}

module.exports = Accordion;