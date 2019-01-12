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

		// Set the initial_id property.
		this.initial_id = this.element.id;
		// If the element has an id.
		if (this.initial_id !== '') {
			// Assume the initial id is unique.
			// Leave as is.
		}
		// If the element does not have an id.
		else {
			// Generate and set a unique id.
			this.element.id = this.generateId();
		}

		// Set the aria expanded value to false.
		let aria_hidden_value = true;
		// If the wrapper item is opened.
		if (this.wrapper_item.state === 'opened') {
			// Set the aria expanded value equal to true.
			aria_hidden_value = false;
		}
		// Set the heading aria-expanded attribute.
		this.element.setAttribute('aria-hidden', aria_hidden_value);

		// Return this instance.
		return this;

	} // End method: constructor

	/**
	 *
	 */

	destroy() {

		// If the element id matches the initial id.
		if (this.element.id === this.initial_id) {
			// Leave as is.
		}
		// If the element id does not match the initial id.
		else {
			// Reset the id attribute.
			this.element.setAttribute('id', this.initial_id);
		}

		// Remove the aria-hidden attribute. 
		this.element.removeAttribute('aria-hidden');

		// Remove the reference to this object from the parent.
		this.wrapper_item.content = undefined;

	} // End method: destroy

}; // End class: Content

// Export the Content class.
module.exports = Content;