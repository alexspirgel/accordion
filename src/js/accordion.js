/**
 * Accordion v1.0.0
 * https://github.com/alexspirgel/accordion
 */

// Require extend function.
const extend = require('@alexspirgel/extend');

/**
 * Defines an accordion.
 */

const Accordion = class {

	/**
	 * Defines the default set of options.
	 */

	static get options_default() {
		return {
			"selectors": {	
				"accordion": ".accordion",
				"item": ".accordion__item",
				"heading": ".accordion__item__heading",
				"content": ".accordion__item__content"
			},
			"aria_label": "Accordion item group", // maybe set in html? or at least check if it is already set
			"multiple_open_items": true,
			"default_open_items": false, // false || 1 || [1, 3, 7]
			"close_nested_items": false, // only closes one nested level deep, but it can set off a chain reaction to close them all
			// "scroll_to_top": {
			// 	"enabled": true,
			// 	"scroll_element": window,
			// 	"transition": {
			// 		"enabled": true,
			// 		"duration": 500, // Transition duration in milliseconds.
			// 		"cancel_on_scroll": true,
			// 		"easing_function": (t) => {return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;} // Ease In Out Cubic.
			// 	}
			// },
			// "callbacks": {
			// 	"accordion": {
			// 		"initialize": {
			// 			"before": (accordion_element, accordion_object) => {},
			// 			"after": (accordion_element, accordion_object) => {}
			// 		}
			// 	},
			// 	"item": {
			// 		"initialize": {
			// 			"before": (item_element, accordion_object) => {},
			// 			"after": (item_element, accordion_object) => {}
			// 		},
			// 		"open": {
			// 			"before": (item_element, accordion_object) => {},
			// 			"after": (item_element, accordion_object) => {}
			// 		},
			// 		"close": {
			// 			"before": (item_element, accordion_object) => {},
			// 			"after": (item_element, accordion_object) => {}
			// 		}
			// 	}
			// }
		};
	} // End: options_default

	/**
	 * Defines a set of constant class variables.
	 */

	static get static_constants() {
		return {
			data_property: 'accordion_data',
			id_attribute: 'data-accordion-id',
			item_state_attrubute: 'data-accordion-item-state'
		};
	} // End: static_constants

	/**
	 * Increments the class instance counter.
	 */

	static incrementInstanceCount() {
		if (typeof Accordion.instance_count == 'undefined') {
			Accordion.instance_count = 1;
		}
		else {
			Accordion.instance_count++;
		}
	} // End: incrementInstanceCount

	/**
	 * Initialize content.
	 */

	initializeContent(content_element) {}

	/**
	 * Initialize a heading.
	 */

	initializeHeading(heading_element) {}

	/**
	 * Initialize an item.
	 */

	initializeItem(item_element) {}

	/**
	 * Initialize an accordion.
	 */

	 initializeAccordion(accordion_element) {
	 	// Initialize the accordion data object on the element.
	 	accordion_element[Accordion.static_constants.data_property] = {};
	 }


	constructor(options_user) {

		// Increment the instance count.
		Accordion.incrementInstanceCount();

		// Set the input user options object.
		this.options_user = options_user;
		// Merge default options and user options into new object using the imported extend function.
		this.options = extend([{}, Accordion.options_default, this.options_user], true);

		// Get the accordion element(s).
		const accordion_elements = document.querySelectorAll(this.options.selectors.accordion);
		// For each accordion.
		for(let accordion_element = 0; accordion_element < accordion_elements.length; accordion_element++) {
			// Get the accordion element for the current loop.
			this_accordion_element = accordion_elements[accordion_element];
			// Initialize the accordion.
			initializeAccordion(this_accordion_element);
		}

		// Initialize the accordion with the merged options.
		// this.initialize(this.options);

		// Return the reference to the accordion class instance.
		return this;

	} // End: constructor

	

	

	/**
	 * Handles a click event on an accordion item heading.
	 */

	static headingClickEventHandler(event) {
		// Get the accordion parent item.
		const accordion_item = event.target.accordion_item_parent;
		// Toggle the accordion item.
		Accordion.toggleItem(accordion_item);
	} // End function: headingClickEventHandler.

	/**
	 * Handles a key down event on an accordion item heading.
	 */

	static headingKeyDownEventHandler(event) {
		// Get the accordion parent item.
		const accordion_item = event.target.accordion_item_parent;
		switch(event.keyCode) {
			// If key code is up arrow.
			case 38:
				Accordion.focusItem(accordion_item, 'previous');
				break;
			// If key code is down arrow.
			case 40:
				Accordion.focusItem(accordion_item, 'next');
				break;
		}
	} // End function: headingKeyDownEventHandler.

	/**
	 * Handles an open transition end event.
	 */

	static headingOpenTransitionEndEventHandler(event) {
		const accordion_parent = event.target.accordion_parent;
		const accordion_options = accordion_parent.accordion_options;
		if(event.target.matches(accordion_options.selectors.item)){
				Accordion.finishOpeningItem(event.target);
		}
	} // End function: headingOpenTransitionEndEventHandler.

	/**
	 * Handles a close transition end event.
	 */

	static headingCloseTransitionEndEventHandler(event) {
		const accordion_parent = event.target.accordion_parent;
		const accordion_options = accordion_parent.accordion_options;
		if(event.target.matches(accordion_options.selectors.item)){
				Accordion.finishClosingItem(event.target);
		}
	} // End function: headingCloseTransitionEndEventHandler.

	static openItem(accordion_item, skip_transition) {

		// Remove the close transitionend event listener.
		accordion_item.removeEventListener('transitionend', Accordion.headingCloseTransitionEndEventHandler);
		// Get the accordion element.
		const accordion_parent = accordion_item.accordion_parent;
		// Get the accordion options.
		const accordion_options = accordion_parent.accordion_options;

		// If multiple open items are not allowed.
		if(accordion_options.multiple_open_items === false) {
			// Get all the accordion items within this accordion.
			const accordion_items = accordion_parent.children;
			// For each accordion item.
			for(let accordion_item = 0; accordion_item < accordion_items.length; accordion_item++) {
				// If the accordion item is open or opening.
				if(accordion_items[accordion_item].matches('[' + Accordion.item_state_attrubute + '="opening"], [' + Accordion.item_state_attrubute + '="opened"]')) {
					// Close the accordion item.
					Accordion.closeItem(accordion_items[accordion_item]);
				}
			}
		} // End option: multiple_open_items.

		// Get the current item height.
		const item_height_start = accordion_item.offsetHeight;
		// Set the item to its current height, keeping it at that height.
		accordion_item.style.height = item_height_start + 'px';
		// Set the accordion item state attribute to show the beginning of the opening process.
		accordion_item.setAttribute(Accordion.item_state_attrubute, 'opening');
		// Set the related aria attributes to show the accordion is open.
		accordion_item.accordion_item_heading.setAttribute('aria-expanded', 'true');
		accordion_item.accordion_item_content.setAttribute('aria-hidden', 'false');

		// Skip transition is true.
		if(skip_transition) {
			// Finish opening the item immediately, disregarding transitions.
			Accordion.finishOpeningItem(accordion_item);
		}
		// If skip transition is false or not passed, continue with the transition as normal.
		else {
			// Get the height of the accordion heading.
			const item_heading_height = accordion_item.accordion_item_heading.offsetHeight;
			// Get the height of the accordion content.
			const item_content_height = accordion_item.accordion_item_content.offsetHeight;
			// Calculate the end height for the accordion item.
			const item_height_end = item_heading_height + item_content_height;
			// Add an open transitionend event listener to the accordion item.
			accordion_item.addEventListener('transitionend', Accordion.headingOpenTransitionEndEventHandler);
			// Set the accordion item to it's end height.
			accordion_item.style.height = item_height_end + 'px';
		}

	} // End function: openItem.

	/**
	 * Finish opening the accordion item.
	 */

	static finishOpeningItem(accordion_item) {
		// Remove the open transitionend event listener.
		accordion_item.removeEventListener('transitionend', Accordion.headingOpenTransitionEndEventHandler);
		// Get the accordion element.
		const accordion_parent = accordion_item.accordion_parent;
		// Remove the explicit height (should default back to auto).
		accordion_item.style.removeProperty('height');
		// Set the accordion item state attribute to show the item has finished opening.
		accordion_item.setAttribute(Accordion.item_state_attrubute, 'opened');
	}

	/**
	 *
	 */

	static closeItem(accordion_item, skip_transition) {

		// Remove the open transitionend event listener.
		accordion_item.removeEventListener('transitionend', Accordion.headingOpenTransitionEndEventHandler);
		// Get the accordion element.
		const accordion_parent = accordion_item.accordion_parent;
		// Get the accordion options.
		const accordion_options = accordion_parent.accordion_options;
		// Get the current item height.
		const item_height_start = accordion_item.offsetHeight;
		// Set the item to its current height.
		accordion_item.style.height = item_height_start + 'px';
		// Set the accordion item state attribute to show the beginning of the closing process.
		accordion_item.setAttribute(Accordion.item_state_attrubute, 'closing');
		// Set the related aria attributes to show the accordion is closed.
		accordion_item.accordion_item_heading.setAttribute('aria-expanded', 'false');
		accordion_item.accordion_item_content.setAttribute('aria-hidden', 'true');

		// Skip transition is true.
		if(skip_transition) {
			// Finish closing the item immediately, disregarding transitions.
			// The passed argument must mimic the event listener event.
			Accordion.finishClosingItem(accordion_item);
		}
		else {
			// Get the height of the accordion heading.
			const item_heading_height = accordion_item.accordion_item_heading.offsetHeight;
			// Add a close transitionend event listener to the accordion item.
			accordion_item.addEventListener('transitionend', Accordion.headingCloseTransitionEndEventHandler);
			// Set the accordion item to it's heading height.
			accordion_item.style.height = item_heading_height + 'px';
		}

	} // End function: closeItem.

	/**
	 * Finish closing the accordion item.
	 */

	static finishClosingItem(accordion_item) {
		// Remove the close transitionend event listener.
		accordion_item.removeEventListener('transitionend', Accordion.headingCloseTransitionEndEventHandler);
		// Get the accordion element.
		const accordion_parent = accordion_item.accordion_parent;
		// Get the accordion options.
		const accordion_options = accordion_parent.accordion_options;
		// Remove the explicit height (should default back to auto).
		accordion_item.style.removeProperty('height');
		// Set the accordion item state attribute to show the item has finished closing.
		accordion_item.setAttribute(Accordion.item_state_attrubute, 'closed');

		// If the close item children is true.
		if(accordion_options.close_nested_items === true) {
			// Get nested accordions.
			const nested_accordions = accordion_item.querySelectorAll('[' + Accordion.id_attribute + ']');
			// For each nested accordion.
			for(let nested_accordion = 0; nested_accordion < nested_accordions.length; nested_accordion++) {
				// Get this current nested accordion.
				const this_nested_accordion = nested_accordions[nested_accordion];
				// Get this nested accordion parent accordion.
				const this_nested_accordion_parent_accordion = this_nested_accordion.parentNode.closest('[' + Accordion.id_attribute + ']');
				// If the parent accordion matches the original item parent accordion. This ensures we only select accordions one level away.
				if(this_nested_accordion_parent_accordion === accordion_parent) {
					// For each item in the nested accordion.
					for(let nested_item = 0; nested_item < this_nested_accordion.accordion_items.length; nested_item++) {
						// Get the current nested item.
						const this_nested_item = this_nested_accordion.accordion_items[nested_item];
						// Close the nested item.
						Accordion.closeItem(this_nested_item, true);
					}
				}
			} // End option: close_nested_items.

		}
	}

	/**
	 * Opens or closes an accordion item based on it's current state.
	 */

	static toggleItem(accordion_item) {
		// Get the current accordion item state.
		const accordion_item_state = accordion_item.getAttribute(Accordion.item_state_attrubute);
		// If the accordion item is currently closed.
		if(accordion_item_state === 'closed' || accordion_item_state === 'closing') {
			// Open the accordion item.
			Accordion.openItem(accordion_item);
		}
		// If the accordion is currently opening.
		else if(accordion_item_state === 'opening' || accordion_item_state === 'opened') {
			// Close the accordion item.
			Accordion.closeItem(accordion_item);
		}
	}

	/**
	 * Sets the user focus on a specific accordion item or the previous or next item within the accordion.
	 */

	static focusItem(accordion_item, option) {
		let item_to_focus = accordion_item;
		if(option) {
			const accordion_items_list = accordion_item.accordion_parent.accordion_items;
			for(let i = 0; i < accordion_items_list.length; i++) {
				if(accordion_items_list[i] === accordion_item) {
					if(option === 'previous' && i > 0) {
						item_to_focus = accordion_items_list[i - 1];
					}
					else if(option === 'next' && i < (accordion_items_list.length - 1)) {
						item_to_focus = accordion_items_list[i + 1];
					}
					else {
						// console.log('There is no ' + option + ' item in this accordion.');
					}
					break;
				}
			}
		}
		item_to_focus.accordion_item_heading.focus();
	}

	/**
	 * Gets or sets the passed accordion and child accordion's aria level value.
	 */

	static nestedLevel(accordion_element, nested_level) {
		const accordion_data = accordion_element[Accordion.static_constants.data_property];
		if (nested_level) {
			accordion_data.nested_level = nested_level;
			// Get all accordion children elements.
			const immediate_child_accordions = accordion_element.querySelectorAll('[' + Accordion.static_constants.id_attribute + ']');
			// For each child accordion.
			for(let accordion_child = 0; accordion_child < accordion_children.length; accordion_child++) {
				// Get this current child accordion element.
				this_accordion_child_element = accordion_children[accordion_child];
				// Get the current aria-level.
				const current_aria_level = parseInt(this_aria_level_element.getAttribute('aria-level'));
				// Set a new aria-level one greater than before.
				this_aria_level_element.setAttribute('aria-level', (current_aria_level + 1));
			}
		}
		else {
			return accordion_element[Accordion.static_constants.data_property].nested_level;
		}
	}

	/**
	 * Initializes an accordion.
	 *
	 * @param {object} options - The merged options used to configure the accordion.
	 */

	initialize(options) {

		let this_accordion_element,
		this_accordion_data,
		accordions_existing,
		accordion_next_id,
		accordion_nested_level,
		accordion_parent,
		accordion_children,
		this_accordion_child_element;

		// Get the accordion element(s).
		const accordion_elements = document.querySelectorAll(options.selectors.accordion);

		// For each accordion.
		for(let accordion_element = 0; accordion_element < accordion_elements.length; accordion_element++) {

			// Get this current accordion element for the loop.
			this_accordion_element = accordion_elements[accordion_element];
			// Initialize the accordion data object on the element.
			this_accordion_element[Accordion.static_constants.data_property] = {};
			// Define a shortcut to this accordion's data, for code clarity.
			this_accordion_data = this_accordion_element[Accordion.static_constants.data_property];
			
			// Attach the accordion element to the accordion data.
			this_accordion_data.element = this_accordion_element;

			// Attach the accordion options to the accordion data.
			this_accordion_data.options = options;

			// Get the existing accordions.
			accordions_existing = document.querySelectorAll('[' + Accordion.static_constants.id_attribute + ']');
			// Generate the next accordion id.
			accordion_next_id = accordions_existing.length + 1;
			while (document.querySelector('[' + Accordion.static_constants.id_attribute + ']="' + thing + '"')) {
				thing++;
			}

			// Set the accordion id data attribute.
			this_accordion_element.setAttribute(Accordion.static_constants.id_attribute, accordion_next_id);
			// Set this accordion selector by accordion id attribute.
			this_accordion_data.unique_selector = '[' + Accordion.static_constants.id_attribute + '="' + accordion_next_id + '"]';

			//
			// Item
			//

			// Get accordion items.
			const accordion_items = this_accordion_element.querySelectorAll(this_accordion_data.selector + ' > ' + options.selectors.item);
			// Attach the accordion items to the accordion element.
			this_accordion_element.accordion_items = accordion_items;
			// For each accordion item.
			for(let accordion_item = 0; accordion_item < accordion_items.length; accordion_item++) {
				// Get this current item element in the accordion.
				const this_accordion_item = accordion_items[accordion_item];
				// Attach the accordion parent to the accordion item element.
				this_accordion_item.accordion_parent = this_accordion_element;
				// Initialize item state values.
				let item_state_attrubute_value = 'closed';
				let aria_hidden_value = 'true';
				let aria_expanded_value = 'false';
				// If this is the first accordion item and the first item default open option is set to true.
				if(accordion_item === 0 && options.first_item_default_open) {
					// Set the state values as open for the accordion item.
					item_state_attrubute_value = 'opened';
					aria_hidden_value = 'false';
					aria_expanded_value = 'true';
				}
				// Set the item state.
				this_accordion_item.setAttribute(Accordion.item_state_attrubute, item_state_attrubute_value);

				//
				// Content
				//

				// Get accordion item content.
				const accordion_item_content = this_accordion_item.querySelector(options.selectors.content);
				// Attach the accordion item content to the accordion item element.
				this_accordion_item.accordion_item_content = accordion_item_content;
				// Attach the accordion parent to the accordion item content element.
				accordion_item_content.accordion_parent = this_accordion_element;
				// Attach the accordion item parent to the accordion item content element.
				accordion_item_content.accordion_item_parent = this_accordion_item;
				// Get the next available accordion id.
				const accordion_item_content_uuid = uuid();
				// Set the accordion item content id.
				accordion_item_content.id = accordion_item_content_uuid;
				// Set the accordion item content aria-hidden attribute.
				accordion_item_content.setAttribute('aria-hidden', aria_hidden_value);

				//
				// Heading
				//

				// Get accordion item heading.
				const accordion_item_heading = this_accordion_item.querySelector(options.selectors.heading);
				// Attach the accordion item heading to the accordion item element.
				this_accordion_item.accordion_item_heading = accordion_item_heading;
				// Attach the accordion parent to the accordion item heading element.
				accordion_item_heading.accordion_parent = this_accordion_element;
				// Attach the accordion item parent to the accordion item heading element.
				accordion_item_heading.accordion_item_parent = this_accordion_item;
				// Set the accordion item heading role attribute.
				accordion_item_heading.setAttribute('role', 'heading');
				// Set the accordion item heading aria-controls attribute to the accordion item content id.
				accordion_item_heading.setAttribute('aria-controls', accordion_item_content.id);
				// Set the accordion item heading aria-level attribute.
				accordion_item_heading.setAttribute('aria-level', accordion_level);
				// Set the accordion item heading aria-expanded attribute.
				accordion_item_heading.setAttribute('aria-expanded', aria_expanded_value);
				// Add click event listener to toggle the accordion item opened/closed state.
				accordion_item_heading.addEventListener('click', Accordion.headingClickEventHandler);
				// Add key down event listener for switching between accordion items and accessibility.
				accordion_item_heading.addEventListener('keydown', Accordion.headingKeyDownEventHandler);

			} // End loop: accordion_items.

			// Set the accordion aria-label attribute.
			this_accordion_element.setAttribute('aria-label', this_accordion_data.options.aria_label);

			// Get the closest parent accordion.
			// Closest must be called on the parent node to prevent it from returning the node it's being called form.
			accordion_parent = this_accordion_element.parentNode.closest('[' + Accordion.static_constants.id_attribute + ']');
			// If a parent accordion exists.
			if(accordion_parent) {
				// Add one to the parent aria-level for the current accordion aria-level.
				accordion_nested_level = Accordion.nestedLevel(accordion_parent) + 1;
			}
			// If there is no parent accordion (the accordion is not nested in another accordion).
			else {
				// Set the accordion aria-level attribute value.
				accordion_nested_level = 1;
			}
			// Set this accordion and nested accordion's nested level.
			Accordion.nestedLevel(this_accordion_element, accordion_nested_level);

			// Get all accordion children elements.
			accordion_children = this_accordion_element.querySelectorAll('[' + Accordion.static_constants.id_attribute + ']');
			// For each child accordion.
			for(let accordion_child = 0; accordion_child < accordion_children.length; accordion_child++) {
				// Get this current child accordion element.
				this_accordion_child_element = accordion_children[accordion_child];
				// Get the current aria-level.
				const current_aria_level = parseInt(this_aria_level_element.getAttribute('aria-level'));
				// Set a new aria-level one greater than before.
				this_aria_level_element.setAttribute('aria-level', (current_aria_level + 1));
			}

		} // End loop accordion_elements.

	} // End function: initialize.
};

// If script is being required as a node module.
if (typeof module !== 'undefined' && module.exports) {
	// Export the accordion class.
	module.exports = Accordion;
}
