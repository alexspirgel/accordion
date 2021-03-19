module.exports = class Base {

	static get dataAttribute() {
		return '';
	}

	static isInstanceOfThis(instance) {
		return instance instanceof this;
	}

	static isElementInitialized(element) {
		return element.hasAttribute(this.dataAttribute);
	}
	
	static isElement(element) {
		if (element instanceof Element && element.nodeType === 1) {
			return true;
		}
		else {
			return false;
		}
	}

	static getElementsFromInput(inputValue, elementsSet = new Set()) {
		if (Array.isArray(inputValue) || inputValue instanceof NodeList) {
			for (let value of inputValue) {
				this.getElementsFromInput(value, elementsSet);
			}
		}
		else if (typeof inputValue === 'string') {
			let elements = document.querySelectorAll(inputValue);
			this.getElementsFromInput(elements, elementsSet);
		}
		else if (this.isElement(inputValue)) {
			elementsSet.add(inputValue);
		}
		const optionElements = Array.from(elementsSet);
		return optionElements;
	}

	static filterElementsByContainers(elements, containedBy = [], notContainedBy = []) {
		if (!Array.isArray(elements)) {
			throw new Error('`elements` must be an array.');
		}
		if (!elements.every(this.isElement)) {
			throw new Error('`elements` array must only contain elements.');
		}
		containedBy = this.getElementsFromInput(containedBy);
		notContainedBy = this.getElementsFromInput(notContainedBy);
		const filteredElements = [];
		for (let element of elements) {
			let keep = true;
			for (let containedByElement of containedBy) {
				if (!containedByElement.contains(element)) {
					keep = false;
					break;
				}
			}
			if (keep) {
				for (let notContainedByElement of notContainedBy) {
					if (notContainedByElement.contains(element)) {
						keep = false;
						break;
					}
				}
			}
			if (keep) {
				filteredElements.push(element);
			}
		}
		return filteredElements;
	}

	static sortElementsByMostNestedFirst(elements) {
		if (!Array.isArray(elements)) {
			throw new Error('`elements` must be an array.');
		}
		if (!elements.every(this.isElement)) {
			throw new Error('`elements` array must only contain elements.');
		}
		const elementsMapContainedElements = elements.map((mapElement, mapIndex) => {
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
		elementsMapContainedElements.sort((a, b) => {
			if (a.contains.size < b.contains.size) {
				return -1;
			}
			else if (a.contains.size > b.contains.size) {
				return 1;
			}
			else {
				return 0;
			}
		});
		const sortedElements = elementsMapContainedElements.map((mapElement) => {
			return mapElement.element;
		});
		return sortedElements;
	}

	constructor() {}

	get options() {
		return {};
	}

	debug(...messages) {
		if (this.options.debug) {
			console.log('Accordion Debug:', ...messages);
		}
	}

};