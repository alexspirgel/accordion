/**
 * Defines a Content.
 */

const Content = class {

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

	generateId() {
		// Generate a unique id based off wrapper instance ids.
		return 'accordion-content-' + this.wrapper_item.wrapper_accordion.wrapper_ace_accordion.id + '-' + this.wrapper_item.wrapper_accordion.id + '-' + this.wrapper_item.id;
	} // End method: generateId

	/**
	 *
	 */

	constructor(item, content_element) {

		// Set references to the wrapper instances.
		this.wrapper_item = item;

		// Add the content element reference.
		this.element = content_element;

		// Add the this instance object reference to the element.
		this.element.ace_object = this;

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