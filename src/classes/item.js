const Base = require('./base.js');
const CodedError = require('./coded-error.js');
const Trigger = require('./trigger.js');

module.exports = class Item extends Base {

	static get dataAttribute() {
		return 'data-accordion-item';
	}

	static get instanceCount() {
		if (typeof this._instanceCount !== 'number') {
			this._instanceCount = 0;
		}
		return this._instanceCount;
	}

	static set instanceCount(count) {
		if (typeof count !== 'number') {
			throw('`instanceCount` must be a number.');
		}
		else {
			return this._instanceCount = count;
		}
	}

	static instanceCountIncrement() {
		return this.instanceCount = this.instanceCount + 1;
	}

	constructor(parameters) {
		super();
		this.bundle = parameters.bundle;
		this.element = parameters.element;
		if (this.constructor.isElementInitialized(this.element)) {
			throw new CodedError('item-exists', 'An item already exists for this element.');
		}
		this.id = this.constructor.instanceCountIncrement();
		this.element.setAttribute(this.constructor.dataAttribute, '');
		this.initializeTriggers();
		return this;
	}

	get bundle() {
		return this._bundle;
	}

	set bundle(bundle) {
		if (!(bundle instanceof require('./bundle.js'))) {
			throw new Error('`bundle` must be an instance of the Bundle class.');
		}
		this._bundle = bundle;
	}

	get options() {
		return this.bundle.accordion.options;
	}

	get element() {
		return this._element;
	}

	set element(element) {
		if (!this.constructor.isElement(element)) {
			throw new Error('`element` must be an element.');
		}
		this._element = element;
		return this._element;
	}

	get triggers() {
		if (!this._triggers) {
			this._triggers = [];
		}
		return this._triggers;
	}

	set triggers(triggers) {
		if (!Array.isArray(triggers)) {
			throw new Error('`triggers` must be an array.');
		}
		if (!triggers.every(Trigger.isInstanceOfThis)) {
			throw new Error('`triggers` must only contain Trigger class instances.');
		}
		this._triggers = triggers;
		return this._bundles;
	}

	addTrigger(element) {
		try {
			const trigger = new Trigger({
				item: this,
				element: element
			});
			this.triggers.push(trigger);
			return true;
		}
		catch (error) {
			if (error.code = 'trigger-exists') {
				this.debug(error, element);
				return false;
			}
			else {
				throw error;
			}
		}
	}

	addTriggers(elements) {
		if (!Array.isArray(elements) && !(elements instanceof NodeList)) {
			throw new Error('`elements` must be an array or node list.');
		}
		if (elements instanceof NodeList) {
			elements = Array.from(elements);
		}
		for (const element of elements) {
			this.addTrigger(element);
		}
	}

	initializeTriggers() {
		let elements = this.constructor.getElementsFromInput(this.options.elements.trigger);
		const nestedBundles = this.element.querySelectorAll('[' + this.bundle.constructor.dataAttribute + ']');
		elements = this.constructor.filterElementsByContainers(elements, this.element, nestedBundles);
		this.addTriggers(elements);
	}

};