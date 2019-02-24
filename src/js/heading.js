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
	 * Defines constant class variables.
	 */

	static get constants() {
		return {
			ace_attribute: 'data-ace-heading'
		};
	} // End method: static get constants

	/**
	 *
	 */

	determineTriggerElement(selector) {
		// If the selector is a string.
		if (typeof selector === 'string') {
			// Get trigger element using the selector.
			const custom_trigger_element = this.element.querySelector(selector);
			// If the selector matches an element within the heading.
			if (custom_trigger_element) {
				// Return the element.
				return custom_trigger_element;
			}
		}
		// If the selector is not valid or has no matching element.
		// Return the heading element.
		return this.element;
	} // End method: determineTriggerElement

	/**
	 *
	 */

	handleClick(event) {
		// Trigger the toggle method on the wrapper item.
		this.ace_object.wrapper_item.toggle('click', false);
	} // End method: handleClick

	/**
	 *
	 */

	handleKeyDown(event) {
		// Get the accordion parent item.
		const this_ace_object = event.target.ace_object;
		switch(event.keyCode) {
			// If key code is up arrow.
			case 38:
				this_ace_object.wrapper_item.focusTrigger('previous');
				break;
			// If key code is down arrow.
			case 40:
				this_ace_object.wrapper_item.focusTrigger('next');
				break;
		}
	} // End method: handleKeyDown

	/**
	 *
	 */

	constructor(item, heading_element) {

		// Set references to the wrapper instances.
		this.wrapper_item = item;

		// Add the heading element reference.
		this.element = heading_element;

		// Set the trigger element.
		this.trigger_element = this.determineTriggerElement(this.options.heading_trigger_selector);

		// Add the this instance object reference to the element.
		this.element.ace_object = this;
		// Add the this instance object reference to the trigger element.
		this.trigger_element.ace_object = this;

		// Set the ace attribute on the element.
		this.element.setAttribute(this.constructor.constants.ace_attribute, '');

		// Set the heading aria-controls attribute to the item content id.
		this.trigger_element.setAttribute('aria-controls', this.wrapper_item.content.element.id);
		// Set the aria expanded value to false.
		let aria_expanded_value = false;
		// If the wrapper item is opened.
		if (this.wrapper_item.state === 'opened') {
			// Set the aria expanded value equal to true.
			aria_expanded_value = true;
		}
		// Set the heading aria-expanded attribute.
		this.trigger_element.setAttribute('aria-expanded', aria_expanded_value);

		//
		this.trigger_element.addEventListener('click', this.handleClick);
		//
		this.trigger_element.addEventListener('keydown', this.handleKeyDown);

		// Return this instance.
		return this;

	} // End method: constructor

	/**
	 *
	 */

	destroy() {
		
		// Remove the reference to this object from the element.
		this.element.ace_object = undefined;
		// Remove the reference to this object from the trigger element.
		this.trigger_element.ace_object = undefined;

		// Remove the aria-controls attribute. 
		this.trigger_element.removeAttribute('aria-controls');
		// Remove the aria-expanded attribute. 
		this.trigger_element.removeAttribute('aria-expanded');

		// Remove the click event listener.
		this.trigger_element.removeEventListener('click', this.handleClick);
		// Remove the key down event listener.
		this.trigger_element.removeEventListener('keydown', this.handleKeyDown);

		// Remove the reference to this object from the parent.
		this.wrapper_item.heading = undefined;

	} // End method: destroy

}; // End class: Heading

// Export the Heading class.
module.exports = Heading;