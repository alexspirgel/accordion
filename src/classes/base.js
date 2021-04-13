module.exports = class Base {

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
		if (order !== 'asc' && order !== 'ASC' && order !== 'desc' && order !== 'DESC') {
			throw new Error(`'order' must be 'asc' or 'desc'.`);
		}
		order = order.toLowerCase();
	
		const elementsMap = elements.map((mapElement, mapIndex) => {
			const contains = new Set();
			elements.forEach((element, index) => {
				if (mapIndex !== index) {
					if (mapElement.contains(element)) {
						contains.add(element);
					}
				}
			});
			return {
				'element': mapElement,
				'contains': contains
			};
		});
	
		elementsMap.sort((a, b) => {
			if (a.contains.size < b.contains.size) {
				if (order === 'asc') {
					return -1;
				}
				else {
					return 1;
				}
			}
			else if (a.contains.size > b.contains.size) {
				if (order === 'asc') {
					return 1;
				}
				else {
					return -1;
				}
			}
			else {
				return 0;
			}
		});
		const orderedElements = elementsMap.map((mapElement) => {
			return mapElement.element;
		});
	
		return orderedElements;
	}

	static isElementContainedBy(element, containedBy = []) {
		if (!this.isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		containedBy = this.normalizeElements(containedBy);
		for (let containedByElement of containedBy) {
			if (!containedByElement.contains(element)) {
				return false;
			}
		}
		return true;
	}

	static isElementNotContainedBy(element, notContainedBy = []) {
		if (!this.isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		notContainedBy = this.normalizeElements(notContainedBy);
		for (let notContainedByElement of notContainedBy) {
			if (notContainedByElement.contains(element)) {
				return false;
			}
		}
		return true;
	}

	static filterElementsByContainer(elements, containedBy = [], notContainedBy = []) {
		if (!Array.isArray(elements)) {
			throw new Error(`'elements' must be an array.`);
		}
		if (!elements.every(this.isElement)) {
			throw new Error(`'elements' array must only contain elements.`);
		}
		const filteredElements = elements.filter((element) => {
			let flag = true;
			if (!this.isElementContainedBy(element, containedBy)) {
				flag = false;
			}
			if (flag) {
				if (!this.isElementNotContainedBy(element, notContainedBy)) {
					flag = false;
				}
			}
			return flag;
		});
		return filteredElements;
	}

	static get elementProperty() {
		return 'accordionElement';
	}

	static get elementDataAttribute() {
		return 'data-accordion';
	}

	static isElementInitialized(element) {
		if (element[this.elementProperty] !== undefined && element.hasAttribute(this.elementDataAttribute)) {
			return true;
		}
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