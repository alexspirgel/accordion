/**
 * Defines an Item.
 */

const Item = class {

	/**
	 * Defines constant class variables.
	 */

	static get constants() {
		return {
			instances_property: 'items',
			index_attribute: 'data-item-index',
			state_attrubute: 'data-item-state',
			states: [
				'opened',
				'opening',
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
	} // End: get options

	/**
	 *
	 */

	set index(index) {
		// If the passed value is an integer.
		if (Number.isInteger(index)) {
			// Set the item index attribute equal to the passed index.
			this.element.setAttribute(this.constructor.constants.index_attribute, index);
			// Return the index value.
			return index;
		}
		// If the passed value is not a valid index.
		else {
			console.warn('invalid index, must be an integer');
			return false;
		}
	} // End method: set index

	/**
	 *
	 */

	get index() {
		// Returns null if attribute is not set.
		return this.element.getAttribute(this.constructor.constants.index_attribute);
	} // End method: get index

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

	get state() {
		// Returns null if attribute is not set.
		return this.element.getAttribute(this.constructor.constants.state_attrubute);
	} // End method: get state

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

	constructor(parent_instance, item_element, item_index) {

		// Set a reference to the parent instance.
		this.parent_instance = parent_instance;

		// Add the item element reference.
		this.element = item_element;

		//
		this.index = item_index;

		// Initialize the item state.
		let initial_state = 'closed';

		// Get the default_open_items options value.
		const default_open_items = this.options.default_open_items;
		// If the option value is not false, null, or undefined.
		if (default_open_items !== false || default_open_items !== null || typeof default_open_items !== 'undefined') {
			// If the element matches the default_open_items value.
			if (this.matches(default_open_items)) {
				// Set the item state value to opened.
				initial_state = 'opened';
			}
		}

		// Set the item state.
		this.state = initial_state;

		// Get the content element.
		const content_element = this.element.querySelector( // Scope the selector results to within this element.
			parent_instance.selector + // Get the parent accordion.
			' > ' + this.options.selectors.item + // Items directly nested within the parent accordion.
			' > ' + this.options.selectors.content); // Content directly nested within the parent item.
		console.log(content_element);

		// Return this instance.
		return this;

	} // End method: constructor

}; // End class: Item

// Export the Item class.
module.exports = Item;