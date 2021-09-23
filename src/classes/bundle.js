module.exports = class Bundle {

	static isBundle(instance) {
		return instance instanceof this;
	}
	
	constructor(parameters) {
		this.accordion = parameters.accordion;
		this.element = parameters.element;
		if (this.options.elements.item) {
			this.addItems(this.options.elements.item);
		}
		return this;
	}

	get accordion() {
		return this._accordion;
	}

	set accordion(accordion) {
		if (typeof accordion.constructor?.isAccordion !== 'function' || !accordion.constructor.isAccordion(accordion)) {
			throw new Error(`'accordion' must be an instance of the Accordion class.`);
		}
		this._accordion = accordion;
		return accordion;
	}

	get Accordion() {
		return this.accordion.Accordion;
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
		this._element = element;
		element.setAttribute(this.Accordion.dataAttributes.elementType, 'bundle');
		return element;
	}

	filterElementsByScope(elementsInput) {
		if (!this.element) {
			throw new Error(`Cannot filter elements by scope without a defined 'this.element'.`);
		}
		let elements = this.Accordion.normalizeElements(elementsInput);
		const nestedBundleElements = this.element.querySelectorAll('[' + this.Accordion.dataAttributes.elementType + '="bundle"]');
		return this.Accordion.filterElementsByContainer(elements, this.element, nestedBundleElements);
	}

	get items() {
		if (!this._items) {
			this._items = new Set();
		}
		return this._items;
	}

	set items(items) {
		if (!(items instanceof Set)) {
			throw new Error(`'items' must be a Set.`);
		}
		if (!Array.from(items).every(this.Accordion.Item.isItem)) {
			throw new Error(`'items' must only contain Item class instances.`);
		}
		this._items = items;
		return items;
	}

	addItem(element) {
		this.accordion.dispatchEvent(this.Accordion.eventNames.addItem.before, [element]);
		try {
			const item = new this.Accordion.Item({
				bundle: this,
				element: element
			});
			this.items.add(item);
			this.accordion.dispatchEvent(this.Accordion.eventNames.addItem.after, [item]);
			return true;
		}
		catch (error) {
			if (error.code === 'already-initialized') {
				this.accordion.debug(error, element);
				return false;
			}
			else {
				throw error;
			}
		}
	}
	
	addItems(elementsInput) {
		const elements = this.filterElementsByScope(elementsInput);
		if (elements.length > 0) {
			for (const element of elements) {
				this.addItem(element);
			}
		}
		else {
			this.accordion.debug(`No elements were found when trying to add items.`);
		}
	}

	removeItem(item) {
		if (this.items.has(item)) {
			this.accordion.dispatchEvent(this.Accordion.eventNames.removeItem.before, [item]);
			this._items.delete(item);
			item.destroy();
			this.accordion.dispatchEvent(this.Accordion.eventNames.removeItem.after, [item.element]);
			return item;
		}
		else {
			this.accordion.debug(`Item to be removed was not found in the set.`);
			return false;
		}
	}

	getItemsOrderedByDOMTree() {
		const items = Array.from(this.items);
		let itemElements = items.map(item => item.element);
		if (!itemElements.every(this.Accordion.isElement)) {
			this.debug(`When ordering items by DOM tree, some items do not have elements, those without elements will be omitted from the ordered list.`);
			itemElements = itemElements.filter(this.Accordion.isElement);
		}
		if (itemElements.length < 1) {
			throw new Error(`No items have an element to order by DOM tree.`);
		}
		const orderedItemElements = this.Accordion.orderElementsByDOMTree(itemElements, 'desc');
		const orderedItems = orderedItemElements.map(itemElement => this.Accordion.dataFromElement(itemElement));
		return orderedItems;
	}

	get firstItem() {
		const items = this.getItemsOrderedByDOMTree();
		return items[0];
	}

	get lastItem() {
		const items = this.getItemsOrderedByDOMTree();
		return items[items.length - 1];
	}
	
	destroy() {
		for (const item of Array.from(this.items)) {
			item.destroy();
		}
		this.element.removeAttribute(this.Accordion.dataAttributes.elementType);
		this.accordion.removeBundle(this);
	}

};