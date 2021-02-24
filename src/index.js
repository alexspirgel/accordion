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
				instanceOf: Element
			},
			{
				type: 'array',
				allPropertySchema: [
					{
						type: 'string'
					},
					{
						type: 'object',
						instanceOf: Element
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
						instanceOf: Element
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
								instanceOf: Element
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
	
	constructor(options) {
		this.options = options;
		const bundleElements = this.getOptionElements(this.options.elements.bundle);
		for (const bundleElement of bundleElements) {
			this.addBundle(new Bundle({
				accordion: this,
				element: bundleElement
			}));
		}
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

	getOptionElements(option) {
		let optionValues = option;
		if (!Array.isArray(optionValues)) {
			optionValues = [optionValues];
		}
		const elementsSet = new Set();
		for (let optionValue of optionValues) {
			if (typeof optionValue === 'string') {
				let elements = document.querySelectorAll(optionValue);
				for (let element of elements) {
					elementsSet.add(element);
				}
			}
			else if (optionValue.nodeType === 1) {
				elementsSet.add(optionValue);
			}
		}
		const optionElements = Array.from(elementsSet);
		return optionElements;
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
			this.debug('Bundle already exists.');
			return false;
		}
		this.bundles.push(bundle);
		return true;
	}

	debug(...messages) {
		if (this.options.debug) {
			console.log('Accordion Debug:', ...messages);
		}
	}

}

module.exports = Accordion;