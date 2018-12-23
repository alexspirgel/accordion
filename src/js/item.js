/**
 * Defines an Item.
 */

const Item = class {

	/**
	 * Defines a set of constant class variables.
	 */

	static get constants() {
		return {
			state_attrubute: 'data-item-state'
		};
	} // End: constants

	/**
	 *
	 */

	get options() {
		// Return options from the parent Accordion.
		return this.accordion.options;
	} // End: get options

	/**
	 *
	 */

	set state(state) {
		if (state === 'opened' || state === 'opening' || state === 'closing' || state === 'closed') {
			this.element.setAttribute(this.constructor.constants.state_attrubute, state);
			return true;
		}
		else {
			console.warn('invalid state');
			return false;
		}
	} // End: set state

	/**
	 *
	 */

	get state() {
		// Returns null if attribute is not set.
		return this.element.getAttribute(this.constructor.constants.state_attrubute);
	} // End get state

	/**
	 *
	 */

	get index() {
		// Get the item elements in the accordion and convert the result into an array.
		let item_elements = Array.from(this.accordion.element.querySelectorAll(this.accordion.selector + ' > ' + this.options.selectors.item));
		// Return the index of the item.
		// Will return negative one if the item cannot be found.
		return item_elements.indexOf(this.element);
	} // End: get index

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

	} // End: matches

	/**
	 *
	 */

	constructor(accordion, item_element) {

		// Set a reference to the Accordion.
		this.accordion = accordion;

		// Add the item element reference.
		this.element = item_element;

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

		//
		this.state = initial_state;

		// If debug is true.
		if (this.options.debug) {
			// Log the classes.
			console.log('Debug: Item Class:');
			console.dir(this.constructor);
			// Log the instance.
			console.log('Debug: AceAccordion - ' + this.accordion.ace_accordion.id + ':');
			console.log('Debug: Accordion - ' + this.accordion.id + ':');
			console.dir(this);
		}

		// Return this instance.
		return this;

	} // End: constructor

};

// Export the Item class.
module.exports = Item;