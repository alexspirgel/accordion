const Base = require('./base.js');
const CodedError = require('./coded-error.js');
const Trigger = require('./trigger.js');
const Content = require('./content.js');
const transitionAuto = require('@alexspirgel/transition-auto');

module.exports = class Item extends Base {

	static get itemStateDataAttribute() {
		return 'data-accordion-item-state';
	}

	static get availableStates() {
		return [
			'closed',
			'closing',
			'opened',
			'opening'
		];
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
		this.addContent(this.options.elements.content);
		this.addTriggers(this.options.elements.trigger);
		return this;
	}

	get bundle() {
		return this._bundle;
	}

	set bundle(bundle) {
		if (!(bundle instanceof require('./bundle.js'))) {
			throw new Error(`'bundle' must be an instance of the Bundle class.`);
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
			throw new Error(`'element' must be an element.`);
		}
		if (this.constructor.isElementInitialized(element)) {
			throw new CodedError('already-initialized', `'element' already exists as part of an accordion.`);
		}
		element[this.constructor.elementProperty] = this;
		element.setAttribute(this.constructor.elementDataAttribute, 'item');
		this._element = element;
		const defaultOpenItemElements = this.constructor.normalizeElements(this.options.defaultOpenItems);
		let state = 'closed';
		if (defaultOpenItemElements.includes(element)) {
			state = 'opened'
		}
		this.state = state;
		return this._element;
	}

	get count() {
		if (typeof this._count !== 'number') {
			this._count = this.constructor.instanceCountIncrement();
		}
		return this._count;
	}

	get state() {
		return this.element.getAttribute(this.constructor.itemStateDataAttribute);
	}

	set state(state) {
		if (!this.constructor.availableStates.includes(state)) {
			throw new Error(`'state' must be an available state. Available states include: ${this.constructor.availableStates.join(', ')}.`);
		}
		return this.element.setAttribute(this.constructor.itemStateDataAttribute, state);
	}

	filterElementsByScope(elementsInput) {
		let elements = this.constructor.normalizeElements(elementsInput);
		const nestedBundleElements = this.element.querySelectorAll('[' + this.constructor.elementDataAttribute + '="bundle"]');
		return this.constructor.filterElementsByContainer(elements, this.element, nestedBundleElements);
	}

	get triggers() {
		if (!this._triggers) {
			this._triggers = [];
		}
		return this._triggers;
	}

	set triggers(triggers) {
		if (!Array.isArray(triggers)) {
			throw new Error(`'triggers' must be an array.`);
		}
		if (!triggers.every(Trigger.isInstanceOfThis)) {
			throw new Error(`'triggers' must only contain Trigger class instances.`);
		}
		this._triggers = triggers;
		return this._triggers;
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
			if (error.code === 'already-initialized') {
				this.debug(error, element);
				return false;
			}
			else {
				throw error;
			}
		}
	}

	addTriggers(elementsInput) {
		const elements = this.filterElementsByScope(elementsInput);
		for (const element of elements) {
			this.addTrigger(element);
		}
	}

	get content() {
		return this._content;
	}

	set content(content) {
		if (!(content instanceof Content)) {
			throw new Error(`'content' must be a Content class instance.`);
		}
		this._content = content;
		return this._content;
	}

	addContent(elementsInput) {
		const elements = this.filterElementsByScope(elementsInput);
		const element = elements[0];
		try {
			const content = new Content({
				item: this,
				element: element
			});
			this.content = content;
			return true;
		}
		catch (error) {
			if (error.code = 'already-initialized') {
				this.debug(error, element);
				return false;
			}
			else {
				throw error;
			}
		}

	}

	open() {
		transitionAuto({
			element: this.content.element,
			innerElement: this.content.contentInner.element,
			property: 'height',
			value: 'auto',
			onComplete: () => {
				this.state = 'opened';
			}
		});
		this.state = 'opening';
	}
	
	close() {
		transitionAuto({
			element: this.content.element,
			innerElement: this.content.contentInner.element,
			property: 'height',
			value: 0,
			onComplete: () => {
				this.state = 'closed';
			}
		});
		this.state = 'closing';
	}

	toggle() {
		if (this.state === 'closed' || this.state === 'closing') {
			this.open();
		}
		else {
			this.close();
		}
	}

};