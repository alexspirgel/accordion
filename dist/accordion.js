/*!
 * accordion v3.0.0
 * https://github.com/alexspirgel/accordion
 */
var Accordion;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 683:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const isPlainObject = __webpack_require__(605);

function isElement(value) {
	if (typeof value === 'object' &&
	value !== null &&
	value.nodeType === 1 &&
	!isPlainObject(value)) {
		return true;
	}
	return false;
}

module.exports = isElement;

/***/ }),

/***/ 605:
/***/ ((module) => {

function isPlainObject(value) {
	if (typeof value !== 'object' ||
	value === null ||
	Object.prototype.toString.call(value) !== '[object Object]') {
		return false;
	}
	if (Object.getPrototypeOf(value) === null) {
    return true;
  }
	let prototype = value;
  while (Object.getPrototypeOf(prototype) !== null) {
    prototype = Object.getPrototypeOf(prototype);
  }
  return Object.getPrototypeOf(value) === prototype;
}

module.exports = isPlainObject;

/***/ }),

/***/ 364:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const isElement = __webpack_require__(683);

function normalizeElements(inputValue, elementsSet = new Set()) {
	if (Array.isArray(inputValue) || inputValue instanceof NodeList) {
		for (let value of inputValue) {
			normalizeElements(value, elementsSet);
		}
	}
	else if (typeof inputValue === 'string') {
		let elements = document.querySelectorAll(inputValue);
		normalizeElements(elements, elementsSet);
	}
	else if (isElement(inputValue)) {
		elementsSet.add(inputValue);
	}
	const optionElements = Array.from(elementsSet);
	return optionElements;
}

module.exports = normalizeElements;

/***/ }),

/***/ 662:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ObjectManager = __webpack_require__(160);
const isElement = __webpack_require__(683);
const normalizeElements = __webpack_require__(364);
const Bundle = __webpack_require__(768);

module.exports = class Accordion {

	static isAccordion(accordion) {
		return (accordion instanceof this);
	}

	static get accordions() {
		if (!Array.isArray(this._accordions)) {
			this._accordions = [];
		}
		return this._accordions;
	}

	static set accordions(accordions) {
		if (!Array.isArray(accordions)) {
			throw new Error(`'accordions' must be an array.`);
		}
		if (!accordions.every(this.isAccordion)) {
			throw new Error(`'accordions' must only contain instances of Accordion.`);
		}
		this._accordions = accordions;
	}

	static addAccordion(accordion) {
		if (!this.isAccordion(accordion)) {
			throw new Error(`'accordion' must be an accordion.`);
		}
		if (this.accordions.includes(accordion)) {
			throw new Error(`'accordion' already exists in the array of accordions.`);
		}
		this.accordions.push(accordion);
	}

	static removeAccordion(accordion) {
		const accordionIndex = this.accordions.indexOf(accordion);
		if (accordionIndex >= 0) {
			this.accordions.splice(accordionIndex, 1);
		}
	}

	static getAccordionObject(element) {
		for (const accordion of this.accordions) {
			for (const bundle of accordion.bundles) {
				if (element === bundle.element) {
					return bundle;
				}
				for (const item of bundle.items) {
					if (element === item.element) {
						return item;
					}
					if (item.header) {
						if (element === item.header.element) {
							return item.header;
						}
					}
					if (item.panel) {
						if (element === item.panel.element) {
							return item.panel;
						}
						if (item.panel.panelInner) {
							if (element === item.panel.panelInner.element) {
								return item.panel.panelInner;
							}
						}
					}
				}
			}
		}
	}

	static removeExistingAccordionObjectElementsFromArray(elements) {
		if (!Array.isArray(elements)) {
			throw new Error(`'elements' must be an array.`);
		}
		elements = elements.filter((element) => {
			if (!this.getAccordionObject(element)) {
				return true;
			}
		});
		return elements;
	}

	static getNestedBundles(element) {
		if (!isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		const nestedBundles = [];
		for (const accordion of this.accordions) {
			for (const bundle of accordion.bundles) {
				if (isElement(bundle.element) && element.contains(bundle.element) && element !== bundle.element) {
					nestedBundles.push(bundle);
				}
			}
		}
		return nestedBundles;
	}

	static isElementContainedBy(element, containedByElementsInput = [], operator = 'and') {
		if (!isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		const containedByElements = normalizeElements(containedByElementsInput);
		if (typeof operator !== 'string') {
			throw new Error(`'operator' must be a string.`);
		}
		operator = operator.toLowerCase();
		if (operator !== 'and' && operator !== 'or') {
			throw new Error(`'operator' must be 'and' or 'or'.`);
		}
		let isContainedBy = false;
		for (const containedByElement of containedByElements) {
			if (containedByElement.contains(element) && containedByElement !== element) {
				isContainedBy = true;
				if (operator === 'or') {
					break;
				}
			}
			else {
				isContainedBy = false;
				if (operator === 'and') {
					break;
				}
			}
		}
		return isContainedBy;
	}

	static get defaultOptions() {
		return {
			selectors: {
				bundle: undefined,
				item: undefined,
				header: undefined,
				panel: undefined,
				panelInner: undefined
			},
			defaultOpenItems: undefined,
			accessibilityWarnings: true,
			closeNestedItems: false,
			multipleOpenItems: true,
			openAnchoredItems: true,
			dataAttributes: {
				elementType: 'data-accordion',
				itemState: 'data-accordion-state',
			},
			debug: false
		};
	}

	static get optionsValidation() {
		const validateSelector = ({value, pathId}) => {
			if (typeof value !== 'string' && typeof value !== 'undefined') {
				throw new Error(`'${pathId}' must be a string or undefined.`);
			}
		};
		const validateBoolean = ({value, pathId}) => {
			if (typeof value !== 'boolean') {
				throw new Error(`'${pathId}' must be a boolean.`);
			}
		};
		const validateString = ({value, pathId}) => {
			if (typeof value !== 'string') {
				throw new Error(`'${pathId}' must be a string.`);
			}
		};
		return {
			'selectors': ({value, pathId}) => {
				if ((typeof value !== 'object' || value === null) && typeof value !== 'undefined') {
					throw new Error(`'${pathId}' must be an object or undefined.`);
				}
			},
			'selectors.bundle': validateSelector,
			'selectors.item': validateSelector,
			'selectors.header': validateSelector,
			'selectors.panel': validateSelector,
			'selectors.panelInner': validateSelector,
			'defaultOpenItems': ({value, pathId}) => {
				if (typeof value !== 'number'
				&& typeof value !== 'string'
				&& (typeof value !== 'object' || value === null)
				&& typeof value !== 'undefined') {
					throw new Error(`'${pathId}' must be an number (zero indexed), selector string, element reference, or undefined.`);
				}
			},
			'accessibilityWarnings': validateBoolean,
			'closeNestedItems': validateBoolean,
			'multipleOpenItems': validateBoolean,
			'openAnchoredItems': validateBoolean,
			'dataAttributes': ({value, pathId}) => {
				if (typeof value !== 'object' || value === null) {
					throw new Error(`'${pathId}' must be an object.`);
				}
			},
			'dataAttributes.elementType': validateString,
			'dataAttributes.itemState': validateString,
			'debug': validateBoolean
		};
	}

	constructor(userOptions = {}) {

		this.options = new ObjectManager(this.constructor.defaultOptions, this.constructor.optionsValidation);
		this.options.merge(userOptions);

		this.constructor.addAccordion(this);

		if (!this.initialized) {

			const bundleSelector = this.options.get('selectors.bundle');
			const itemSelector = this.options.get('selectors.item');
			const headerSelector = this.options.get('selectors.header');
			const panelSelector = this.options.get('selectors.panel');
			const panelInnerSelector = this.options.get('selectors.panelInner');

			const initialBundles = [];
			const initialItems = [];
			const initialHeaders = [];
			const initialPanels = [];
			const initialPanelInners = [];

			// bundle
			if (bundleSelector) {
				let initialBundleElements = Array.from(document.querySelectorAll(bundleSelector));
				initialBundleElements = this.constructor.removeExistingAccordionObjectElementsFromArray(initialBundleElements);
				for (const initialBundleElement of initialBundleElements) {
					const initialBundle = this.addBundle({
						element: initialBundleElement
					});
					initialBundles.push(initialBundle);
				}
			}

			// item
			if (itemSelector) {
				for (const initialBundle of initialBundles) {
					let initialItemElements = Array.from(initialBundle.element.querySelectorAll(itemSelector));
					initialItemElements = this.constructor.removeExistingAccordionObjectElementsFromArray(initialItemElements);
					const nestedBundles = this.constructor.getNestedBundles(initialBundle.element);
					const nestedBundleElements = [];
					for (const nestedBundle of nestedBundles) {
						if (isElement(nestedBundle.element)) {
							nestedBundleElements.push(nestedBundle.element);
						}
					}
					initialItemElements = initialItemElements.filter((element) => {
						return !this.constructor.isElementContainedBy(element, nestedBundleElements, 'or');
					});
					for (const initialItemElement of initialItemElements) {
						const initialItem = initialBundle.addItem({
							element: initialItemElement
						});
						initialItems.push(initialItem);
					}
				}
			}

			// header
			if (headerSelector) {
				for (const initialItem of initialItems) {
					let initialHeaderElement = initialItem.element.querySelector(headerSelector);
					if (initialHeaderElement) {
						const initialHeader = initialItem.addHeader({
							element: initialHeaderElement
						});
						initialHeaders.push(initialHeader);
					}
				}
			}
			
			// panel
			if (panelSelector) {
				for (const initialItem of initialItems) {
					let initialPanelElement = initialItem.element.querySelector(panelSelector);
					if (initialPanelElement) {
						const initialPanel = initialItem.addPanel({
							element:initialPanelElement
						});
						initialPanels.push(initialPanel);
					}
				}
			}
			
			// panel inner
			if (panelInnerSelector) {
				for (const initialPanel of initialPanels) {
					let initialPanelInnerElement = initialPanel.element.querySelector(panelInnerSelector);
					if (initialPanelInnerElement) {
						const initialPanelInner = initialPanel.addPanelInner({
							element: initialPanelInnerElement
						});
						initialPanelInners.push(initialPanelInner);
					}
				}
			}

			this.initialized = true;

		}

		this.log(this);

	}

	get bundles() {
		if (!Array.isArray(this._bundles)) {
			this._bundles = [];
		}
		return this._bundles;
	}

	set bundles(bundles) {
		if (!Array.isArray(bundles)) {
			throw new Error(`'bundles' must be an array.`);
		}
		if (!bundles.every(Bundle.isBundle)) {
			throw new Error(`'bundles' must only contain instances of Bundle.`);
		}
		this._bundles = bundles;
	}

	addBundle({element, items}) {
		const bundle = new Bundle({
			accordion: this,
			element: element,
			items: items
		});
		this.bundles.push(bundle);
		return bundle;
	}

	removeBundle(bundle) {
		const existingBundleIndex = this.bundles.indexOf(bundle);
		if (existingBundleIndex >= 0) {
			this.bundles.splice(existingBundleIndex, 1);
			return bundle;
		}
	}

	destroy() {
		for (const bundle of this.bundles) {
			bundle.destroy();
		}
		this.constructor.removeAccordion(this);
	}

	log(...messages) {
		if (this.options.get('debug')) {
			console.log(`Accordion:`, ...messages);
		}
	}

};

/***/ }),

/***/ 768:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const isElement = __webpack_require__(683);
const Item = __webpack_require__(87);

module.exports = class Bundle {

	static isBundle(bundle) {
		return (bundle instanceof this);
	}

	constructor({accordion, element, items}) {
		this.accordion = accordion;
		this.element = element;
		if (Array.isArray(items)) {
			this.addItems(items);
		}
	}

	get options() {
		if (this.accordion) {
			return this.accordion.options;
		}
	}

	get accordion() {
		return this._accordion;
	}

	set accordion(accordion) {
		if (this.initialized) {
			throw new Error(`The 'accordion' property should not be changed after construction. Instead, destroy the instance and create a new one.`);
		}
		const Accordion = __webpack_require__(662);
		if (!Accordion.isAccordion(accordion)) {
			throw new Error(`'accordion' must be an instance of the 'Accordion' class.`);
		}
		this._accordion = accordion;
	}

	get element() {
		return this._element;
	}

	set element(element) {
		if (!isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		if (this.accordion.constructor.getAccordionObject(element)) {
			throw new Error(`'element' is already used in an accordion.`);
		}
		element.setAttribute(this.accordion.options.get('dataAttributes.elementType'), 'bundle');
		this._unsetElement();
		this._element = element;
	}

	_unsetElement() {
		if (isElement(this.element)) {
			this.element.removeAttribute(this.accordion.options.get('dataAttributes.elementType'));
		}
		this._element = undefined;
	}

	get items() {
		if (!Array.isArray(this._items)) {
			this._items = [];
		}
		return this._items;
	}

	set items(items) {
		if (!Array.isArray(items)) {
			throw new Error(`'items' must be an array.`);
		}
		if (!items.every(Item.isItem)) {
			throw new Error(`'items' must only contain instances of Item.`);
		}
		this._items = items;
	}
	
	addItem({element, header, panel, panelInner}) {
		const item = new Item({
			bundle: this,
			element: element,
			header: header,
			panel: panel,
			panelInner: panelInner
		});
		this.items.push(item);
		return item;
	}

	addItems(items) {
		const addedItems = [];
		if (!Array.isArray(items)) {
			throw new Error(`'items' must be an array.`);
		}
		for (const item of items) {
			const addedItem = this.addItem(item);
			addedItems.push(addedItem);
		}
		return addedItems;
	}
	
	removeItem(item) {
		const itemIndex = this.items.indexOf(item);
		if (itemIndex >= 0) {
			this.items.splice(itemIndex, 1);
			return item;
		}
	}

	destroy() {
		for (const item of this.items) {
			item.destroy();
		}
		this._unsetElement();
		this.accordion.removeBundle(this);
	}

};

/***/ }),

/***/ 239:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const isElement = __webpack_require__(683);

module.exports = class Header {

	static isHeader(header) {
		return (header instanceof this);
	}

	constructor({item, element}) {
		this.item = item;
		this.element = element;
		this.initialized = true;
	}

	get options() {
		if (this.accordion) {
			return this.accordion.options;
		}
	}

	get accordion() {
		if (this.bundle) {
			return this.bundle.accordion;
		}
	}

	get bundle() {
		if (this.item) {
			return this.item.bundle;
		}
	}

	get item() {
		return this._item;
	}

	set item(item) {
		if (this.initialized) {
			throw new Error(`The 'item' property should not be changed after construction. Instead, destroy the instance and create a new one.`);
		}
		const Item = __webpack_require__(87);
		if (!Item.isItem(item)) {
			throw new Error(`'item' must be an instance of the 'Item' class.`);
		}
		this._item = item;
	}

	get element() {
		return this._element;
	}

	set element(element) {
		if (!isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		if (this.accordion.constructor.getAccordionObject(element)) {
			throw new Error(`'element' is already used in an accordion.`);
		}
		element.setAttribute(this.accordion.options.get('dataAttributes.elementType'), 'header');
		this._unsetElement();
		this._element = element;
	}

	_unsetElement(element) {
		if (isElement(this.element)) {
			element.removeAttribute(this.accordion.options.get('dataAttributes.elementType'));
		}
		this._element = undefined;
	}

	destroy() {
		this._unsetElement();
		if (this.item && this.item.header === this) {
			this.item.header = undefined;
		}
	}

};

/***/ }),

/***/ 87:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const isElement = __webpack_require__(683);
const Header = __webpack_require__(239);
const Panel = __webpack_require__(426);

module.exports = class Item {

	static isItem(item) {
		return (item instanceof this);
	}

	constructor({bundle, element, header, panel, panelInner}) {
		this.bundle = bundle;
		this.element = element;
		if (isElement(header)) {
			this.addHeader({
				element: header
			});
		}
		if (isElement(panel)) {
			this.addPanel({
				element: panel,
				panelInner: panelInner
			});
		}
		this.initialized = true;
	}

	get options() {
		if (this.accordion) {
			return this.accordion.options;
		}
	}

	get accordion() {
		if (this.bundle) {
			return this.bundle.accordion;
		}
	}

	get bundle() {
		return this._bundle;
	}

	set bundle(bundle) {
		if (this.initialized) {
			throw new Error(`The 'bundle' property should not be changed after construction. Instead, destroy the instance and create a new one.`);
		}
		const Bundle = __webpack_require__(768);
		if (!Bundle.isBundle(bundle)) {
			throw new Error(`'bundle' must be an instance of the 'Bundle' class.`);
		}
		this._bundle = bundle;
	}

	get element() {
		return this._element;
	}

	set element(element) {
		if (!isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		if (this.accordion.constructor.getAccordionObject(element)) {
			throw new Error(`'element' is already used in an accordion.`);
		}
		element.setAttribute(this.accordion.options.get('dataAttributes.elementType'), 'item');
		this._unsetElement();
		this._element = element;
	}

	_unsetElement(element) {
		if (isElement(this.element)) {
			element.removeAttribute(this.accordion.options.get('dataAttributes.elementType'));
		}
		this._element = undefined;
	}

	get header() {
		return this._header;
	}

	set header(header) {
		if (!Header.isHeader(header) && typeof header !== undefined) {
			throw new Error(`'header' must be an instance of Header or undefined.`);
		}
		const existingHeader = this._header;
		if (header !== existingHeader) {
			this._header = header;
			if (Header.isHeader(existingHeader)) {
				existingHeader.destroy();
			}
		}
	}

	addHeader({element}) {
		const header = new Header({
			item: this,
			element: element,
		});
		this.header = header;
		return header;
	}

	get panel() {
		return this._panel;
	}

	set panel(panel) {
		if (!Panel.isPanel(panel) && typeof panel !== undefined) {
			throw new Error(`'panel' must be an instance of Panel or undefined.`);
		}
		const existingPanel = this._panel;
		if (panel !== existingPanel) {
			this._panel = panel;
			if (Panel.isPanel(existingPanel)) {
				existingPanel.destroy();
			}
		}
	}

	addPanel({element, panelInner}) {
		const panel = new Panel({
			item: this,
			element: element,
			panelInner: panelInner
		});
		this.panel = panel;
		return panel;
	}

	destroy() {
		if (this.header) {
			this.header.destroy();
		}
		if (this.panel) {
			this.panel.destroy();
		}
		this._unsetElement();
		this.bundle.removeItem(this);
	}

};

/***/ }),

/***/ 160:
/***/ ((module) => {

module.exports = class ObjectManager {

	static isString(string) {
		return (typeof string === 'string');
	}

	static isObject(object) {
		return (typeof object === 'object' && object !== null);
	}

	static normalizePath(path) {
		if (typeof path === 'string') {
			path = path.split('.');
		}
		if (Array.isArray(path) && path.every(this.isString)) {
			return path;
		}
		else {
			throw new Error(`'path' must be either a string or an array of strings.`);
		}
	}

	static getPathId(path) {
		path = this.normalizePath(path);
		return path.join('.');
	}

	static getObjectProperty(object, path, defaultValue) {
		let result = object;
		path = this.normalizePath(path);
		if (path.length > 0) {
			for (const part of path) {
				if (this.isObject(result)) {
					result = result[part];
				}
				else {
					result = undefined;
					break;
				}
			}
		}
		if (typeof result !== 'undefined') {
			return result;
		}
		else {
			return defaultValue;
		}
	}

	static setObjectProperty(object, path, value) {
		let success = false;
		path = this.normalizePath(path);
		if (path.length > 0) {
			const lastPart = path[path.length - 1];
			for (const part of path) {
				if (this.isObject(object)) {
					if (part === lastPart) {
						object[part] = value;
						success = true;
					}
					else {
						object = object[part];
					}
				}
				else {
					break;
				}
			}
		}
		return success;
	}

	static get eventListenerTypes() {
		return [
			'get',
			'set',
			'change'
		];
	}

	static validateEventListenerType(type) {
		if (!this.eventListenerTypes.includes(type)) {
			throw new Error(`type '${type}' is not a valid type.`);
		}
	}

	static merge(objectManager, path = [], mergeValue) {
		if (Array.isArray(mergeValue)) {
			objectManager.set(path, []);
			for (let index = 0; index < mergeValue.length; index++) {
				path.push(index);
				objectManager.set(path, this.merge(objectManager, path, mergeValue[index]));
				path.splice(-1);
			}
		}
		else if (this.isObject(mergeValue)) {
			if (!this.isObject(this.getObjectProperty(objectManager.object, path))) {
				objectManager.set(path, {});
			}
			for (let property in mergeValue) {
				path.push(property);
				objectManager.set(path, this.merge(objectManager, path, mergeValue[property]));
				path.splice(-1);
			}
		}
		else if (typeof mergeValue !== 'undefined') {
			objectManager.set(path, mergeValue);
		}
		return this.getObjectProperty(objectManager.object, path);
	}

	constructor(object, validation) {
		this.validation = validation;
		this.object = object;
	}

	get object() {
		return this._object;
	}

	set object(object) {
		this._object = {};
		this.merge(object);
	}

	get validation() {
		return this._validation;
	}

	set validation(validation) {
		if (!this.constructor.isObject(validation) && typeof validation !== 'undefined') {
			throw new Error(`'validation' must be an object or undefined.`);
		}
		this._validation = validation;
	}

	validatePropertyValue(path, value) {
		path = this.constructor.normalizePath(path);
		const pathId = this.constructor.getPathId(path);
		if (this.constructor.isObject(this.validation) && typeof this.validation[pathId] === 'function') {
			this.validation[pathId]({
				value: value,
				path: path,
				pathId: pathId,
				object: this.object
			});
		}
	}

	get(path, defaultValue) {
		path = this.constructor.normalizePath(path);
		const value = this.constructor.getObjectProperty(this.object, path, defaultValue);
		this.dispatchEvent(path, 'get', {
			object: this.object,
			path: path,
			type: 'get',
			value: value
		});
		return value;
	}

	set(path, value) {
		this.validatePropertyValue(path, value);
		path = this.constructor.normalizePath(path);
		const previousValue = this.constructor.getObjectProperty(this.object, path);
		const setSuccess = this.constructor.setObjectProperty(this.object, path, value);
		if (setSuccess) {
			this.dispatchEvent(path, 'set', {
				object: this.object,
				path: path,
				type: 'set',
				value: value,
				previousValue: previousValue
			});
			if (value !== previousValue) {
				this.dispatchEvent(path, 'change', {
					object: this.object,
					path: path,
					type: 'change',
					value: value,
					previousValue: previousValue
				});
			}
		}
		return setSuccess;
	}

	merge(object) {
		if (!this.constructor.isObject(object)) {
			throw new Error(`'object' must be an object.`);
		}
		this.constructor.merge(this, [], object);
	}

	get eventListeners() {
		if (!this.constructor.isObject(this._eventListeners)) {
			this._eventListeners = {};
		}
		return this._eventListeners;
	}

	addEventListener(path, type, callback) {
		const pathId = this.constructor.getPathId(path);
		this.constructor.validateEventListenerType(type);
		if (typeof callback !== 'function') {
			throw new Error(`callback must be a function.`);
		}
		if (!this.eventListeners[pathId]) {
			this.eventListeners[pathId] = [];
		}
		const eventListener = {
			type: type,
			callback: callback
		};
		this.eventListeners[pathId].push(eventListener);
	}

	dispatchEvent(path, type, event) {
		path = this.constructor.normalizePath(path);
		const pathId = this.constructor.getPathId(path);
		this.constructor.validateEventListenerType(type);
		if (Array.isArray(this.eventListeners[pathId])) {
			if (typeof event === 'undefined') {
				event = {
					object: this.object,
					path: path,
					type: type
				};
			}
			for (const eventListener of this.eventListeners[pathId]) {
				if (eventListener.type === type) {
					eventListener.callback(event);
				}
			}
		}
	}

	removeEventListener(path, type, callback) {
		const pathId = this.constructor.getPathId(path);
		if (Array.isArray(this.eventListeners[pathId])) {
			for (let eventListenerIndex = 0; eventListenerIndex < this.eventListeners[pathId].length; eventListenerIndex++) {
				const eventListener = this.eventListeners[pathId][eventListenerIndex];
				if (type === eventListener.type && callback === eventListener.callback) {
					this.eventListeners[pathId].splice(eventListenerIndex, 1);
				}
			}
		}
	}

};

/***/ }),

/***/ 813:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const isElement = __webpack_require__(683);

module.exports = class PanelInner {

	static isPanelInner(panelInner) {
		return (panelInner instanceof this);
	}

	constructor({panel, element}) {
		this.panel = panel;
		this.element = element;
		this.initialized = true;
	}

	get options() {
		if (this.accordion) {
			return this.accordion.options;
		}
	}

	get accordion() {
		if (this.bundle) {
			return this.bundle.accordion;
		}
	}

	get bundle() {
		if (this.item) {
			return this.item.bundle;
		}
	}

	get item() {
		if (this.panel) {
			return this.panel.item;
		}
	}

	get panel() {
		return this._panel;
	}

	set panel(panel) {
		if (this.initialized) {
			throw new Error(`The 'panel' property should not be changed after construction. Instead, destroy the instance and create a new one.`);
		}
		const Panel = __webpack_require__(426);
		if (!Panel.isPanel(panel)) {
			throw new Error(`'panel' must be an instance of the 'Panel' class.`);
		}
		this._panel = panel;
	}

	get element() {
		return this._element;
	}

	set element(element) {
		if (!isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		if (this.accordion.constructor.getAccordionObject(element)) {
			throw new Error(`'element' is already used in an accordion.`);
		}
		element.setAttribute(this.accordion.options.get('dataAttributes.elementType'), 'panel-inner');
		this._unsetElement();
		this._element = element;
	}

	_unsetElement(element) {
		if (isElement(this.element)) {
			element.removeAttribute(this.accordion.options.get('dataAttributes.elementType'));
		}
		this._element = undefined;
	}

	destroy() {
		this._unsetElement();
		if (this.panel && this.panel.panelInner === this) {
			this.panel.panelInner = undefined;
		}
	}

};

/***/ }),

/***/ 426:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const isElement = __webpack_require__(683);
const PanelInner = __webpack_require__(813);

module.exports = class Panel {

	static isPanel(panel) {
		return (panel instanceof this);
	}

	constructor({item, element, panelInner}) {
		this.item = item;
		this.element = element;
		if (isElement(panelInner)) {
			this.addPanelInner({
				element: panelInner
			});
		}
		this.initialized = true;
	}

	get options() {
		if (this.accordion) {
			return this.accordion.options;
		}
	}

	get accordion() {
		if (this.bundle) {
			return this.bundle.accordion;
		}
	}

	get bundle() {
		if (this.item) {
			return this.item.bundle;
		}
	}

	get item() {
		return this._item;
	}

	set item(item) {
		if (this.initialized) {
			throw new Error(`The 'item' property should not be changed after construction. Instead, destroy the instance and create a new one.`);
		}
		const Item = __webpack_require__(87);
		if (!Item.isItem(item)) {
			throw new Error(`'item' must be an instance of the 'Item' class.`);
		}
		this._item = item;
	}

	get element() {
		return this._element;
	}

	set element(element) {
		if (!isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		if (this.accordion.constructor.getAccordionObject(element)) {
			throw new Error(`'element' is already used in an accordion.`);
		}
		element.setAttribute(this.accordion.options.get('dataAttributes.elementType'), 'panel');
		this._unsetElement();
		this._element = element;
	}

	_unsetElement(element) {
		if (isElement(this.element)) {
			element.removeAttribute(this.accordion.options.get('dataAttributes.elementType'));
		}
		this._element = undefined;
	}

	get panelInner() {
		return this._panelInner;
	}

	set panelInner(panelInner) {
		if (!PanelInner.isPanelInner(panelInner) && typeof panelInner !== 'undefined') {
			throw new Error(`'panelInner' must be an instance of PanelInner or undefined.`);
		}
		const existingPanelInner = this._panelInner;
		if (panelInner !== existingPanelInner) {
			this._panelInner = panelInner;
			if (PanelInner.isPanelInner(existingPanelInner)) {
				existingPanelInner.destroy();
			}
		}
	}

	addPanelInner({element}) {
		const panelInner = new PanelInner({
			panel: this,
			element: element
		});
		this.panelInner = panelInner;
		return panelInner;
	}

	destroy() {
		if (PanelInner.isPanelInner(this.panelInner)) {
			this.panelInner.destroy();
		}
		this._unsetElement();
		if (this.item && this.item.panel === this) {
			this.item.panel = undefined;
		}
	}

};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(662);
/******/ 	Accordion = __webpack_exports__;
/******/ 	
/******/ })()
;