/**
 * Defines a Heading.
 */

const Heading = class {

	/**
	 *
	 */

	get options() {
		// Return options from the wrapper AceAccordion object.
		return this.wrapper_item.wrapper_accordion.wrapper_ace_accordion.options;
	} // End method: get options

	/**
	 *
	 */

	constructor(item, heading_element) {

		// Set references to the wrapper instances.
		this.wrapper_item = item;

		// Add the heading element reference.
		this.element = heading_element;

		// Add the this instance object reference to the element.
		this.element.ace_object = this;

		// Set the heading role attribute to heading.
		heading_element.setAttribute('role', 'heading');
		// Set the heading aria-controls attribute to the item content id.
		heading_element.setAttribute('aria-controls', this.wrapper_item.content.element.id);
		// Set the accordion item heading aria-level attribute.
		// accordion_item_heading.setAttribute('aria-level', accordion_level);
		// Set the accordion item heading aria-expanded attribute.
		// accordion_item_heading.setAttribute('aria-expanded', aria_expanded_value);

		// Return this instance.
		return this;

	} // End method: constructor

}; // End class: Heading

// Export the Heading class.
module.exports = Heading;