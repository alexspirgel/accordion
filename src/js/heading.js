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
		this.element.setAttribute('role', 'heading');
		// Set the heading aria-controls attribute to the item content id.
		this.element.setAttribute('aria-controls', this.wrapper_item.content.element.id);
		// Set the heading aria-level attribute.
		this.element.setAttribute('aria-level', this.wrapper_item.wrapper_accordion.nested_level);
		// Set the aria expanded value to false.
		let aria_expanded_value = false;
		// If the wrapper item is opened.
		if (this.wrapper_item.state === 'opened') {
			// Set the aria expanded value equal to true.
			aria_expanded_value = true;
		}
		// Set the heading aria-expanded attribute.
		this.element.setAttribute('aria-expanded', aria_expanded_value);

		// Return this instance.
		return this;

	} // End method: constructor

	/**
	 *
	 */

	destroy() {
		//
	} // End method: destroy

}; // End class: Heading

// Export the Heading class.
module.exports = Heading;