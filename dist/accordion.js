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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports) {

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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const DataPathManager = __webpack_require__(3);
const ValidationError = __webpack_require__(0);
const ValidationErrors = __webpack_require__(10);
const modelModel = __webpack_require__(11);

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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const extend = __webpack_require__(4);

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

const isPlainObject = __webpack_require__(5);

const extend = (...arguments) => {
	let target = arguments[0];
	let argumentIndex, merge, mergeIsArray;
	for (argumentIndex = 1; argumentIndex < arguments.length; argumentIndex++) {
		merge = arguments[argumentIndex];
		if (merge === target) {
			continue;
		}
		mergeIsArray = Array.isArray(merge);
		if (mergeIsArray || isPlainObject(merge)) {
			if (mergeIsArray && !Array.isArray(target)) {
				target = [];
			}
			else if (!mergeIsArray && !isPlainObject(target)) {
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

module.exports = extend;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * isPlainObject v1.0.1
 * https://github.com/alexspirgel/isPlainObject
 */

const isPlainObject = (object) => {
	if (Object.prototype.toString.call(object) !== '[object Object]') {
		return false;
	}
  if (object.constructor === undefined) {
		return true;
	}
  if (Object.prototype.toString.call(object.constructor.prototype) !== '[object Object]') {
		return false;
	}
  if (!object.constructor.prototype.hasOwnProperty('isPrototypeOf')) {
    return false;
  }
  return true;
};

if ( true && module.exports) {
	module.exports = isPlainObject;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = class Content {

	constructor(parameters) {
		this.boundUpdateAriaLabelledBy = this.updateAriaLabelledBy.bind(this);
		this.item = parameters.item;
		this.element = parameters.element;
		if (this.options.elements.contentInner) {
			this.addContentInner(this.options.elements.contentInner);
		}
		return this;
	}

	get item() {
		return this._item;
	}

	set item(item) {
		if (!(item instanceof __webpack_require__(1))) {
			throw new Error(`'item' must be an instance of the Item class.`);
		}
		this._item = item;
	}

	get options() {
		return this.item.bundle.accordion.options;
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
		
		this._element = element;
	
		element[this.constructor.elementProperty] = this;
		element.setAttribute(this.constructor.elementDataAttribute, 'content');
		
		this.usingExistingId = true;
		if (!element.getAttribute('id')) {
			element.setAttribute('id', 'accordion-content-' + this.item.count);
			this.usingExistingId = false;
		}

		this.updateAriaLabelledBy();
		this.item.element.addEventListener(this.item.constructor.accordionItemAddTriggerEventName, this.boundUpdateAriaLabelledBy);
		
		this.existingStyleHeight = 	element.style.height;
		if (this.item.state === 'closed') {
			element.style.height = 0;
		}
		
		return this._element;
	}

	updateAriaLabelledBy() {
		if (this.element && this.item.trigger) {
			this.element.setAttribute('aria-labelledby', this.item.trigger.element.getAttribute('id'));
		}
	}

	filterElementsByScope(elementsInput) {
		let elements = this.constructor.normalizeElements(elementsInput);
		const nestedBundleElements = this.element.querySelectorAll('[' + this.constructor.elementDataAttribute + '="bundle"]');
		return this.constructor.filterElementsByContainer(elements, this.element, nestedBundleElements);
	}

	get contentInner() {
		return this._contentInner;
	}

	set contentInner(contentInner) {
		if (!(contentInner instanceof ContentInner)) {
			throw new Error(`'contentInner' must be a ContentInner class instance.`);
		}
		this._contentInner = contentInner;
		return this._contentInner;
	}

	addContentInner(elementsInput) {
		const elements = this.filterElementsByScope(elementsInput);
		const element = elements[0];
		try {
			const contentInner = new ContentInner({
				content: this,
				element: element
			});
			this.contentInner = contentInner;
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

	destroy() {
		if (this.contentInner) {
			this.contentInner.destroy();
		}
		delete this.element[this.constructor.elementProperty];
		this.element.removeAttribute(this.constructor.elementDataAttribute);
		if (!this.usingExistingId) {
			this.element.removeAttribute('id');
		}
		this.element.removeAttribute('aria-labelledby');
		this.item.element.removeEventListener(this.item.constructor.accordionItemAddTriggerEventName, this.boundUpdateAriaLabelledBy);
		this.element.style.height = this.existingStyleHeight;
	}

};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = class Accordion {
	
	static get extend() {
		return __webpack_require__(9);
	}

	static get Schema() {
		return __webpack_require__(2);
	}

	static get transitionAuto() {
		return __webpack_require__(12);
	}

	static get CodedError() {
		return __webpack_require__(15);
	}
	
	static get Bundle() {
		return __webpack_require__(16);
	}

	static get Item() {
		return __webpack_require__(1);
	}

	static get Trigger() {
		return __webpack_require__(17);
	}

	static get Content() {
		return __webpack_require__(6);
	}

	static get ContentInner() {
		return __webpack_require__(18);
	}

	static get dataAttributes() {
		return {
			elementType: 'data-accordion',
			itemState: 'data-accordion-item-state'
		};
	}

	static get eventNames() {
		return {
			addBundle: {
				before: 'accordionBeforeAddBundle',
				after: 'accordionAfterAddBundle'
			},
			removeBundle: {
				before: 'accordionBeforeRemoveBundle',
				after: 'accordionAfterRemoveBundle'
			},
			addItem: {
				before: 'accordionBeforeAddItem',
				after: 'accordionAfterAddItem'
			},
			removeItem: {
				before: 'accordionBeforeRemoveItem',
				after: 'accordionAfterRemoveItem'
			},
			addTrigger: {
				before: 'accordionBeforeAddTrigger',
				after: 'accordionAfterAddTrigger'
			},
			removeTrigger: {
				before: 'accordionBeforeRemoveTrigger',
				after: 'accordionAfterRemoveTrigger'
			},
			addContent: {
				before: 'accordionBeforeAddContent',
				after: 'accordionAfterAddContent'
			},
			removeContent: {
				before: 'accordionBeforeRemoveContent',
				after: 'accordionAfterRemoveContent'
			},
			addContentInner: {
				before: 'accordionBeforeAddContentInner',
				after: 'accordionAfterAddContentInner'
			},
			removeContentInner: {
				before: 'accordionBeforeRemoveContentInner',
				after: 'accordionAfterRemoveContentInner'
			},
			openItem: {
				before: 'accordionBeforeOpenItem',
				after: 'accordionAfterOpenItem'
			},
			closeItem: {
				before: 'accordionBeforeCloseItem',
				after: 'accordionAfterCloseItem'
			}
		};
	}

	static get optionsDefault() {
		return {
			elements: {
				bundle: null,
				item: null,
				trigger: null,
				content: null,
				contentInner: null
			},
			accessibilityWarnings: true,
			closeNestedItems: false,
			defaultOpenItems: null,
			multipleOpenItems: true,
			openAnchoredItems: true,
			debug: false
		};
	}

	static get optionsSchema() {
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
						contentInner: elementsModel
					}
				},
				accessibilityWarnings: {
					type: 'boolean'
				},
				closeNestedItems: {
					type: 'boolean'
				},
				defaultOpenItems: elementsModel,
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
		return new this.Schema(optionsModel);
	}

	static get accordions() {
		if (!this._accordions) {
			this._accordions = new Set();
		}
		return this._accordions;
	}

	static isElement(element) {
		return element instanceof Element;
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

	static isElementInitialized(element) {
		if (this.dataFromElement(element)) {
			return true;
		}
		else {
			return false;
		}
	}

	static dataFromElement(element) {
		if (!this.isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		for (const accordion of this.accordions) {
			for (const bundle of accordion.bundles) {
				if (element === bundle.element) {
					return bundle;
				}
				for (const item of bundle.items) {
					if (element === item.element) {
						return item;
					}
					if (item.content) {
						if (element === item.content.element) {
							return item.content;
						}
						if (item.content.contentInner) {
							if (element === item.content.contentInner.element) {
								return item.content.contentInner;
							}
						}
					}
					if (item.trigger) {
						if (element === item.trigger.element) {
							return item.trigger;
						}
					}
				}
			}
		}
		return false;
	}

	static isAccordion(instance) {
		return instance instanceof this;
	}

	static addAccordion(accordion) {
		if (!this.isAccordion(accordion)) {
			throw new Error(`'accordion' must be an Accordion class instance.`);
		}
		if (this.accordions.has(accordion)) {
			throw new Error(`'accordion' has already been added.`);
		}
		this._accordions.add(accordion);
		return accordion;
	}

	static removeAccordion(accordion) {
		if (this.accordions.has(accordion)) {
			this.accordions.delete(accordion);
			return accordion;
		}
		else {
			this.debug(`Accordion to be removed was not found.`);
			return false;
		}
	}

	static initializeHashChangeListener() {
		if (!this.initializedHashListener) {
			window.addEventListener('hashchange', this.hashChangeHandler.bind(this));
			this.initializedHashListener = true;
		}
	}

	static hashChangeHandler(event) {
		this.openAnchoredItem(event.target.location.hash);
	}

	static openAnchoredItem(hash = location.hash) {
		if (hash) {
			const hashElement = document.querySelector(hash);
			if (hashElement) {
				let itemOpened = false;
				for (const accordion of this.accordions) {
					if (accordion.options.openAnchoredItems) {
						for (const bundle of accordion.bundles) {
							for (const item of bundle.items) {
								if (item.element) {
									if (item.element.contains(hashElement)) {
										item.open(true);
										itemOpened = true;
									}
								}
							}
						}
					}
				}
				if (itemOpened) {
					hashElement.scrollIntoView();
				}
			}
		}
	}

	constructor(options) {
		this.options = options;
		this.Accordion.initializeHashChangeListener();
		this.Accordion.addAccordion(this);
		if (this.options.elements.bundle) {
			this.addBundles(this.options.elements.bundle);
			this.Accordion.openAnchoredItem();
		}
		this.debug(this);
		return this;
	}

	get options() {
		if (!this._options) {
			this._options = this.Accordion.extend({}, this.Accordion.optionsDefault);
		}
		return this._options;
	}

	set options(options) {
		this.Accordion.optionsSchema.validate(options);
		this._options = this.Accordion.extend(this.options, options);
		return this._options;
	}

	get Accordion() {
		return this.constructor;
	}

	get bundles() {
		if (!this._bundles) {
			this._bundles = new Set();
		}
		return this._bundles;
	}

	set bundles(bundles) {
		if (!(bundles instanceof Set)) {
			throw new Error(`'bundles' must be a Set.`);
		}
		if (!Array.from(bundles).every(this.Accordion.Bundle.isBundle)) {
			throw new Error(`'bundles' must only contain Bundle class instances.`);
		}
		this._bundles = bundles;
		return bundles;
	}

	addBundle(element) {
		this.dispatchEvent(this.Accordion.eventNames.addBundle.before, [element]);
		try {
			const bundle = new this.Accordion.Bundle({
				accordion: this,
				element: element
			});
			this.bundles.add(bundle);
			this.dispatchEvent(this.Accordion.eventNames.addBundle.after, [bundle]);
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

	addBundles(elementsInput) {
		let elements = this.Accordion.normalizeElements(elementsInput);
		if (elements.length > 0) {
			elements = this.Accordion.orderElementsByDOMTree(elements, 'asc');
			for (const element of elements) {
				this.addBundle(element);
			}
		}
		else {
			this.debug(`No elements were found when trying to add bundles.`);
		}
	}

	removeBundle(bundle) {
		if (this.bundles.has(bundle)) {
			this.dispatchEvent(this.Accordion.eventNames.removeBundle.before, [bundle]);
			this.bundles.delete(bundle);
			bundle.destroy();
			this.dispatchEvent(this.Accordion.eventNames.removeBundle.after, [bundle.element]);
			return bundle;
		}
		else {
			this.debug(`Bundle to be removed was not found in the set.`);
			return false;
		}
	}

	get eventListeners() {
		if (!this._eventListeners) {
			this._eventListeners = {};
		}
		return this._eventListeners;
	}

	addEventListener(eventName, listener) {
		if (typeof eventName !== 'string') {
			throw new Error(`'eventName' must be a string.`);
		}
		if (typeof listener !== 'function') {
			throw new Error(`'listener' must be a function.`);
		}
		if (!Array.isArray(this.eventListeners[eventName])) {
			this.eventListeners[eventName] = [];
		}
		if (!this.eventListeners[eventName].includes(listener)) {
			this.eventListeners[eventName].push(listener);
		}
	}

	removeEventListener(eventName, listener) {
		if (typeof eventName !== 'string') {
			throw new Error(`'eventName' must be a string.`);
		}
		if (typeof listener !== 'function') {
			throw new Error(`'listener' must be a function.`);
		}
		const thisEventListeners = this.eventListeners[eventName];
		if (Array.isArray(thisEventListeners)) {
			const listenerIndex = thisEventListeners.indexOf(listener);
			if (listenerIndex >= 0) {
				thisEventListeners.splice(listenerIndex, 1);
			}
		}
	}

	dispatchEvent(eventName, parameters) {
		if (typeof eventName !== 'string') {
			throw new Error(`'eventName' must be a string.`);
		}
		if (!Array.isArray(parameters)) {
			throw new Error(`'parameters' must be an array.`);
		}
		const thisEventListeners = this.eventListeners[eventName];
		if (Array.isArray(thisEventListeners)) {
			for (const listener of thisEventListeners) {
				listener.apply(this, parameters);
			}
		}
	}

	destroy() {
		for (const bundle of this.bundles) {
			bundle.destroy();
		}
		this.Accordion.removeAccordion(this);
	}

	debug(...parameters) {
		if (this.options.debug) {
			console.log('Accordion Debug:', ...parameters);
		}
	}

	accessibilityWarn(...parameters) {
		if (this.options.accessibilityWarnings) {
			console.warn('Accordion Accessibility Warning:', ...parameters);
		}
	}

};

/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const ValidationError = __webpack_require__(0);

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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const extend = __webpack_require__(4);
const ValidationError = __webpack_require__(0);

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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const optionsSchema = __webpack_require__(13);
const extend = __webpack_require__(14);

const transitionAuto = (function () {

	function prefixedError(message) {
		throw new Error('transitionAuto error: ' + message);
	}

	function debug(options, ...messages) {
		if (options.debug) {
			console.log('transitionAuto debug: ', ...messages);
		}
	}

	function normalizeOptions(options) {
		options = extend({}, options);

		if (options.innerElement === undefined || options.innerElement === null) {
			if (options.element.children.length > 0) {
				options.innerElement = options.element.children[0];
			}
			else {
				prefixedError(`'options.element' must have at least one child element to use as 'options.innerElement'.`);
			}
		}

		if (typeof options.value === 'number') {
			options.value += 'px';
		}

		if (options.suppressDuplicates === undefined) {
			options.suppressDuplicates = true;
		}

		if (options.debug === undefined) {
			options.debug = false;
		}

		return options;
	}

	function setValue(options) {
		options.element.transitionAutoValue = options.value;
		const computedStyle = getComputedStyle(options.element);
		options.element.style[options.property] = computedStyle[options.property];
		options.element.offsetHeight; // This line does nothing but force the element to repaint so transitions work properly.
		
		let hasTransition = false;
		const transitionPropertyValues = computedStyle.transitionProperty.split(', ');
		const transitionDurationValues = computedStyle.transitionDuration.split(', ');
		for (let i = 0; i < transitionPropertyValues.length; i++) {
			if (transitionPropertyValues[i] === 'all' || transitionPropertyValues[i] === options.property) {
				const transitionDuration = transitionDurationValues[i] ? transitionDurationValues[i] : transitionDurationValues[0];
				if (transitionDuration !== '0s') {
					hasTransition = true;
					break;
				}
			}
		}

		if (hasTransition) {
			debug(options, 'transition detected.');
			if (options.value === 'auto') {
				const elementDimensions = options.element.getBoundingClientRect();
				const innerElementDimensions = options.innerElement.getBoundingClientRect();
				if (elementDimensions[options.property] !== innerElementDimensions[options.property]) {
					options.element.transitionAutoBoundHandler = transitionendHandler.bind(options);
					options.element.addEventListener('transitionend', options.element.transitionAutoBoundHandler);
					options.element.style[options.property] = innerElementDimensions[options.property] + 'px';
					return;
				}
			}
			else {
				if (options.element.style[options.property] !== options.value) {
					options.element.transitionAutoBoundHandler = transitionendHandler.bind(options);
					options.element.addEventListener('transitionend', options.element.transitionAutoBoundHandler);
					options.element.style[options.property] = options.value;
					return;
				}
			}
		}

		debug(options, 'immediate fallback.');
		options.element.style[options.property] = options.value;
		onComplete(options);
	}
	
	function transitionendHandler(event) {
		if (event.propertyName === this.property) {
			if (this.element.transitionAutoBoundHandler) {
				this.element.removeEventListener('transitionend', this.element.transitionAutoBoundHandler);
				delete this.element.transitionAutoBoundHandler;
			}
			if (this.value === 'auto') {
				this.element.style[this.property] = this.value;
			}
		}
		onComplete(this);
	}

	function onComplete(options) {
		if (options.element.transitionAutoValue) {
			delete options.element.transitionAutoValue;
		}
		if (options.onComplete) {
			options.onComplete(options);
		}
	}

	return function (options) {
		try {
			optionsSchema.validate(options);
		}
		catch (error) {
			prefixedError(error);
		}
		options = normalizeOptions(options);
		debug(options, 'options:', options);
		if (options.suppressDuplicates && options.element.transitionAutoValue) {
			if (options.value === options.element.transitionAutoValue) {
				debug(options, 'duplicate suppressed.');
				return;
			}
		}
		if (options.element.transitionAutoBoundHandler) {
			options.element.removeEventListener('transitionend', options.element.transitionAutoBoundHandler);
			delete options.element.transitionAutoBoundHandler;
		}
		setValue(options);
	};

})();

module.exports = transitionAuto;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const Schema = __webpack_require__(2);

const optionsModel = {
	required: true,
	type: 'object',
	allowUnvalidatedProperties: false,
	propertySchema: {
		element: {
			required: true,
			type: 'object',
			instanceOf: Element
		},
		innerElement: {
			type: 'object',
			instanceOf: Element,
			custom: (inputPathManager) => {
				const innerElement = inputPathManager.value;
				inputPathManager.removePathSegment();
				const element = inputPathManager.value.element;
				if (element.contains(innerElement) && element !== innerElement) {
					return true;
				}
				else {
					throw new Schema.ValidationError(`'options.innerElement' must be contained within 'options.element'.`);
				}
			}
		},
		property: {
			required: true,
			type: 'string',
			exactValue: [
				'height',
				'width'
			]
		},
		value: [
			{
				required: true,
				type: 'number',
				greaterThanOrEqualTo: 0
			},
			{
				required: true,
				type: 'string',
				custom: (inputPathManager) => {
					const value = inputPathManager.value;
					if (value.endsWith('px')) {
						return true;
					}
					else {
						throw new Schema.ValidationError(`'options.value' string must end with 'px'.`);
					}
				}
			},
			{
				required: true,
				type: 'string',
				exactValue: 'auto'
			}
		],
		onComplete: {
			type: 'function'
		},
		suppressDuplicates: {
			type: 'boolean'
		},
		debug: {
			type: 'boolean'
		}
	}
};

const optionsSchema = new Schema(optionsModel);

module.exports = optionsSchema;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const isPlainObject = __webpack_require__(5);

const extend = (...arguments) => {
	let target = arguments[0];
	let argumentIndex, merge, mergeIsArray;
	for (argumentIndex = 1; argumentIndex < arguments.length; argumentIndex++) {
		merge = arguments[argumentIndex];
		if (merge === target) {
			continue;
		}
		mergeIsArray = Array.isArray(merge);
		if (mergeIsArray || isPlainObject(merge)) {
			if (mergeIsArray && !Array.isArray(target)) {
				target = [];
			}
			else if (!mergeIsArray && !isPlainObject(target)) {
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

module.exports = extend;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = class CodedError extends Error {
  constructor(code, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CodedError);
    }
    this.code = code;
  }
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

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
		if (typeof accordion.constructor.isAccordion !== 'function' || !accordion.constructor.isAccordion(accordion)) {
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

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = class Trigger {

	constructor(parameters) {
		this.boundClickHandler = this.clickHandler.bind(this);
		this.boundKeydownHandler = this.keydownHandler.bind(this);
		this.boundUpdateAriaControls = this.updateAriaControls.bind(this);
		this.item = parameters.item;
		this.element = parameters.element;
		return this;
	}

	get item() {
		return this._item;
	}

	set item(item) {
		if (typeof item.constructor.isItem !== 'function' || !item.constructor.isItem(item)) {
			throw new Error(`'item' must be an instance of the Item class.`);
		}
		this._item = item;
		return item;
	}

	get accordion() {
		return this.item.accordion;
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
		if (!(element instanceof HTMLButtonElement)) {
			this.accordion.accessibilityWarn(`Accordion trigger should be a <button> element.`);
		}

		element.addEventListener('click', this.boundClickHandler);
		element.addEventListener('keydown', this.boundKeydownHandler);
		element.setAttribute(this.Accordion.dataAttributes.elementType, 'trigger');

		if (element.getAttribute('id')) {
			this.usingExistingId = true;
		}
		else {
			this.usingExistingId = false;
			element.setAttribute('id', 'accordion-trigger-' + this.item.count);
		}

		this.updateAriaControls();
		this.item.element.addEventListener(this.item.constructor.accordionItemAddContentEventName, this.boundUpdateAriaControls);
		this.updateAriaExpanded();

		this._element = element;
		return element;
	}

	updateAriaControls() {
		if (this.element && this.item.content.element) {
			this.element.setAttribute('aria-controls', this.item.content.element.getAttribute('id'));
		}
	}

	updateAriaExpanded() {
		if (this.element) {
			if (this.item.state === 'closing' || this.item.state === 'closed') {
				this.element.setAttribute('aria-expanded', 'false');
			}
			else if (this.item.state === 'opening' || this.item.state === 'opened') {
				this.element.setAttribute('aria-expanded', 'true');
			}
		}
	}

	clickHandler() {
		this.item.toggle();
	}

	keydownHandler(event) {
		if (this.item) {
			if (event.keyCode === 40) { // arrow down
				event.preventDefault();
				event.stopPropagation();
				if (this.item.nextItem.trigger.element) {
					this.item.nextItem.trigger.element.focus();
				}
			}
			else if (event.keyCode === 38) { // arrow up
				event.preventDefault();
				event.stopPropagation();
				this.item.previousItem.trigger.element.focus();
			}
			else if (event.keyCode === 36) { // home
				event.preventDefault();
				event.stopPropagation();
				this.item.bundle.firstItem.trigger.element.focus();
			}
			else if (event.keyCode === 35) { // end
				event.preventDefault();
				event.stopPropagation();
				this.item.bundle.lastItem.trigger.element.focus();
			}
		}
	}

	destroy() {
		delete this.element[this.constructor.elementProperty];
		this.element.removeAttribute(this.constructor.elementDataAttribute);
		this.element.removeEventListener('click', this.boundClickHandler);
		this.element.removeEventListener('keydown', this.boundKeydownHandler);
		if (!this.usingExistingId) {
			this.element.removeAttribute('id');
		}
		this.element.removeAttribute('aria-expanded');
		this.element.removeAttribute('aria-controls');
		this.item.element.removeEventListener(this.item.constructor.accordionItemAddContentEventName, this.boundUpdateAriaControls);
	}

};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = class ContentInner {

	constructor(parameters) {
		this.content = parameters.content;
		this.element = parameters.element;
		return this;
	}

	get content() {
		return this._content;
	}

	set content(content) {
		if (!(content instanceof __webpack_require__(6))) {
			throw new Error(`'content' must be an instance of the Content class.`);
		}
		this._content = content;
	}

	get options() {
		return this.content.item.bundle.accordion.options;
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
		this._element = element;
		element[this.constructor.elementProperty] = this;
		element.setAttribute(this.constructor.elementDataAttribute, 'content-inner');
		return this._element;
	}

	destroy() {
		delete this.element[this.constructor.elementProperty];
		this.element.removeAttribute(this.constructor.elementDataAttribute);
	}

};

/***/ })
/******/ ]);