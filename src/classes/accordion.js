const Base = require('./base.js');
const extend = require('@alexspirgel/extend');
const Schema = require('@alexspirgel/schema');
const Bundle = require('./bundle.js');

module.exports = class Accordion extends Base {

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
	
	constructor(options) {
		super();
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
		if (!bundles.every(Bundle.isInstanceOfThis)) {
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

};