// Require Heading class.
const Heading = require('./heading.js');
// Require Content class.
const Content = require('./content.js');


/**
 * Defines an Item.
 */

const Item = class {

	/**
	 * Defines constant class variables.
	 */

	static get constants() {
		return {
			count_property: 'item_count',
			instances_property: 'items',
			id_attribute: 'data-item-id',
			state_attrubute: 'data-item-state',
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

	get options() {
		// Return options from the parent instance.
		return this.parent_instance.options;
	} // End method: get options

	/**
	 *
	 */

	get index() {
		// Get the items elements from the parent instance.
		const items = this.parent_instance.item_elements;
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
		const instance_id = this.parent_instance.parent_instance.constructor.addInstance({
			instance: this, // The instance to add.
			class_reference: this.parent_instance, // The class to add the instance to.
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

	initializeHeading(heading_element) {
		//
	} // End method: initializeHeading

	/**
	 *
	 */

	constructor(parent_instance, item_element) {

		// Set a reference to the parent instance.
		this.parent_instance = parent_instance;

		// Add the item element reference.
		this.element = item_element;

		// Add this instance to the parent instance and set the instance id.
		this.id = this.addInstance();

		// Set the Accordion class instance id data attribute.
		this.element.setAttribute(this.constructor.constants.id_attribute, this.id);

		// Create a unique selector for this item.
		this.selector = this.parent_instance.selector + ' > [' + this.constructor.constants.id_attribute + '="' + this.id + '"]';

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
		this.content = new Content(this, content_element);

		// Get the heading element.
		const heading_element = this.element.querySelector(this.selector + ' > ' + this.options.selectors.heading);
		this.heading = new Heading(this, heading_element);

		// Return this instance.
		return this;

	} // End method: constructor

}; // End class: Item

// Export the Item class.
module.exports = Item;