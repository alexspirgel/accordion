/**
 * Defines a Heading.
 */

const Heading = class {

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

	constructor(parent_instance, heading_element) {

		// Set a reference to the parent instance.
		this.parent_instance = parent_instance;

		// Add the heading element reference.
		this.element = heading_element;

		// Set the heading role attribute to heading.
		heading_element.setAttribute('role', 'heading');
		// Set the heading aria-controls attribute to the item content id.
		heading_element.setAttribute('aria-controls', this.parent_instance.content.element.id);
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