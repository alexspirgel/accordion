/**
 * Defines a Content.
 */

const Content = class {

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

	generateId() {
		// Get parent instance objects.
		const parent_item = this.parent_instance;
		const parent_accordion = parent_item.parent_instance;
		const parent_ace_accordion = parent_accordion.parent_instance;
		// Generate a unique id based off parent instance ids.
		return 'accordion-content-' + parent_ace_accordion.id + '-' + parent_accordion.id + '-' + parent_item.id;
	} // End method: generateId

	/**
	 *
	 */

	constructor(parent_instance, content_element) {

		// Set a reference to the parent instance.
		this.parent_instance = parent_instance;

		// Add the content element reference.
		this.element = content_element;

		// If the element does not have an id.
		if (this.element.id === '') {
			// Generate and set a unique id.
			this.element.id = this.generateId();
		}

		// Return this instance.
		return this;

	} // End method: constructor

}; // End class: Content

// Export the Content class.
module.exports = Content;