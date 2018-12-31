/**
 * Defines a Content.
 */

const Content = class {

	/**
	 *
	 */

	constructor(parent_instance, content_element) {

		// Set a reference to the parent instance.
		this.parent_instance = parent_instance;

		// Add the content element reference.
		this.element = content_element;

		// Return this instance.
		return this;

	} // End method: constructor

}; // End class: Content

// Export the Content class.
module.exports = Content;