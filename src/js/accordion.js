// Require accordion class.
const Item = require('./item.js');

/**
 * Defines an Accordion.
 */

const Accordion = class {

	/**
	 * Defines a set of constant class variables.
	 */

	static get constants() {
		return {
			id_attribute: 'data-accordion-id'
		};
	} // End: constants

	/**
	 *
	 */

	get options() {
		// Return options from the parent AceAccordion.
		return this.ace_accordion.options;
	} // End: get options

	/**
	 *
	 */

	constructor(ace_accordion, accordion_element) {

		// Set a reference to the AceAccordion.
		this.ace_accordion = ace_accordion;

		// Add this Accordion class instance to the AceAccordion.
		this.id = this.ace_accordion.constructor._setClassInstance(this, this.ace_accordion, 'accordions', 'accordion_count');
		// Add the accordion element reference.
		this.element = accordion_element;

		// Set the AceAccordion class instance id data attribute.
		this.element.setAttribute(this.ace_accordion.constructor.constants.id_attribute, this.ace_accordion.id);
		// Set the Accordion class instance id data attribute.
		this.element.setAttribute(this.constructor.constants.id_attribute, this.id);

		// Create a unique selector for this Accordion class instance.
		// Unique selector is a combination of AceAccordion and Accordion class instance ids.
		this.selector = this.ace_accordion.selector + '[' + this.constructor.constants.id_attribute + '="' + this.id + '"]';

		// Get the items in this accordion.
		const item_elements = this.element.querySelectorAll(this.selector + ' > ' + this.options.selectors.item);
		// If there is at least one item.
		if (item_elements.length > 0) {
			// For each item.
			for(let item_element = 0; item_element < item_elements.length; item_element++) {
				// Initialize an item.
				const item = new Item(this, item_elements[item_element]);
			}
		}
		// If there are no items in this accordion.
		else {
			// If debug is true.
			if (this.options.debug) {
				// Send a warning to the console.
				console.warn(this.constructor.name + ": No items found using selector: '" + this.options.selectors.item + "'");
			}
		}

		// If debug is true.
		if (this.options.debug) {
			// Log the classes.
			console.log('Debug: Accordion Class:');
			console.dir(this.constructor);
			// Log the instance.
			console.log('Debug: AceAccordion - ' + this.ace_accordion.id + ':');
			console.log('Debug: Accordion - ' + this.id + ':');
			console.dir(this);
		}

		// Return this instance.
		return this;

	} // End: constructor

};

// Export the Accordion class.
module.exports = Accordion;