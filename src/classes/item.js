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

	static get accordionItemAddContentEventName() {
		return 'accordionItemAddContent';
	}

	constructor(parameters) {
		super();
		this.accordionItemAddTriggerEvent = new Event(this.constructor.accordionItemAddTriggerEventName);
		this.accordionItemAddContentEvent = new Event(this.constructor.accordionItemAddContentEventName);
		this.bundle = parameters.bundle;
		this.element = parameters.element;
		const defaultOpenItemElements = this.constructor.normalizeElements(this.options.defaultOpenItems);
		this.state = 'closed';
		if (defaultOpenItemElements.includes(this.element)) {
			this.state = 'opened'
		}
		if (this.options.elements.content) {
			this.addContent(this.options.elements.content);
		}
		if (this.options.elements.trigger) {
			this.addTrigger(this.options.elements.trigger);
		}
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
		if (elements.length > 0) {
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
		else {
			this.debug(`No element was found when trying to add trigger.`);
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
		if (elements.length > 0) {
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
		else {
			this.debug(`No element was found when trying to add content.`);
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
		const nestedBundleElements = this.nestedBundleElements;
		const nextLevelNestedBundleElements = this.constructor.filterElementsByContainer(nestedBundleElements, null, nestedBundleElements);
		return nextLevelNestedBundleElements;
	}

	getNextPreviousItem(nextPrevious) {
		if (typeof nextPrevious !== 'string') {
			throw new Error(`'nextPrevious' must be a string.`);
		}
		nextPrevious = nextPrevious.toLowerCase();
		if (nextPrevious !== 'next' && nextPrevious !== 'previous') {
			throw new Error(`'nextPrevious' must be 'next' or 'previous'.`);
		}
		let returnItem;
		const items = Array.from(this.bundle.items);
		const itemElements = items.map(item => item.element);
		const orderedItemElements = this.constructor.orderElementsByDOMTree(itemElements, 'desc');
		const orderedItems = orderedItemElements.map(itemElement => itemElement[this.constructor.elementProperty]);
		const indexModifier = (nextPrevious === 'next') ? 1 : -1;
		const indexWrapValue = (nextPrevious === 'next') ? 0 : (orderedItems.length - 1);
		const thisIndex = orderedItems.indexOf(this);
		if (thisIndex >= 0) {
			let returnItemIndex = thisIndex + indexModifier;
			if (returnItemIndex < 0 || returnItemIndex >= orderedItems.length) {
				returnItemIndex = indexWrapValue
			}
			if (orderedItems[returnItemIndex]) {
				returnItem = orderedItems[returnItemIndex]
			}
		}
		return returnItem;
	}

	get nextItem() {
		return this.getNextPreviousItem('next');
	}

	get previousItem() {
		return this.getNextPreviousItem('previous');
	}

	open(skipTransition = false) {
		if (!this.content.element) {
			this.debug(`Item cannot open, missing content element.`);
			return false;
		}
		if (!this.content.contentInner.element) {
			this.debug(`Item cannot open, missing content inner element.`);
			return false;
		}
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
					this.content.element.offsetWidth; // force update
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
		if (!this.content.element) {
			this.debug(`Item cannot close, missing content element.`);
			return false;
		}
		if (!this.content.contentInner.element) {
			this.debug(`Item cannot close, missing content inner element.`);
			return false;
		}
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
					this.content.element.offsetWidth; // force update
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