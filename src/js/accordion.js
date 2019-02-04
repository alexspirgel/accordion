// Require Item class.
const Item = require('./item.js');

/**
 * Defines an Accordion.
 */

const Accordion = class {

	/**
	 *
	 */

	get options() {
		// Return options from the wrapper AceAccordion object.
		return this.wrapper_ace_accordion.options;
	} // End method: get options

	/**
	 * Defines constant class variables.
	 */

	static get constants() {
		const id_attribute = 'data-ace-accordion-id';
		const global_selector = '[' + id_attribute + ']';
		return {
			count_property: 'accordion_count',
			global_selector: global_selector,
			id_attribute: id_attribute,
			instances_property: 'accordions',
			item_instances_property: 'items'
		};
	} // End method: static get constants

	/**
	 *
	 */

	get parent_accordion() {
		// Get the parent node.
		// We do this because Element.closest can match with itself.
		const parent_node = this.element.parentNode;
		// Get the closest parent accordion.
		let parent_accordion = parent_node.closest('[' + this.constructor.constants.id_attribute + ']');
		// If a parent accordion exists.
		if (parent_accordion) {
			// Set parent_accordion equal to the ace object.
			parent_accordion = parent_accordion.ace_object;
		}
		// Return the parent accordion object, or null.
		return parent_accordion;
	} // End method: get parent_accordion

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
		const instance_id = this.wrapper_ace_accordion.constructor.addInstance({
			instance: this, // The instance to add.
			class_reference: this.wrapper_ace_accordion, // The class to add the instance to.
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

	constructor(ace_accordion, accordion_element) {

		// Set a reference to the wrapper instance.
		this.wrapper_ace_accordion = ace_accordion;

		// Add the accordion element reference.
		this.element = accordion_element;

		// Add the this instance object reference to the element.
		this.element.ace_object = this;

		// Add this instance to the wrapper instance and set the instance id.
		this.id = this.addInstance();

		// Set the AceAccordion class instance id data attribute.
		this.element.setAttribute(this.wrapper_ace_accordion.constructor.constants.id_attribute, this.wrapper_ace_accordion.id);
		// Set the Accordion class instance id data attribute.
		this.element.setAttribute(this.constructor.constants.id_attribute, this.id);

		// Create a unique selector for this Accordion.
		this.selector = this.wrapper_ace_accordion.selector + '[' + this.constructor.constants.id_attribute + '="' + this.id + '"]';

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

	/**
	 *
	 */

	destroy() {
		//
	} // End method: destroy

}; // End class: Accordion

// Export the Accordion class.
module.exports = Accordion;