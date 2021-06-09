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

	static get accordionItemAddTriggerEventName() {
		return 'accordionItemAddTrigger';
	}

	static get accordionItemAddTriggerEvent() {
		return new Event(this.accordionItemAddTriggerEventName);
	}

	static get accordionItemAddContentEventName() {
		return 'accordionItemAddContent';
	}

	static get accordionItemAddContentEvent() {
		return new Event(this.accordionItemAddContentEventName);
	}

	constructor(parameters) {
		super();
		this.accordionItemAddTriggerEvent = this.constructor.accordionItemAddTriggerEvent;
		this.accordionItemAddContentEvent = this.constructor.accordionItemAddContentEvent;
		this.bundle = parameters.bundle;
		this.element = parameters.element;
		const defaultOpenItemElements = this.constructor.normalizeElements(this.options.defaultOpenItems);
		this.state = 'closed';
		if (defaultOpenItemElements.includes(this.element)) {
			this.state = 'opened'
		}
		this.addContent(this.options.elements.content);
		this.addTrigger(this.options.elements.trigger);
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
		this.element.setAttribute(this.constructor.itemStateDataAttribute, state);

		if (this.trigger) {
			this.trigger.updateAriaExpanded();
		}
	}

	filterElementsByScope(elementsInput) {
		let elements = this.constructor.normalizeElements(elementsInput);
		const nestedBundleElements = this.element.querySelectorAll('[' + this.constructor.elementDataAttribute + '="bundle"]');
		return this.constructor.filterElementsByContainer(elements, this.element, nestedBundleElements);
	}

	get trigger() {
		return this._trigger;
	}

	set trigger(trigger) {
		if (!(trigger instanceof Trigger) && trigger !== undefined && trigger !== null) {
			throw new Error(`'trigger' must be a Trigger class instance, undefined, or null.`);
		}
		this._trigger = trigger;
		return this._trigger;
	}

	addTrigger(elementsInput) {
		const elements = this.filterElementsByScope(elementsInput);
		const element = elements[0];
		try {
			const trigger = new Trigger({
				item: this,
				element: element
			});
			this.trigger = trigger;
			this.element.dispatchEvent(this.accordionItemAddTriggerEvent);
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

	removeTrigger() {
		if (this.trigger) {
			this.trigger.destroy();
		}
		this.trigger = undefined;
	}

	get content() {
		return this._content;
	}

	set content(content) {
		if (!(content instanceof Content) && content !== undefined && content !== null) {
			throw new Error(`'content' must be a Content class instance, undefined, or null.`);
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
			this.element.dispatchEvent(this.accordionItemAddContentEvent);
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

	removeContent() {
		if (this.content) {
			this.content.destroy();
		}
		this.content = undefined;
	}

	get nestedBundleElements() {
		let nestedBundleElements = this.element.querySelectorAll('[' + this.constructor.elementDataAttribute + '="bundle"]');
		return Array.from(nestedBundleElements);
	}

	get nextLevelNestedBundleElements() {
		const nextLevelNestedBundleElements = this.constructor.filterElementsByContainer(this.nestedBundleElements, null, this.nestedBundleElements);
		return nextLevelNestedBundleElements;
	}

	open(skipTransition = false) {
		let existingStyleTransition = '';
		if (skipTransition) {
			existingStyleTransition = this.content.element.style.transition;
			this.content.element.style.transition = 'none';
		}
		this.state = 'opening';
		transitionAuto({
			element: this.content.element,
			innerElement: this.content.contentInner.element,
			property: 'height',
			value: 'auto',
			debug: this.options.debug,
			onComplete: () => {
				this.state = 'opened';
				if (skipTransition) {
					this.content.element.offsetWidth;
					this.content.element.style.transition = existingStyleTransition;
				}
			}
		});
		if (!this.options.multipleOpenItems) {
			if (this.bundle) {
				for (const bundleItem of this.bundle.items) {
					if (bundleItem !== this) {
						bundleItem.close(skipTransition);
					}
				}
			}
		}
	}
	
	close(skipTransition = false) {
		let existingStyleTransition = '';
		if (skipTransition) {
			existingStyleTransition = this.content.element.style.transition;
			this.content.element.style.transition = 'none';
		}
		this.state = 'closing';
		transitionAuto({
			element: this.content.element,
			innerElement: this.content.contentInner.element,
			property: 'height',
			value: 0,
			debug: this.options.debug,
			onComplete: () => {
				this.state = 'closed';
				if (skipTransition) {
					this.content.element.offsetWidth;
					this.content.element.style.transition = existingStyleTransition;
				}
				if (this.options.closeNestedItems) {
					if (this.nextLevelNestedBundleElements) {
						for (const bundleElement of this.nextLevelNestedBundleElements) {
							const bundle = bundleElement[this.constructor.elementProperty]
							for (const item of bundle.items) {
								item.close(true);
							}
						}
					}
				}
			}
		});
	}

	toggle(skipTransition = false) {
		if (this.state === 'closed' || this.state === 'closing') {
			this.open(skipTransition);
		}
		else {
			this.close(skipTransition);
		}
	}

	destroy() {
		if (this.trigger) {
			this.trigger.destroy();
		}
		if (this.content) {
			this.content.destroy();
		}
		delete this.element[this.constructor.elementProperty];
		this.element.removeAttribute(this.constructor.elementDataAttribute);
		this.element.removeAttribute(this.constructor.itemStateDataAttribute);
		this.bundle.removeItem(this);
	}

};