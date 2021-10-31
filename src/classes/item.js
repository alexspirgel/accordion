module.exports = class Item {

	static isItem(instance) {
		return instance instanceof this;
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
		this.bundle = parameters.bundle;
		this.element = parameters.element;
		const defaultOpenItemElements = this.Accordion.normalizeElements(this.options.defaultOpenItems);
		this.state = 'closed';
		if (defaultOpenItemElements.includes(this.element)) {
			this.state = 'opened';
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
		if (typeof bundle.constructor.isBundle !== 'function' || !bundle.constructor.isBundle(bundle)) {
			throw new Error(`'bundle' must be an instance of the Bundle class.`);
		}
		this._bundle = bundle;
		return bundle;
	}

	get accordion() {
		return this.bundle.accordion;
	}

	get Accordion() {
		return this.bundle.Accordion;
	}

	get options() {
		return this.accordion.options;
	}

	get element() {
		return this._element;
	}
	
	set element(element) {
		if (!this.Accordion.isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		if (this.Accordion.isElementInitialized(element)) {
			throw new this.Accordion.CodedError('already-initialized', `'element' already exists as part of an accordion.`);
		}
		element.setAttribute(this.Accordion.dataAttributes.elementType, 'item');
		this._element = element;
		return element;
	}

	get count() {
		if (typeof this._count !== 'number') {
			this._count = this.constructor.instanceCountIncrement();
		}
		return this._count;
	}

	get state() {
		return this.element.getAttribute(this.Accordion.dataAttributes.itemState);
	}

	set state(state) {
		if (!this.constructor.availableStates.includes(state)) {
			throw new Error(`'state' must be an available state. Available states include: ${this.constructor.availableStates.join(', ')}.`);
		}
		this.element.setAttribute(this.Accordion.dataAttributes.itemState, state);
		if (this.trigger) {
			this.trigger.updateAriaExpanded();
		}
	}

	filterElementsByScope(elementsInput) {
		let elements = this.Accordion.normalizeElements(elementsInput);
		const nestedBundleElements = this.element.querySelectorAll('[' + this.Accordion.dataAttributes.elementType + '="bundle"]');
		return this.Accordion.filterElementsByContainer(elements, this.element, nestedBundleElements);
	}

	get trigger() {
		return this._trigger;
	}

	set trigger(trigger) {
		if (!(trigger instanceof Accordion.Trigger) && trigger !== undefined && trigger !== null) {
			throw new Error(`'trigger' must be a Trigger class instance, undefined, or null.`);
		}
		this._trigger = trigger;
		return trigger;
	}

	addTrigger(elementsInput) {
		const elements = this.filterElementsByScope(elementsInput);
		if (elements.length > 0) {
			const element = elements[0];
			this.accordion.dispatchEvent(this.Accordion.eventNames.addTrigger.before, [element]);
			try {
				const trigger = new this.Accordion.Trigger({
					item: this,
					element: element
				});
				this.trigger = trigger;
				this.accordion.dispatchEvent(this.Accordion.eventNames.addTrigger.after, [trigger]);
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
			this.accordion.dispatchEvent(this.Accordion.eventNames.removeTrigger.before, [this.trigger]);
			this.trigger.destroy();
			this.accordion.dispatchEvent(this.Accordion.eventNames.removeTrigger.after, [this.trigger.element]);
		}
		this.trigger = undefined;
	}

	get content() {
		return this._content;
	}

	set content(content) {
		if (!(content instanceof Accordion.Content) && content !== undefined && content !== null) {
			throw new Error(`'content' must be a Content class instance, undefined, or null.`);
		}
		this._content = content;
		return content;
	}

	addContent(elementsInput) {
		const elements = this.filterElementsByScope(elementsInput);
		if (elements.length > 0) {
			const element = elements[0];
			this.accordion.dispatchEvent(this.Accordion.eventNames.addContent.before, [element]);
			try {
				const content = new this.Accordion.Content({
					item: this,
					element: element
				});
				this.content = content;
				this.accordion.dispatchEvent(this.Accordion.eventNames.addContent.after, [content]);
				return true;
			}
			catch (error) {
				if (error.code = 'already-initialized') {
					this.accordion.debug(error, element);
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
			this.accordion.dispatchEvent(this.Accordion.eventNames.removeContent.before, [this.content]);
			this.content.destroy();
			this.accordion.dispatchEvent(this.Accordion.eventNames.removeContent.after, [this.content.element]);
		}
		this.content = undefined;
	}

	get nestedBundleElements() {
		if (this.element) {
			let nestedBundleElements = this.element.querySelectorAll('[' + this.Accordion.dataAttributes.elementType + '="bundle"]');
			return Array.from(nestedBundleElements);
		}
	}

	get nextLevelNestedBundleElements() {
		const nestedBundleElements = this.nestedBundleElements;
		if (nestedBundleElements) {
			const nextLevelNestedBundleElements = this.Accordion.filterElementsByContainer(nestedBundleElements, null, nestedBundleElements);
			return nextLevelNestedBundleElements;
		}
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
		const itemMappedElements = items.map(item => item.element);
		const itemElements = itemMappedElements.filter(this.Accordion.isElement);
		const orderedItemElements = this.Accordion.orderElementsByDOMTree(itemElements, 'desc');
		const orderedItems = orderedItemElements.map(itemElement => this.Accordion.dataFromElement(itemElement));
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

		if (!this.content) {
			this.debug(`Item cannot open, missing content.`);
			return false;
		}
		if (!this.content.element) {
			this.debug(`Item cannot open, missing content element.`);
			return false;
		}
		if (!this.content.contentInner) {
			this.debug(`Item cannot open, missing content inner.`);
			return false;
		}
		if (!this.content.contentInner.element) {
			this.debug(`Item cannot open, missing content inner element.`);
			return false;
		}

		this.accordion.dispatchEvent(this.Accordion.eventNames.openItem.before, [this]);

		if (!this.options.multipleOpenItems) {
			if (this.bundle) {
				for (const bundleItem of this.bundle.items) {
					if (bundleItem !== this) {
						bundleItem.close(skipTransition);
					}
				}
			}
		}

		let existingStyleTransition = '';
		if (skipTransition) {
			existingStyleTransition = this.content.element.style.transition;
			this.content.element.style.transition = 'none';
		}
		this.state = 'opening';
		this.Accordion.transitionAuto({
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
				this.accordion.dispatchEvent(this.Accordion.eventNames.openItem.after, [this]);
			}
		});

	}
	
	close(skipTransition = false) {

		if (!this.content) {
			this.debug(`Item cannot close, missing content.`);
			return false;
		}
		if (!this.content.element) {
			this.debug(`Item cannot close, missing content element.`);
			return false;
		}
		if (!this.content.contentInner) {
			this.debug(`Item cannot close, missing content inner.`);
			return false;
		}
		if (!this.content.contentInner.element) {
			this.debug(`Item cannot close, missing content inner element.`);
			return false;
		}

		this.accordion.dispatchEvent(this.Accordion.eventNames.closeItem.before, [this]);

		let existingStyleTransition = '';
		if (skipTransition) {
			existingStyleTransition = this.content.element.style.transition;
			this.content.element.style.transition = 'none';
		}
		this.state = 'closing';
		this.Accordion.transitionAuto({
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
				this.accordion.dispatchEvent(this.Accordion.eventNames.closeItem.after, [this]);
				if (this.options.closeNestedItems) {
					if (this.nextLevelNestedBundleElements) {
						for (const bundleElement of this.nextLevelNestedBundleElements) {
							const bundle = this.Accordion.dataFromElement(bundleElement);
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
		this.element.removeAttribute(this.Accordion.dataAttributes.elementType);
		this.element.removeAttribute(this.Accordion.dataAttributes.itemState);
		this.bundle.removeItem(this);
	}

};