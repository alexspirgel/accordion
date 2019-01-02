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

		// Return this instance.
		return this;

	} // End method: constructor

}; // End class: Heading

// Export the Heading class.
module.exports = Heading;