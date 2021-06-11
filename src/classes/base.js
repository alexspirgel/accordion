module.exports = class Base {

	static get elementProperty() {
		return 'accordion';
	}

	static get elementDataAttribute() {
		return 'data-accordion';
	}

	static isInstanceOfThis(instance) {
		return instance instanceof this;
	}

	static isElement(element) {
		if (element instanceof Element) {
			return true;
		}
		else {
			return false;
		}
	}

	static isElementInitialized(element) {
		if (element[this.elementProperty] !== undefined && element.hasAttribute(this.elementDataAttribute)) {
			return true;
		}
	}

	static normalizeElements(inputValue, elementsSet = new Set()) {
		if (Array.isArray(inputValue) || inputValue instanceof NodeList) {
			for (let value of inputValue) {
				this.normalizeElements(value, elementsSet);
			}
		}
		else if (typeof inputValue === 'string') {
			let elements = document.querySelectorAll(inputValue);
			this.normalizeElements(elements, elementsSet);
		}
		else if (this.isElement(inputValue)) {
			elementsSet.add(inputValue);
		}
		const optionElements = Array.from(elementsSet);
		return optionElements;
	}

	static orderElementsByDOMTree(elements, order = 'asc') {
		if (!Array.isArray(elements)) {
			throw new Error(`'elements' must be an array.`);
		}
		if (!elements.every(this.isElement)) {
			throw new Error(`'elements' array must only contain elements.`);
		}
		order = order.toLowerCase();
		if (order !== 'asc' && order !== 'desc') {
			throw new Error(`'order' must be 'asc' or 'desc'.`);
		}
		const temporaryClass = 'orderElementsByDOMTree-' + Date.now().toString();
		for (const element of elements) {
			element.classList.add(temporaryClass);
		}
		const orderedElements = Array.from(document.querySelectorAll('.' + temporaryClass));
		for (const element of elements) {
			element.classList.remove(temporaryClass);
		}
		if (order === 'asc') {
			orderedElements.reverse();
		}
		return orderedElements;
	}

	static isElementContainedBy(element, containedByElementsInput = [], operator = 'and') {
		if (!this.isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		const containedByElements = this.normalizeElements(containedByElementsInput);
		if (typeof operator !== 'string') {
			throw new Error(`'operator' must be a string.`);
		}
		operator = operator.toLowerCase();
		if (operator !== 'and' && operator !== 'or') {
			throw new Error(`'operator' must be 'and' or 'or'.`);
		}
		let flag = false;
		for (const containedByElement of containedByElements) {
			if (containedByElement.contains(element) && containedByElement !== element) {
				flag = true;
				if (operator === 'or') {
					break;
				}
			}
			else {
				flag = false;
				if (operator === 'and') {
					break;
				}
			}
		}
		return flag;
	}

	static isElementNotContainedBy(element, notContainedByElementsInput = [], operator = 'and') {
		if (typeof operator !== 'string') {
			throw new Error(`'operator' must be a string.`);
		}
		operator = operator.toLowerCase();
		if (operator === 'and') {
			return !this.isElementContainedBy(element, notContainedByElementsInput, 'or');
		}
		else if (operator === 'or') {
			return !this.isElementContainedBy(element, notContainedByElementsInput, 'and');
		}
		else {
			throw new Error(`'operator' must be 'and' or 'or'.`);
		}
	}

	static filterElementsByContainer(elements, containedBy = [], notContainedBy = [], operator = 'and') {
		if (!Array.isArray(elements)) {
			throw new Error(`'elements' must be an array.`);
		}
		if (!elements.every(this.isElement)) {
			throw new Error(`'elements' array must only contain elements.`);
		}
		const filteredElements = elements.filter((element) => {
			let flag = true;
			if (containedBy) {
				if (!this.isElementContainedBy(element, containedBy, operator)) {
					flag = false;
				}
			}
			if (notContainedBy) {
				if (flag) {
					if (!this.isElementNotContainedBy(element, notContainedBy, operator)) {
						flag = false;
					}
				}
			}
			return flag;
		});
		return filteredElements;
	}

	constructor() {}

	debug(...messages) {
		try {
			if (this.options.debug) {
				console.log('Accordion Debug:', ...messages);
			}
		}
		catch(error) {
			// suppress
		}
	}

	accessibilityWarn(...messages) {
		try {
			if (this.options.accessibilityWarnings) {
				console.warn('Accordion Accessibility Warning:', ...messages);
			}
		}
		catch(error) {
			// suppress
		}
	}

};