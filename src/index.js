const extend = require('@alexspirgel/extend');
const Schema = require('@alexspirgel/schema');

const Accordion = class {

	static get optionsSchema () {
		const selectorsModel = [
			{
				type: 'string'
			},
			{
				type: 'array',
				allPropertySchema: {
					type: 'string'
				}
			}
		];

		const optionsModel = {
			type: 'object',
			propertySchema: {
				selectors: {
					type: 'object',
					propertySchema: {
						accordion: selectorsModel,
						item: selectorsModel,
						itemTrigger: selectorsModel,
						heading: selectorsModel,
						content: selectorsModel,
						contentInner: selectorsModel
					}
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
				callbacks: {
					type: 'object',
					propertySchema: {
						item: {
							type: 'object',
							propertySchema: {
								initialize: {
									type: 'object',
									propertySchema: {
										before: {
											type: 'function'
										},
										after: {
											type: 'function'
										}
									}
								},
								open: {
									type: 'object',
									propertySchema: {
										before: {
											type: 'function'
										},
										after: {
											type: 'function'
										}
									}
								},
								close: {
									type: 'object',
									propertySchema: {
										before: {
											type: 'function'
										},
										after: {
											type: 'function'
										}
									}
								}
							}
						}
					}
				},
				debug: {
					type: 'boolean'
				}
			}
		};

		return new Schema(optionsModel);
	}

	static get optionsDefault() {
		return {
			selectors: {
				accordion: '.accordion',
				item: '.accordion__item',
				itemTrigger: '.accordion__item',
				heading: '.accordion__heading',
				content: '.accordion__content',
				contentInner: '.accordion__content-inner'
			},
			closeNestedItems: false,
			defaultOpenItems: null,
			inlineStyles: true,
			multipleOpenItems: true,
			openAnchoredItems: true,
			callbacks: {
				item: {
					initialize: {
						before: null,
						after: null
					},
					open: {
						before: null,
						after: null
					},
					close: {
						before: null,
						after: null
					}
				}
			},
			debug: false
		};
	}

	constructor(optionsUser) {
		try {
			this.constructor.optionsSchema.validate(optionsUser);
			this.options = extend({}, this.constructor.optionsDefault, optionsUser);
			if (this.options.debug) {
				this.console('log', this);
			}
			return this;
		}
		catch (error) {
			this.console('error', error);
		}
	}

	console(type, message) {
		const logPrefix = 'Accordion: ';
		console[type](logPrefix, message);
	}

	destroy() {}

};

module.exports = Accordion;