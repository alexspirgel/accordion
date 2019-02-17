/**
 * Defines a Content.
 */

const Content = class {

	/**
	 * Defines constant class variables.
	 */

	static get constants() {
		return {
			ace_attribute: 'data-ace-content',
			ace_attribute_inner: 'data-ace-content-inner'
		};
	} // End method: static get constants

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

	hasHeightTransition(computed_styles) {
		// If a computed style object was not passed.
		if (!computed_styles) {
			// Get the computed styles of the item element.
			computed_styles = window.getComputedStyle(this.element);
		}
		// Split the transition property value into an array of values.
		const transition_property_array = computed_styles.transitionProperty.split(', ');
		// If height is a transition property.
		if (transition_property_array.indexOf('height') >= 0) {
			return true;
		}
		// If height is not a transition property.
		else {
			return false;
		}
	} // End method: hasHeightTransition

	/**
	 *
	 */

	getComputedHeight(computed_styles) {
		// If a computed style object was not passed.
		if (!computed_styles) {
			// Get the computed styles of the item element.
			computed_styles = window.getComputedStyle(this.element);
		}
		// Get the height and remove 'px' from the end.
		const height = computed_styles.height.slice(0, -2);
		// Return the unitless pixel value.
		return height;
	} // End method: get height

	/**
	 *
	 */

	constructor(item, content_element, content_inner_element) {

		// Set references to the wrapper instances.
		this.wrapper_item = item;

		// Add the content element reference.
		this.element = content_element;
		// Set the ace attribute on the element.
		this.element.setAttribute(this.constructor.constants.ace_attribute, '');
		// Add the this instance object reference to the element.
		this.element.ace_object = this;

		// Add the content inner element reference.
		this.inner_element = content_inner_element;
		// Set the ace attribute on the element.
		this.inner_element.setAttribute(this.constructor.constants.ace_attribute_inner, '');

		// Set the initial_id property.
		this.initial_id = this.element.id;
		// If the element has an id.
		if (this.initial_id !== '') {
			// Assume the initial id is unique.
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

		// Remove the reference to this object from the element.
		this.element.ace_object = undefined;

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