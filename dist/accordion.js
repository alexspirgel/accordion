/*!
 * accordion v2.0.0
 * https://github.com/alexspirgel/accordion
 */
var Accordion =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Extend v3.0.0
 * https://github.com/alexspirgel/extend
 */

const extend = (...arguments) => {

	let target = arguments[0];
	let argumentIndex, merge, mergeIsArray;
	for (argumentIndex = 1; argumentIndex < arguments.length; argumentIndex++) {
		merge = arguments[argumentIndex];
		if (merge === target) {
			continue;
		}
		mergeIsArray = Array.isArray(merge);
		if (mergeIsArray || extend.isPlainObject(merge)) {
			if (mergeIsArray && !Array.isArray(target)) {
				target = [];
			}
			else if (!mergeIsArray && !extend.isPlainObject(target)) {
				target = {};
			}
			for (const property in merge) {
				if (property === "__proto__") {
					continue;
				}
				target[property] = extend(target[property], merge[property]);
			}
		}
		else {
			if (merge !== undefined) {
				target = merge;
			}
		}
	}

	return target;

};

extend.isPlainObject = (object) => {
	const baseObject = {};
	const toString = baseObject.toString;
	const hasOwnProperty = baseObject.hasOwnProperty;
	const functionToString = hasOwnProperty.toString;
	const objectFunctionString = functionToString.call(Object);
	if (toString.call(object) !== '[object Object]') {
		return false;
	}
	const prototype = Object.getPrototypeOf(object);
	if (prototype) {
		if (hasOwnProperty.call(prototype, 'constructor')) {
			if (typeof prototype.constructor === 'function') {
				if (functionToString.call(prototype.constructor) !== objectFunctionString) {
					return false;
				}
			}
		}
	}
	return true;
};

if ( true && module.exports) {
	module.exports = extend;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const DataPathManager = __webpack_require__(3);

class ValidationError extends Error {
	
	constructor(...params) {
		super(...params);
	}
	
	set modelPathManager(modelPathManager) {
		if (!(modelPathManager instanceof DataPathManager)) {
			modelPathManager = new DataPathManager(modelPathManager);
		}
		this._modelPathManager = modelPathManager;
	}
	
	get modelPathManager() {
		return this._modelPathManager;
	}
	
	set inputPathManager(inputPathManager) {
		if (!(inputPathManager instanceof DataPathManager)) {
			inputPathManager = new DataPathManager(inputPathManager);
		}
		this._inputPathManager = inputPathManager;
	}
	
	get inputPathManager() {
		return this._inputPathManager;
	}

};

module.exports = ValidationError;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const extend = __webpack_require__(0);
const Schema = __webpack_require__(6);
const Bundle = __webpack_require__(4);

class Accordion {

	static get optionsDefault() {
		return {
			elements: {
				bundle: '.accordion',
				item: '.accordion__item',
				trigger: '.accordion__trigger',
				content: '.accordion__content',
				container: '.accordion__container'
			},
			accessibilityWarnings: true,
			closeNestedItems: false,
			defaultOpenItems: null,
			inlineStyles: true,
			multipleOpenItems: true,
			openAnchoredItems: true,
			debug: false
		};
	}

	static get optionsSchema () {
		const elementsModel = [
			{
				type: 'string'
			},
			{
				type: 'object',
				instanceOf: [Element, NodeList]
			},
			{
				type: 'array',
				allPropertySchema: [
					{
						type: 'string'
					},
					{
						type: 'object',
						instanceOf: [Element, NodeList]
					}
				]
			}
		];
		const optionsModel = {
			type: 'object',
			allowUnvalidatedProperties: false,
			propertySchema: {
				elements: {
					type: 'object',
					allowUnvalidatedProperties: false,
					propertySchema: {
						bundle: elementsModel,
						item: elementsModel,
						trigger: elementsModel,
						content: elementsModel,
						container: elementsModel
					}
				},
				accessibilityWarnings: {
					type: 'boolean'
				},
				closeNestedItems: {
					type: 'boolean'
				},
				defaultOpenItems: [
					{
						type: 'string'
					},
					{
						type: 'number',
						greaterThanOrEqualTo: 0,
						divisibleBy: 1
					},
					{
						type: 'object',
						instanceOf: [Element, NodeList]
					},
					{
						type: 'array',
						allPropertySchema: [
							{
								type: 'string'
							},
							{
								type: 'number',
								greaterThanOrEqualTo: 0,
								divisibleBy: 1
							},
							{
								type: 'object',
								instanceOf: [Element, NodeList]
							}
						]
					}
				],
				inlineStyles: {
					type: 'boolean'
				},
				multipleOpenItems: {
					type: 'boolean'
				},
				openAnchoredItems: {
					type: 'boolean'
				},
				debug: {
					type: 'boolean'
				}
			}
		};
		return new Schema(optionsModel);
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
		if (Array.isArray(inputValue)) {
			for (let value of inputValue) {
				this.getElementsFromInput(value, elementsSet);
			}
		}
		else if (typeof inputValue === 'string') {
			let elements = document.querySelectorAll(inputValue);
			this.getElementsFromInput(elements, elementsSet);
		}
		else if (inputValue instanceof NodeList) {
			for (let element of inputValue) {
				this.getElementsFromInput(element, elementsSet);
			}
		}
		else if (inputValue instanceof Element && inputValue.nodeType === 1) {
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
		if (!this.isElement(containedBy) && !Array.isArray(containedBy)) {
			throw new Error('`containedBy` must be an element or an array.');
		}
		if (Array.isArray(containedBy)) {
			if (!containedBy.every(this.isElement)) {
				throw new Error('`containedBy` array must only contain elements.');
			}
		}
		else {
			containedBy = [containedBy];
		}
		if (!this.isElement(notContainedBy) && !Array.isArray(notContainedBy)) {
			throw new Error('`notContainedBy` must be an element or an array.');
		}
		if (Array.isArray(notContainedBy)) {
			if (!notContainedBy.every(this.isElement)) {
				throw new Error('`notContainedBy` array must only contain elements.');
			}
		}
		else {
			notContainedBy = [notContainedBy];
		}
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
	
	constructor(options) {
		this.options = options;
		this.initializeBundles();
		this.debug(this);
		return this;
	}

	get options() {
		if (this._options === undefined || this._options === null) {
			this._options = extend({}, this.constructor.optionsDefault);
		}
		return this._options;
	}

	set options(options) {
		this.constructor.optionsSchema.validate(options);
		this._options = extend(this.options, options);
		return this._options;
	}

	get bundles() {
		if (!this._bundles) {
			this._bundles = [];
		}
		return this._bundles;
	}

	set bundles(bundles) {
		if (!Array.isArray(bundles)) {
			throw new Error('`bundles` must be an array.');
		}
		if (!bundles.every(Bundle.isBundle(bundle))) {
			throw new Error('`bundles` must only contain Bundle class instances.');
		}
		this._bundles = bundles;
		return this._bundles;
	}

	addBundle(element) {
		try {
			const bundle = new Bundle({
				accordion: this,
				element: element
			});
			this.bundles.push(bundle);
			return true;
		}
		catch (error) {
			if (error.code = 'bundle-exists') {
				this.debug(error, element);
				return false;
			}
			else {
				throw error;
			}
		}
	}

	addBundles(elements) {
		if (!Array.isArray(elements) && !(elements instanceof NodeList)) {
			throw new Error('`elements` must be an array or node list.');
		}
		if (elements instanceof NodeList) {
			elements = Array.from(elements);
		}
		elements = this.constructor.sortElementsByMostNestedFirst(elements);
		for (const element of elements) {
			this.addBundle(element);
		}
	}

	initializeBundles() {
		let elements = this.constructor.getElementsFromInput(this.options.elements.bundle);
		this.addBundles(elements);
	}

	destroy() {}

	debug(...messages) {
		if (this.options.debug) {
			console.log('Accordion Debug:', ...messages);
		}
	}

}

module.exports = Accordion;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const extend = __webpack_require__(0);

class DataPathManager {
	
	constructor(data, path = []) {
		this.data = data;
		this.path = path;
	}
	
	set path(path) {
		if (Array.isArray(path)) {
			this._path = path;
		}
		else {
			throw new Error('Path must be an array');
		}
	}
	
	get path() {
		return this._path;
	}
	
	addPathSegment(pathSegment) {
		this.path.push(pathSegment);
	}
	
	removePathSegment() {
		return this.path.splice(-1, 1)[0];
	}
	
	get value() {
		let value = this.data;
		for (let path of this.path) {
			try {
				value = value[path];
			}
			catch (error) {
				return undefined;
			}
		}
		return value;
	}

	clone(options = {}) {

		const defaultOptions = {
			data: false,
			path: true
		};
		options = extend({}, defaultOptions, options);

		let data = this.data;
		if (options.data) {
			if (typeof data === 'object') {
				if (Array.isArray(data)) {
					data = extend([], data);
				}
				else {
					data = extend({}, data);
				}
			}
		}

		let path = this.path;
		if (options.path) {
			path = [...this.path];
		}

		return new this.constructor(data, path);

	}

};

module.exports = DataPathManager;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const AccordionError = __webpack_require__(10);
const Item = __webpack_require__(9);

class Bundle {

	static get dataAttribute() {
		return 'data-accordion-bundle';
	}

	static isBundle(bundle) {
		return bundle instanceof this;
	}

	static isExistingBundleElement(element) {
		return element.hasAttribute(this.dataAttribute);
	}

	constructor(options) {
		this.accordion = options.accordion;
		this.element = options.element;
		if (this.constructor.isExistingBundleElement(this.element)) {
			throw new AccordionError('bundle-exists', 'A bundle already exists for this element.');
		}
		this.element.setAttribute(this.constructor.dataAttribute, '');
		this.initializeItems();
		return this;
	}

	get accordion() {
		return this._accordion;
	}

	set accordion(accordion) {
		if (!(accordion instanceof __webpack_require__(2))) {
			throw new Error('`accordion` must be an instance of the Accordion class.');
		}
		this._accordion = accordion;
		return this._accordion;
	}

	get options() {
		return this.accordion.options;
	}

	get element() {
		return this._element;
	}

	set element(element) {
		if (!this.accordion.constructor.isElement(element)) {
			throw new Error('`element` must be an element.');
		}
		this._element = element;
		return this._element;
	}

	get items() {
		if (!this._items) {
			this._items = [];
		}
		return this._items;
	}

	set items(items) {
		if (!Array.isArray(items)) {
			throw new Error('`items` must be an array.');
		}
		if (!items.every(Item.isItem(item))) {
			throw new Error('`items` must only contain Item class instances.');
		}
		this._items = items;
		return this._items;
	}

	initializeItems() {
		let elements = this.accordion.constructor.getElementsFromInput(this.options.elements.item);
		const nestedBundles = Array.from(this.element.querySelectorAll('[' + this.constructor.dataAttribute + ']'));
		elements = this.accordion.constructor.filterElementsByContainers(elements, this.element, nestedBundles);
		console.log(elements);
	}

}

module.exports = Bundle;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Accordion = __webpack_require__(2);
module.exports = Accordion;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const DataPathManager = __webpack_require__(3);
const ValidationError = __webpack_require__(1);
const ValidationErrors = __webpack_require__(7);
const modelModel = __webpack_require__(8);

class Schema {
	
	static get validationMethods() {
		return [
			{
				property: 'required',
				method: this.validateRequired
			},
			{
				property: 'type',
				method: this.validateType
			},
			{
				property: 'exactValue',
				method: this.validateExactValue
			},
			{
				property: 'greaterThan',
				method: this.validateGreaterThan
			},
			{
				property: 'greaterThanOrEqualTo',
				method: this.validateGreaterThanOrEqualTo
			},
			{
				property: 'lessThan',
				method: this.validateLessThan
			},
			{
				property: 'lessThanOrEqualTo',
				method: this.validateLessThanOrEqualTo
			},
			{
				property: 'divisibleBy',
				method: this.validateDivisibleBy
			},
			{
				property: 'notDivisibleBy',
				method: this.validateNotDivisibleBy
			},
			{
				property: 'minimumCharacters',
				method: this.validateMinimumCharacters
			},
			{
				property: 'maximumCharacters',
				method: this.validateMaximumCharacters
			},
			{
				property: 'minimumLength',
				method: this.validateMinimumLength
			},
			{
				property: 'maximumLength',
				method: this.validateMaximumLength
			},
			{
				property: 'instanceOf',
				method: this.validateInstanceOf
			},
			{
				property: 'allowUnvalidatedProperties',
				method: this.validateAllowUnvalidatedProperties
			},
			{
				property: 'custom',
				method: this.validateCustom
			},
			{
				property: 'allPropertySchema',
				method: this.validateAllPropertySchema
			},
			{
				property: 'propertySchema',
				method: this.validatePropertySchema
			}
		]
	}

	static validateRequired(modelPathManager, inputPathManager) {
		if (modelPathManager.value === true) {
			if (inputPathManager.value === undefined || inputPathManager.value === null) {
				throw new ValidationError(`Property 'required' validation failed. The input must not be null or undefined.`);
			}
		}
		return true;
	}

	static validateType(modelPathManager, inputPathManager) {
		if (modelPathManager.value === 'number') {
			if (typeof inputPathManager.value === 'number' && !isNaN(inputPathManager.value)) {
				return true;
			}
		}
		else if (modelPathManager.value === 'object') {
			if (typeof inputPathManager.value === 'object' && !Array.isArray(inputPathManager.value) && inputPathManager.value !== null) {
				return true;
			}
		}
		else if (modelPathManager.value === 'array') {
			if (Array.isArray(inputPathManager.value)) {
				return true;
			}
		}
		else if (modelPathManager.value === 'boolean' || modelPathManager.value === 'string' || modelPathManager.value === 'function') {
			if (typeof inputPathManager.value === modelPathManager.value) {
				return true;
			}
		}
		throw new ValidationError(`Property 'type' validation failed. The input type must match.`);
	}

	static validateExactValue(modelPathManager, inputPathManager) {
		if (Array.isArray(modelPathManager.value)) {
			for (const value of modelPathManager.value) {
				if (inputPathManager.value === value) {
					return true;
				}
			}
		}
		else {
			if (inputPathManager.value === modelPathManager.value) {
				return true;
			}
		}
		throw new ValidationError(`Property 'exactValue' validation failed. The input must be an exact match of the value or one of the values in an array of values.`);
	}

	static validateGreaterThan(modelPathManager, inputPathManager) {
		if (inputPathManager.value > modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'greaterThan' validation failed. The input must be greater than the value.`);
		}
	}

	static validateGreaterThanOrEqualTo(modelPathManager, inputPathManager) {
		if (inputPathManager.value >= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'greaterThanOrEqualTo' validation failed. The input must be greater than or equal to the value.`);
		}
	}

	static validateLessThan(modelPathManager, inputPathManager) {
		if (inputPathManager.value < modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'lessThan' validation failed. The input must be less than the value.`);
		}
	}

	static validateLessThanOrEqualTo(modelPathManager, inputPathManager) {
		if (inputPathManager.value <= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'lessThanOrEqualTo' validation failed. The input must be less than or equal to the value.`);
		}
	}

	static validateDivisibleBy(modelPathManager, inputPathManager) {
		if (Array.isArray(modelPathManager.value)) {
			for (const value of modelPathManager.value) {
				if (inputPathManager.value % value === 0) {
					return true;
				}
			}
		}
		else {
			if (inputPathManager.value % modelPathManager.value === 0) {
				return true;
			}
		}
		throw new ValidationError(`Property 'divisibleBy' validation failed. The input must be divisible by the value or one of the values in an array of values.`);
	}

	static validateNotDivisibleBy(modelPathManager, inputPathManager) {
		let flag = false;
		if (Array.isArray(modelPathManager.value)) {
			for (const value of modelPathManager.value) {
				if (inputPathManager.value % value === 0) {
					flag = true;
				}
			}
		}
		else {
			if (inputPathManager.value % modelPathManager.value === 0) {
				flag = true;
			}
		}
		if (flag || isNaN(inputPathManager.value)) {
			throw new ValidationError(`Property 'notDivisibleBy' validation failed. The input must not be divisible by the value or one of the values in an array of values.`);
		}
		return true;
	}

	static validateMinimumCharacters(modelPathManager, inputPathManager) {
		if (inputPathManager.value.length >= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'minimumCharacters' validation failed. The input must have a character count greater than or equal to the value.`);
		}
	}

	static validateMaximumCharacters(modelPathManager, inputPathManager) {
		if (inputPathManager.value.length <= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'maximumCharacters' validation failed. The input must have a character count less than or equal to the value.`);
		}
	}

	static validateMinimumLength(modelPathManager, inputPathManager) {
		if (inputPathManager.value.length >= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'minimumLength' validation failed. The input must have a length greater than or equal to the value.`);
		}
	}

	static validateMaximumLength(modelPathManager, inputPathManager) {
		if (inputPathManager.value.length <= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'maximumLength' validation failed. The input must have a length less than or equal to the value.`);
		}
	}

	static validateInstanceOf(modelPathManager, inputPathManager) {
		if (Array.isArray(modelPathManager.value)) {
			for (const value of modelPathManager.value) {
				if (inputPathManager.value instanceof value) {
					return true;
				}
			}
		}
		else {
			if (inputPathManager.value instanceof modelPathManager.value) {
				return true;
			}
		}
		throw new ValidationError(`Property 'instanceOf' validation failed. The input must be an instance of the value or one of the values in an array of values.`);
	}

	static validateAllowUnvalidatedProperties(modelPathManager, inputPathManager) {
		if (modelPathManager.value === false) {
			modelPathManager.removePathSegment();
			modelPathManager.addPathSegment('propertySchema');
			let validatedProperties = [];
			if (modelPathManager.value) {
				validatedProperties = Object.keys(modelPathManager.value);
			}
			for (const property in inputPathManager.value) {
				if (!validatedProperties.includes(property)) {
					throw new ValidationError(`Property 'allowUnvalidatedProperties' validation failed. '${property}' is not defined in the 'propertySchema' validation property.`);
				}
			}
		}
		return true;
	}

	static validateCustom(modelPathManager, inputPathManager) {
		const customInputPathManager = inputPathManager.clone({data: true, path: true});
		return modelPathManager.value(customInputPathManager);
	}

	static validateAllPropertySchema(modelPathManager, inputPathManager) {
		const allPropertySchema = new Schema(modelPathManager.clone(), false);
		for (const property in inputPathManager.value) {
			const inputPropertyPathManager = inputPathManager.clone();
			inputPropertyPathManager.addPathSegment(property);
			const validationResult = allPropertySchema.validate(inputPropertyPathManager, 'array');
			if (validationResult !== true) {
				return validationResult;
			}
		}
		return true;
	}

	static validatePropertySchema(modelPathManager, inputPathManager) {
		for (const property in modelPathManager.value) {
			const modelPropertyPathManager = modelPathManager.clone();
			modelPropertyPathManager.addPathSegment(property);
			const propertySchema = new Schema(modelPropertyPathManager, false);
			const inputPropertyPathManager = inputPathManager.clone();
			inputPropertyPathManager.addPathSegment(property);
			const validationResult = propertySchema.validate(inputPropertyPathManager, 'array');
			if (validationResult !== true) {
				return validationResult;
			}
		}
		return true;
	}
	
	constructor(modelPathManager = {}, selfValidate = true) {
		this.selfValidate = selfValidate;
		this.modelPathManager = modelPathManager;
	}

	set modelPathManager(modelPathManager) {
		if (!(modelPathManager instanceof DataPathManager)) {
			modelPathManager = new DataPathManager(modelPathManager);
		}
		this._modelPathManager = modelPathManager;
		if (this.selfValidate) {
			const schemaModel = new Schema(modelModel, false);
			schemaModel.validate(this.modelPathManager);
		}
	}

	get modelPathManager() {
		return this._modelPathManager;
	}
 
	validate(inputPathManager, errorStyle = 'throw') {

		if (!(inputPathManager instanceof DataPathManager)) {
			inputPathManager = new DataPathManager(inputPathManager);
		}

		let validationErrors = new ValidationErrors();

		if (Array.isArray(this.modelPathManager.value)) {
			for (let modelIndex = 0; modelIndex < this.modelPathManager.value.length; modelIndex++) {
				const modelItemPathManager = this.modelPathManager.clone();
				modelItemPathManager.addPathSegment(modelIndex);
				const validationResult = this._validate(modelItemPathManager, inputPathManager);
				if (validationResult === true) {
					return true;
				}
				else {
					validationErrors.addError(validationResult);
				}
			}
		}
		else {
			const validationResult = this._validate(this.modelPathManager, inputPathManager);
			if (validationResult === true) {
				return true;
			}
			else {
				validationErrors.addError(validationResult);
			}
		}

		if (errorStyle === 'throw') {
			throw new Error(validationErrors.generateFormattedMessage());
		}
		else if (errorStyle === 'array') {
			return validationErrors.errors;
		}
		else if (errorStyle === 'boolean') {
			return false;
		}

	}

	_validate(modelPathManager, inputPathManager) {
		if (modelPathManager.value.required !== true) {
			if (inputPathManager.value === undefined || inputPathManager.value === null) {
				return true;
			}
		}
		for (const validationMethod of this.constructor.validationMethods) {
			if (modelPathManager.value.hasOwnProperty(validationMethod.property)) {
				const validationMethodModelPathManager = modelPathManager.clone();
				validationMethodModelPathManager.addPathSegment(validationMethod.property);
				try {
					const validationResult = validationMethod.method(validationMethodModelPathManager, inputPathManager);
					if (validationResult !== true) {
						return validationResult;
					}
				}
				catch (error) {
					if (error instanceof ValidationError) {
						if (!error.modelPathManager) {
							error.modelPathManager = validationMethodModelPathManager;
						}
						if (!error.inputPathManager) {
							error.inputPathManager = inputPathManager;
						}
						return error;
					}
					else {
						throw error;
					}
				}
			}
		}
		return true;
	}

}

Schema.ValidationError = ValidationError;

module.exports = Schema;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const ValidationError = __webpack_require__(1);

class ValidationErrors {
	
	constructor() {
		this.errors = [];
	}
	
	addError(error) {
		if (Array.isArray(error)) {
			for (const singleError of error) {
				this.addError(singleError);
			}
		}
		else {
			if (!(error instanceof ValidationError)) {
				throw new Error(`Passed 'error' must be an instance of 'Schema.ValidationError'.`);
			}
			else {
				this.errors.push(error);
			}
		}
	}
	
	generateFormattedMessage() {
		let message = `Schema errors:\n`;
		for (const error of this.errors) {
			let inputPath = 'root';
			if (error.inputPathManager.path.length > 0) {
				inputPath = error.inputPathManager.path.map((pathSegment) => {
					return `['` + pathSegment + `']`;
				});
				inputPath = inputPath.join('');
			}
			let modelPath = 'root';
			if (error.modelPathManager.path.length > 0) {
				modelPath = error.modelPathManager.path.map((pathSegment) => {
					return `['` + pathSegment + `']`;
				});
				modelPath = modelPath.join('');
			}
			message = message + `\nInput Path: ${inputPath}\nModel Path: ${modelPath}\nMessage: ${error.message}\n`;
		}
		return message;
	}

};

module.exports = ValidationErrors;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const extend = __webpack_require__(0);
const ValidationError = __webpack_require__(1);

const typeRestriction = (types) => {
	if (!Array.isArray(types)) {
		types = [types];
	}
	return (inputPathManager) => {
		const validationProperty = inputPathManager.removePathSegment();
		if (validationProperty === undefined || types.includes(inputPathManager.value.type)) {
			return true;
		}
		else {
			let typesString = ``;
			for (let i = 0; i < types.length; i++) {
				const type = types[i];
				if (i === 0) {
					typesString += `'${type}'`;
				}
				else if (i < (types.length - 1)) {
					typesString += `, '${type}'`;
				}
				else {
					if (types.length > 2) {
						typesString += `,`;
					}
					typesString += ` or '${type}'`;
				}
			}
			throw new ValidationError(`The validation property '${validationProperty}' can only belong to a model with a type of ${typesString}.`);
		}
	};
};

const modelPropertySchema = {
	required: {
		type: 'boolean'
	},
	type: {
		type: 'string',
		exactValue: [
			'boolean',
			'number',
			'string',
			'array',
			'object',
			'function'
		]
	},
	exactValue: {
		custom: typeRestriction(['boolean', 'number', 'string'])
	},
	greaterThan: {
		type: 'number',
		custom: typeRestriction('number')
	},
	greaterThanOrEqualTo: {
		type: 'number',
		custom: typeRestriction('number')
	},
	lessThan: {
		type: 'number',
		custom: typeRestriction('number')
	},
	lessThanOrEqualTo: {
		type: 'number',
		custom: typeRestriction('number')
	},
	divisibleBy: {
		type: 'number',
		custom: typeRestriction('number')
	},
	notDivisibleBy: {
		type: 'number',
		custom: typeRestriction('number')
	},
	minimumCharacters: {
		type: 'string',
		custom: typeRestriction('string')
	},
	maximumCharacters: {
		type: 'string',
		custom: typeRestriction('string')
	},
	minimumLength: {
		type: 'number',
		custom: typeRestriction('array')
	},
	maximumLength: {
		type: 'number',
		custom: typeRestriction('array')
	},
	instanceOf: {
		custom: typeRestriction('object')
	},
	allowUnvalidatedProperties: {
		type: 'boolean',
		custom: typeRestriction('object')
	},
	custom: {
		type: 'function'
	},
	propertySchema: {
		type: 'object',
		custom: typeRestriction(['array', 'object'])
	}
};

const modelObject = {
	type: 'object',
	propertySchema: modelPropertySchema
};

const modelArray = {
	type: 'array',
	allPropertySchema: {
		type: 'object',
		propertySchema: modelPropertySchema
	}
};

const model = [
	modelObject,
	modelArray
];

const modelTypeRestricted = [
	extend({}, modelObject, {custom: typeRestriction(['array', 'object'])}),
	extend({}, modelArray, {custom: typeRestriction(['array', 'object'])})
];

modelPropertySchema.allPropertySchema = modelTypeRestricted;
modelPropertySchema.propertySchema.allPropertySchema = model;

module.exports = model;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

class Item {

	static isItem(item) {
		return item instanceof this;
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

	constructor(options) {
		this.bundle = options.accordion;
		this.element = options.element;
		this.id = this.constructor.instanceCountIncrement();
		return this;
	}

	get bundle() {
		return this._bundle;
	}

	set bundle(bundle) {
		if (!(bundle instanceof __webpack_require__(4))) {
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
		if (!this.bundle.accordion.constructor.isElement(element)) {
			throw new Error('`element` must be an element.');
		}
		this._element = element;
		return this._element;
	}

}

module.exports = Item;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

class AccordionError extends Error {
  constructor(code, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AccordionError);
    }
    this.code = code;
    this.message = params[0];
  }
}

module.exports = AccordionError;

/***/ })
/******/ ]);