// Require Heading class.
const Heading = require('./heading.js');
// Require Content class.
const Content = require('./content.js');


/**
 * Defines an Item.
 */

const Item = class {

	/**
	 *
	 */

	get options() {
		// Return options from the wrapper AceAccordion object.
		return this.wrapper_accordion.wrapper_ace_accordion.options;
	} // End method: get options

	/**
	 * Defines constant class variables.
	 */

	static get constants() {
		return {
			count_property: 'item_count',
			instances_property: 'items',
			id_attribute: 'data-ace-item-id',
			state_attrubute: 'data-ace-item-state',
			states: [
				'opening',
				'opened',
				'closing',
				'closed'
			]
		};
	} // End method: static get constants

	/**
	 *
	 */

	get index() {
		// Get the items elements from the wrapper accordion.
		const items = this.wrapper_accordion.item_elements;
		// Return the index of this item in the list of items.
		return items.indexOf(this.element);
	} // End method: get index

	/**
	 *
	 */

	get state() {
		// Returns null if attribute is not set.
		return this.element.getAttribute(this.constructor.constants.state_attrubute);
	} // End method: get state

	/**
	 *
	 */

	set state(state) {
		// If the passed value is a valid state.
		if (this.constructor.constants.states.indexOf(state) >= 0) {
			// Set the item state attribute equal to the passed state.
			this.element.setAttribute(this.constructor.constants.state_attrubute, state);
			// Return the state value.
			return state;
		}
		// If the passed value is not a valid state.
		else {
			console.warn('invalid state, options are: ' + this.constructor.constants.states);
			return false;
		}
	} // End method: set state

	/**
	 *
	 */

	addInstance() {
		// Call the static function to add the instance and return the instance id.
		const instance_id = this.wrapper_accordion.wrapper_ace_accordion.constructor.addInstance({
			instance: this, // The instance to add.
			class_reference: this.wrapper_accordion, // The class to add the instance to.
			count_property: this.constructor.constants.count_property, // The count property on the class.
			list_property: this.constructor.constants.instances_property // The instance list property on the class.
		});
		// Return the instance id.
		return instance_id;
	} // End method: addInstance

	/**
	 * Check if this item matches the criteria.
	 */

	matches(criteria) {

		// If the criteria is a node list.
		if (criteria instanceof NodeList) {
			// Convert the criteria into an array.
			criteria = Array.from(criteria);
		}

		// If the criteria is an array.
		if (Array.isArray(criteria)) {
			// For each value in the criteria array.
			for (let value = 0; value < criteria.length; value++) {
				// If the recursive call matches the criteria to the item.
				if (this.matches(criteria[value])) {
					return true;
				}
			}
		}

		// If the criteria is a number (index).
		else if (typeof criteria === 'number') {
			// If the criteria is an integer.
			if (Number.isInteger(criteria)) {
				// If the criteria is greater than or equal to zero.
				if (criteria >= 0) {
					// If the item matches the criteria index.
					if (this.index === criteria) {
						return true;
					}
				}
			}
		}

		// If the criteria is a string (selector).
		else if (typeof criteria === 'string') {
			// If the item matches the criteria selector.
			if (this.element.matches(criteria)) {
				return true;
			}
		}

		// If the criteria is an element.
		else if (criteria instanceof Element) {
			// If the item matches the criteria element.
			if (this.element === criteria) {
				return true;
			}
		}

		// If the item does not match the criteria.
		return false;

	} // End method: matches

	/**
	 *
	 */

	initializeContent(element) {
		//
		return new Content(this, element);
	} // End method: initializeContent

	/**
	 *
	 */

	initializeHeading(element) {
		//
		if (this.content) {
			//
			return new Heading(this, element);
		}
	} // End method: initializeHeading

	/**
	 *
	 */

	hasHeightTransition() {
		// Get the computed styles of the item element.
		const transition_property_value = window.getComputedStyle(this.element).transitionProperty;
		// SPlit the transition property value into an array of values.
		const transition_property_array = transition_property_value.split(', ');
		// If height is a transition property.
		if (transition_property_array.indexOf('height') >= 0) {
			return true;
		}
		// If height is not a transition property.
		else {
			return false;
		}
	} // End method: hasHeightTransition

	/**
	 *
	 */

	open(immediate) {

		// If the multiple_open_items option is set to false.
		if (this.options.multiple_open_items === false) {
			// Get all items in this accordion.
			let items = this.wrapper_accordion.items;
			// For each item.
			for (let item = 0; item < items.length; item++) {
				// If this element is not equal to the current loop item element.
				if (this.element !== items[item].element) {
					// Close the loop item.
					items[item].close();
				}
			}
		}

		// Update the aria-expanded property on the heading trigger element.
		this.heading.trigger_element.setAttribute('aria-expanded', 'true');
		// Update the aria-hidden attribute on the content element.
		this.content.element.setAttribute('aria-hidden', 'false');

		// If height is a transition property.
		if (this.hasHeightTransition() && immediate !== true) {
			// Get the current item height.
			const height_start = this.element.offsetHeight;
			// Set the item to its starting height..
			this.element.style.height = height_start + 'px';
			// Update the item state.
			this.state = 'opening';
			// Get the height of the heading.
			const heading_height = this.heading.element.getBoundingClientRect().height;
			// Get the height of the content.
			const content_height = this.content.element.getBoundingClientRect().height;
			// Calculate the end height for the item.
			const end_height = heading_height + content_height;
			// Set the accordion item to it's end height.
			this.element.style.height = end_height + 'px';
		}
		// If height is not a transition property.
		else {
			// Finish the opening process immediately.
			this.open_finish();
		}

	} // End method: open

	/**
	 *
	 */

	open_finish() {
		// Update the item state.
		this.state = 'opened';
		// Remove the inline height style, if there is one.
		this.element.style.removeProperty('height');
	} // End method: open_finish

	/**
	 *
	 */

	close(immediate) {
		//
	} // End method: close

	/**
	 *
	 */

	close_finish() {
		//
	} // End method: close_finish

	/**
	 *
	 */

	toggle() {
		// If this item is opening, or opened.
		if (this.state === 'opening' || this.state === 'opened') {
			console.log('close it');
		}
		// If this item is closing, or closed.
		else if (this.state === 'closing' || this.state === 'closed') {
			console.log('open it');
			// Open the item.
			this.open();
		}
	} // End method: toggle

	/**
	 *
	 */

	handleTransitionend(event) {
		// If the transitionend event was on the height property.
		if (event.propertyName === 'height') {
			// Finish opening th item.
			this.ace_object.open_finish();
		}
	} // End method: handleTransitionend

	/**
	 *
	 */

	constructor(accordion, item_element) {

		// Set a reference to the wrapper instance.
		this.wrapper_accordion = accordion;

		// Add the item element reference.
		this.element = item_element;

		// Add the this instance object reference to the element.
		this.element.ace_object = this;

		// Add this instance to the wrapper instance and set the instance id.
		this.id = this.addInstance();

		// Set the Accordion class instance id data attribute.
		this.element.setAttribute(this.constructor.constants.id_attribute, this.id);

		// Create a unique selector for this item.
		this.selector = this.wrapper_accordion.selector + ' > [' + this.constructor.constants.id_attribute + '="' + this.id + '"]';

		// Initialize the item state.
		let initial_state = 'closed';
		// If the default_open_items option value is not false, null, or undefined.
		if (this.options.default_open_items !== false ||
			this.options.default_open_items !== null ||
			typeof this.options.default_open_items !== 'undefined') {
			// If the element matches the default_open_items value.
			if (this.matches(this.options.default_open_items)) {
				// Set the item state value to opened.
				initial_state = 'opened';
			}
		}
		// Set the item state.
		this.state = initial_state;

		// Get the content element.
		const content_element = this.element.querySelector(this.selector + ' > ' + this.options.selectors.content);
		//
		if (content_element) {
			//
			this.content = this.initializeContent(content_element);
		}

		// Get the heading element.
		const heading_element = this.element.querySelector(this.selector + ' > ' + this.options.selectors.heading);
		//
		if (heading_element) {
			//
			this.heading = this.initializeHeading(heading_element);
		}

		//
		this.transitionendListener = this.element.addEventListener('transitionend', this.handleTransitionend);

		// Return this instance.
		return this;

	} // End method: constructor

	/**
	 *
	 */

	destroy() {
		//
	} // End method: destroy

}; // End class: Item

// Export the Item class.
module.exports = Item;