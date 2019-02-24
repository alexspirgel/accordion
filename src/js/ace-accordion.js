/**
 * AceAccordion v1.0.0
 * https://github.com/alexspirgel/accordion
 */

// Require extend function.
const extend = require('@alexspirgel/extend');
// Require Accordion class.
const Accordion = require('./accordion.js');

/**
 * Defines an Ace Accordion (a handling wrapper for the Accordion Class).
 */

const AceAccordion = class {

	/**
	 * Defines the default set of options.
	 */

	static get options_default() {
		return {
			selectors: {
				accordion: '.accordion', // {string} Custom accordion element selector.
				item: '.accordion__item', // {string} Custom item element selector.
				heading: '.accordion__item__heading', // {string} Custom heading element selector.
				content: '.accordion__item__content', // {string} Custom content element selector.
				content_inner: '.accordion__item__content__inner' // {string} Custom content inner element selector.
			},
			// accessibility_warnings: true, // {boolean} Log detected accessibility issues as warnings.
			close_nested_items: false, // {boolean} Close immediate nested items. Can chain down levels depending on nested options.
			// custom_css: false, // {boolean} When true, prevent the script from adding it's own styles (not recommended).
			default_open_items: null, // {number|string|object|array} Initializes item(s) to default open by default.
			heading_trigger_selector: null, // {string} Selector (scoped within heading) to trigger item open/close, rather than entire heading element.
			multiple_open_items: true, // {boolean} When true, allow multiple items to be open at the same time.
			// open_anchored_items: false, // {boolean} When anchored to an accordion item, open it.
			trigger_on_hover: false, // {boolean} Trigger open/close based on if the cursor is hovered over the item.
			callbacks: {
				accordion: {
					initialize: {
						before: null,
						after: null
					}
				},
				item: {
					initialize: {
						before: null,
						after: null
					},
					open: {
						// before: null,
						// after: null
					},
					close: {
						// before: null,
						// after: null
					}
				}
			},
			debug: false // Log helpful messages to the console for development.
		};
	} // End method: static get options_default

	/**
	 * Defines constant class variables.
	 */

	static get constants() {
		return {
			id_attribute: 'data-ace-instance-id'
		};
	} // End method: static get constants

	/**
	 *
	 */

	get accordion_elements() {
		// Get accordion elements and convert the result into an array.
		return Array.from(document.querySelectorAll(this.options.selectors.accordion));
	} // End method: get accordion_elements

	/**
	 * Adds an instance to a class.
	 * @returns {number} instance_id - The id of the instance (zero indexed).
	 */

	static addInstance(holder, count_property, list_property, instance) {
		// Generate the instance id from the instance count.
		const instance_id = holder[count_property];
		// Increment the instance count.
		holder[count_property]++;
		// Add the instance to the instances list.
		holder[list_property][instance_id] = instance;
		// Return the instance id.
		return instance_id;

	} // End method: static addInstance

	/**
	 *
	 */

	addAceAccordion() {

		//
		if (typeof this.constructor.ace_accordion_count !== 'number') {
			//
			this.constructor.ace_accordion_count = 0;
		}

		//
		if (typeof this.constructor.ace_accordions !== 'object') {
			//
			this.constructor.ace_accordions = {};
		}

		// Call the static function to add the instance.
		return this.constructor.addInstance(this.constructor, 'ace_accordion_count', 'ace_accordions', this);

	} // End method: addAceAccordion

	/**
	 *
	 */

	addAccordion(accordion_element) {

		// If the callback option value is a function.
		if (typeof this.options.callbacks.accordion.initialize.before === 'function') {
			// Call the callback function, passing null as this and the accordion element as an argument.
			this.options.callbacks.accordion.initialize.before.call(null, accordion_element);
		}

		// Get the next instance id.
		// The current instance count equals the next instance id because the id is zero indexed.
		const accordion_id = this.accordion_count;

		// Create a new accordion.
		const accordion = new Accordion(this, accordion_id, accordion_element);

		//
		if (accordion) {
			// Call the static function to add the instance.
			this.constructor.addInstance(this, 'accordion_count', 'accordions', accordion);
		}

		// If the callback option value is a function.
		if (typeof this.options.callbacks.accordion.initialize.after === 'function') {
			// Call the callback function, passing the accordion object as this and the accordion element as an argument.
			this.options.callbacks.accordion.initialize.after.call(accordion, accordion_element);
		}

	} // End method: addAccordion

	/**
	 * AceAccordion class constructor.
	 * @param {object} options_user - A set of override options supplied by the user.
	 * @returns {object} this - The reference to this instance.
	 */

	constructor(options_user) {

		// For now, assume passed parameter is a correctly formed options object.
		// TO-DO: implement schema checking script.

		// Merge default options and user options into new object using the imported extend function.
		this.options = extend([{}, this.constructor.options_default, options_user], true);
		// Add this instance to the static class object and set the instance id on this instance.
		this.id = this.addAceAccordion();
		// Create a selector for the unique local instance id.
		this.selector = '[' + this.constructor.constants.id_attribute + '="' + this.id + '"]';

		//
		this.accordion_count = 0;
		//
		this.accordions = {};

		// If there at least one element matching the accordion selector.
		if (this.accordion_elements.length > 0) {
			// For each matching accordion element.
			for (let accordion_element = 0; accordion_element < this.accordion_elements.length; accordion_element++) {
				// Initialize an accordion.
				this.addAccordion(this.accordion_elements[accordion_element]);
			}
		}
		// If there are no elements matching the accordion selector.
		else {
			// Send a warning to the console.
			console.warn(this.constructor.name + ": No accordions found using selector: '" + this.options.selectors.accordion + "'");
		}

		// If debug is true.
		if (this.options.debug) {
			// Log the class.
			console.log('AceAccordion Debug: AceAccordion Class:');
			console.dir(this.constructor);
		}

		// Return this instance.
		return this;

	} // End method: constructor

	/**
	 *
	 */

	destroy() {
		//
	} // End method: destroy

}; // End class: AceAccordion

// If script is being required as a node module.
if (typeof module !== 'undefined' && module.exports) {
	// Export the AceAccordion class.
	module.exports = AceAccordion;
}
