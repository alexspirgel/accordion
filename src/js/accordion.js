// Require Item class.
const Item = require('./item.js');

/**
 * Defines an Accordion.
 */

const Accordion = class {

	/**
	 * Defines constant class variables.
	 */

	static get constants() {
		return {
			count_property: 'accordion_count',
			instances_property: 'accordions',
			id_attribute: 'data-accordion-id',
			item_instances_property: 'items'
		};
	} // End method: static get constants

	/**
	 *
	 */

	get options() {
		// Return options from the parent AceAccordion.
		return this.parent_instance.options;
	} // End method: get options

	/**
	 *
	 */

	get item_elements() {
		// Get item elements and convert the result into an array.
		return Array.from(this.element.querySelectorAll(this.selector + ' > ' + this.options.selectors.item));
	} // End method: get item_elements

	/**
	 *
	 */

	addInstance() {
		// Call the static function to add the instance and return the instance id.
		const instance_id = this.parent_instance.constructor.addInstance({
			instance: this, // The instance to add.
			class_reference: this.parent_instance, // The class to add the instance to.
			count_property: this.constructor.constants.count_property, // The count property on the class.
			list_property: this.constructor.constants.instances_property // The instance list property on the class.
		});
		// Return the instance id.
		return instance_id;
	} // End method: addInstance

	/**
	 *
	 */

	addItem(item_element) {

		// If the callback option value is a function.
		if (typeof this.options.callbacks.item.initialize.before === 'function') {
			// Call the callback function, passing null as this and the item element as an argument.
			this.options.callbacks.item.initialize.before.call(null, item_element);
		}

		// Create a new item.
		const item = new Item(this, item_element);

		// If the callback option value is a function.
		if (typeof this.options.callbacks.item.initialize.after === 'function') {
			// Call the callback function, passing the item object as this and the item element as an argument.
			this.options.callbacks.item.initialize.after.call(item, item_element);
		}

	} // End: method: addItem

	/**
	 *
	 */

	constructor(parent_instance, accordion_element) {

		// Set a reference to the AceAccordion.
		this.parent_instance = parent_instance;

		// Add the accordion element reference.
		this.element = accordion_element;

		// Add this instance to the parent instance and set the instance id.
		this.id = this.addInstance();

		// Set the AceAccordion class instance id data attribute.
		this.element.setAttribute(this.parent_instance.constructor.constants.id_attribute, this.parent_instance.id);
		// Set the Accordion class instance id data attribute.
		this.element.setAttribute(this.constructor.constants.id_attribute, this.id);

		// Create a unique selector for this Accordion.
		this.selector = this.parent_instance.selector + '[' + this.constructor.constants.id_attribute + '="' + this.id + '"]';

		// If there is at least one item.
		if (this.item_elements.length > 0) {
			// For each item element.
			for(let index = 0; index < this.item_elements.length; index++) {
				// Initialize an item.
				this.addItem(this.item_elements[index]);
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

		// Return this instance.
		return this;

	} // End method: constructor

}; // End class: Accordion

// Export the Accordion class.
module.exports = Accordion;