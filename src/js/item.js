// Require Heading class.
const Heading = require('./heading.js');
// Require Content class.
const Content = require('./content.js');


/**
 * Defines an Item.
 */

const Item = class {

	/**
	 *
	 */

	get options() {
		// Return options from the wrapper AceAccordion object.
		return this.wrapper_accordion.wrapper_ace_accordion.options;
	} // End method: get options

	/**
	 * Defines constant class variables.
	 */

	static get constants() {
		const id_attribute = 'data-ace-item-id';
		const global_selector = '[' + id_attribute + ']';
		return {
			count_property: 'item_count',
			global_selector: global_selector,
			id_attribute: id_attribute,
			instances_property: 'items',
			state_attrubute: 'data-ace-item-state',
			states: [
				'opening',
				'opened',
				'closing',
				'closed'
			]
		};
	} // End method: static get constants

	/**
	 *
	 */

	get index() {
		// Get the items elements from the wrapper accordion.
		const items = this.wrapper_accordion.item_elements;
		// Return the index of this item in the list of items.
		return items.indexOf(this.element);
	} // End method: get index

	/**
	 *
	 */

	get state() {
		// Returns null if attribute is not set.
		return this.element.getAttribute(this.constructor.constants.state_attrubute);
	} // End method: get state

	/**
	 *
	 */

	set state(state) {
		// If the passed value is a valid state.
		if (this.constructor.constants.states.indexOf(state) >= 0) {
			// Set the item state attribute equal to the passed state.
			this.element.setAttribute(this.constructor.constants.state_attrubute, state);
			// Return the state value.
			return state;
		}
		// If the passed value is not a valid state.
		else {
			console.warn('invalid state, options are: ' + this.constructor.constants.states);
			return false;
		}
	} // End method: set state

	/**
	 *
	 */

	addInstance() {
		// Call the static function to add the instance and return the instance id.
		const instance_id = this.wrapper_accordion.wrapper_ace_accordion.constructor.addInstance({
			instance: this, // The instance to add.
			class_reference: this.wrapper_accordion, // The class to add the instance to.
			count_property: this.constructor.constants.count_property, // The count property on the class.
			list_property: this.constructor.constants.instances_property // The instance list property on the class.
		});
		// Return the instance id.
		return instance_id;
	} // End method: addInstance

	/**
	 * Check if this item matches the criteria.
	 */

	matches(criteria) {

		// If the criteria is a node list.
		if (criteria instanceof NodeList) {
			// Convert the criteria into an array.
			criteria = Array.from(criteria);
		}

		// If the criteria is an array.
		if (Array.isArray(criteria)) {
			// For each value in the criteria array.
			for (let value = 0; value < criteria.length; value++) {
				// If the recursive call matches the criteria to the item.
				if (this.matches(criteria[value])) {
					return true;
				}
			}
		}

		// If the criteria is a number (index).
		else if (typeof criteria === 'number') {
			// If the criteria is an integer.
			if (Number.isInteger(criteria)) {
				// If the criteria is greater than or equal to zero.
				if (criteria >= 0) {
					// If the item matches the criteria index.
					if (this.index === criteria) {
						return true;
					}
				}
			}
		}

		// If the criteria is a string (selector).
		else if (typeof criteria === 'string') {
			// If the item matches the criteria selector.
			if (this.element.matches(criteria)) {
				return true;
			}
		}

		// If the criteria is an element.
		else if (criteria instanceof Element) {
			// If the item matches the criteria element.
			if (this.element === criteria) {
				return true;
			}
		}

		// If the item does not match the criteria.
		return false;

	} // End method: matches

	/**
	 *
	 */

	initializeContent(element, inner_element) {
		//
		return new Content(this, element, inner_element);
	} // End method: initializeContent

	/**
	 *
	 */

	initializeHeading(element) {
		//
		if (this.content) {
			//
			return new Heading(this, element);
		}
	} // End method: initializeHeading

	/**
	 *
	 */

	get immediateChildrenAccordions() {
		//
		const immediate_children_accordions = [];
		//
		const global_accordion_selector = this.wrapper_accordion.constructor.constants.global_selector;
		//
		const global_item_selector = this.constructor.constants.global_selector;
		// Get all nested accordions.
		const nested_accordions = this.element.querySelectorAll(global_accordion_selector);
		// For each nested accordion.
		for (let accordion = 0; accordion < nested_accordions.length; accordion++) {
			//
			let current_accordion = nested_accordions[accordion];
			//
			let current_accordion_parent_item = current_accordion.parentNode.closest(global_item_selector);
			//
			if (current_accordion_parent_item === this.element) {
				//
				immediate_children_accordions.push(current_accordion);
			}
		}
		//
		return immediate_children_accordions;
	}

	/**
	 *
	 */

	open(immediate) {

		// If the multiple_open_items option is set to false.
		if (this.options.multiple_open_items === false) {
			// Get all items in this accordion.
			let items = this.wrapper_accordion.items;
			// For each item.
			for (let item = 0; item < items.length; item++) {
				// If this element is not equal to the current loop item element.
				if (this.element !== items[item].element) {
					// Close the loop item.
					items[item].close();
				}
			}
		}

		// Update the aria-expanded property on the heading trigger element.
		this.heading.trigger_element.setAttribute('aria-expanded', 'true');
		// Update the aria-hidden attribute on the content element.
		this.content.element.setAttribute('aria-hidden', 'false');

		// If height is a transition property on the content element and the immediate flag is not true.
		if (this.content.hasHeightTransition() && !immediate) {
			// Get the current content height.
			const content_height_start = this.content.getComputedHeight();
			// Set the content to its starting height.
			this.content.element.style.height = content_height_start + 'px';
			// Update the item state.
			this.state = 'opening';
			// Get the height of the inner content.
			const content_inner_height = this.content.inner_element.offsetHeight;
			// Set the content height to match the content inner height.
			this.content.element.style.height = content_inner_height + 'px';
		}
		// If height is not a transition property or the immediate flag is true.
		else {
			// Open immediately.
			this.open_finish();
		}

	} // End method: open

	/**
	 *
	 */

	open_finish() {
		// Update the item state.
		this.state = 'opened';
		// Remove the inline height style, if there is one.
		this.content.element.style.height = '';
	} // End method: open_finish

	/**
	 *
	 */

	close(immediate) {
		// If height is a transition property on the content element and the immediate flag is not true.
		if (this.content.hasHeightTransition() && !immediate) {
			// Get the current content height.
			const content_height_start = this.content.getComputedHeight();
			// Set the content to its starting height.
			this.content.element.style.height = content_height_start + 'px';
			// Update the item state.
			this.state = 'closing';
			// This line does nothing but force repaint of the content element for the transition to work properly.
			this.content.element.offsetHeight;
			// Set the content height to zero.
			this.content.element.style.height = '0px';
		}
		// If height is not a transition property or the immediate flag is true.
		else {
			// Close immediately.
			this.close_finish();
		}
	} // End method: close

	/**
	 *
	 */

	close_finish() {

		// Update the aria-expanded property on the heading trigger element.
		this.heading.trigger_element.setAttribute('aria-expanded', 'true');
		// Update the aria-hidden attribute on the content element.
		this.content.element.setAttribute('aria-hidden', 'false');

		// Update the item state.
		this.state = 'closed';

		// Remove the inline height style, if there is one.
		this.content.element.style.height = '';

		// If the close_nested_items option is set to true.
		if (this.options.close_nested_items === true) {}


/**/
// If the close item children is true.
// if(accordion_options.close_child_items === true) {
// 	// Get nested accordions.
// 	const nested_accordions = accordion_item.querySelectorAll('[' + Accordion.id_attribute + ']');
// 	// For each nested accordion.
// 	for(let nested_accordion = 0; nested_accordion < nested_accordions.length; nested_accordion++) {
// 		// Get this current nested accordion.
// 		const this_nested_accordion = nested_accordions[nested_accordion];
// 		// Get this nested accordion parent accordion.
// 		const this_nested_accordion_parent_accordion = this_nested_accordion.parentNode.closest('[' + Accordion.id_attribute + ']');
// 		// If the parent accordion matches the original item parent accordion. This ensures we only select accordions one level away.
// 		if(this_nested_accordion_parent_accordion === accordion_parent) {
// 			// For each item in the nested accordion.
// 			for(let nested_item = 0; nested_item < this_nested_accordion.accordion_items.length; nested_item++) {
// 				// Get the current nested item.
// 				const this_nested_item = this_nested_accordion.accordion_items[nested_item];
// 				// Close the nested item.
// 				Accordion.closeItem(this_nested_item, true);
// 			}
// 		}
// 	} // End option: close_child_items.

// }
/**/


	} // End method: close_finish

	/**
	 *
	 */

	toggle() {
		// If this item is opening, or opened.
		if (this.state === 'opening' || this.state === 'opened') {
			this.close();
		}
		// If this item is closing, or closed.
		else if (this.state === 'closing' || this.state === 'closed') {
			// Open the item.
			this.open();
		}
	} // End method: toggle

	/**
	 *
	 */

	handleTransitionend(event) {
		// If the transitionend event was on the height property.
		if (event.propertyName === 'height') {
			// Get the item object.
			const item = this.ace_object.wrapper_item;
			// If this item is opening.
			if (item.state === 'opening') {
				// Finish opening the item.
				item.open_finish();
			}
			// If this item is closing.
			else if (item.state === 'closing') {
				// Finish closing the item.
				item.close_finish();
			}
		}
	} // End method: handleTransitionend

	/**
	 *
	 */

	constructor(accordion, item_element) {

		// Set a reference to the wrapper instance.
		this.wrapper_accordion = accordion;

		// Add the item element reference.
		this.element = item_element;

		// Add the this instance object reference to the element.
		this.element.ace_object = this;

		// Add this instance to the wrapper instance and set the instance id.
		this.id = this.addInstance();

		// Set the Accordion class instance id data attribute.
		this.element.setAttribute(this.constructor.constants.id_attribute, this.id);

		// Create a unique selector for this item.
		this.selector = this.wrapper_accordion.selector + ' > [' + this.constructor.constants.id_attribute + '="' + this.id + '"]';

		// Initialize the item state.
		let initial_state = 'closed';
		// If the default_open_items option value is not false, null, or undefined.
		if (this.options.default_open_items !== false || this.options.default_open_items !== null || typeof this.options.default_open_items !== 'undefined') {
			// If the element matches the default_open_items value.
			if (this.matches(this.options.default_open_items)) {
				// Set the item state value to opened.
				initial_state = 'opened';
			}
		}
		// Set the item state.
		this.state = initial_state;

		// Get the content element.
		const content_element = this.element.querySelector(this.selector + ' > ' + this.options.selectors.content);
		// Get the content inner element.
		const content_inner_element = this.element.querySelector(this.selector + ' > ' + this.options.selectors.content + ' > ' + this.options.selectors.content_inner);
		//
		if (content_element && content_inner_element) {
			//
			this.content = this.initializeContent(content_element, content_inner_element);
		}

		// Get the heading element.
		const heading_element = this.element.querySelector(this.selector + ' > ' + this.options.selectors.heading);
		//
		if (heading_element) {
			//
			this.heading = this.initializeHeading(heading_element);
		}

		//
		this.transitionendListener = this.content.element.addEventListener('transitionend', this.handleTransitionend);

		// Return this instance.
		return this;

	} // End method: constructor

	/**
	 *
	 */

	destroy() {
		//
	} // End method: destroy

}; // End class: Item

// Export the Item class.
module.exports = Item;