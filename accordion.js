/**
 * Accordion v1.0.0
 * https://github.com/alexspirgel/accordion
 */

// Import uuidv4 function.
// import {uuid} from '../uuid/uuid,js';
/*
https://stackoverflow.com/a/2117523
https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random)
*/
const uuid = () => {
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
};

// Import extend function.
// import {extend} from '../extend/extend.js';
const extend = (target_object, merge_objects, deep) => {

	const extendObject = (target_object, merge_object, deep) => {
		// For each property in the merge_object.
		for(let property in merge_object) {
			// If the merge_object value is an object, is not null, and the deep flag is true.
			if(typeof merge_object[property] === 'object' && merge_object[property] !== null && deep) {
				// If the merge_object value is a special case.
				if(merge_object[property].toString() === '[object Window]' || merge_object[property].toString() === '[object HTMLDocument]') {
					// Set the target_object property value equal to the merge_object property value.
					target_object[property] = merge_object[property];
					// Continue past the normal deep object handling.
					continue;
				}
				// If the merge_object value is an array.
				if(Array.isArray(merge_object[property])) {
					// Set the target_object value equal to an empty array (arrays are replaced, not merged).
					target_object[property] = [];
				}
				// If the target_object value is not an object or if it is null.
				else if(typeof target_object[property] !== 'object' || target_object[property] === null) {
					// Set the target_object value equal to an empty object.
					target_object[property] = {};
				}
				// Call the extendObject function recursively.
				extendObject(target_object[property], merge_object[property], deep);
				// Continue to the next property, skipping the normal value assignment.
				continue;
			}
			// Set the target_object property value equal to the merge_object property value (primitive values or shallow calls).
			target_object[property] = merge_object[property];
		}
		// Return the target_object.
		return target_object;
	};

	// If merge_objects is not an array, make it an array.
	if(!Array.isArray(merge_objects)) {
		merge_objects = [merge_objects];
	}
	// For each object in merge_objects.
	for(let object = 0; object < merge_objects.length; object++) {
		// Extend the target_object with the merge_object.
		extendObject(target_object, merge_objects[object], deep);
	}

	// Return the extended target_object.
	return target_object;
};

/**
 * Defines an accordion.
 */

const Accordion = class {

	constructor(options_user) {

		// Set the input user options object.
		this.options_user = options_user;
		// Set the default options object.
		this.options_default = {
			"selectors": {	
				"accordion": ".accordion",
				"item": ".accordion__item",
				"heading": ".accordion__item__heading",
				"content": ".accordion__item__content"
			},
			"aria_label": "Accordion item group.",
			"allow_multiple_open_items": true,
			"first_item_default_open": false,
			"close_child_items": false,
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
		}; // End variable: options_default.

		// Merge default options and user options into new object using the imported extend function.
		this.options = extend({}, [this.options_default, this.options_user], true);
		// Initialize the accordion with the merged options.
		this.initialize(this.options);
		// Return the reference to the accordion class instance.
		return this;

	} // End function: constructor.

	/**
	 * Static properties
	 */

	static get id_attribute() {
		return 'data-accordion-id';
	}

	static get item_state_attrubute() {
		return 'data-accordion-item-state';
	}

	/**
	 *
	 */

	static openItem(accordion_item, skip_transition) {

		/**
		 * Finish opening the accordion item.
		 */

		const finishOpening = () => {
			// If the accordion item is still opening (not interrupted).
			if(accordion_item.getAttribute(Accordion.item_state_attrubute) === 'opening') {
				// Remove the explicit height (should default back to auto).
				accordion_item.style.removeProperty('height');
				// Set the accordion item state attribute to show the item has finished opening.
				accordion_item.setAttribute(Accordion.item_state_attrubute, 'opened');
			}
			// If the accordion item is no longer opening (interrupted).
			else {
				// Nothing.
			}
			// Remove the transition end event listener.
			accordion_item.removeEventListener('transitionend', finishOpening);
		}; // End function: finishOpening.


		// Get the accordion element.
		const accordion_parent = accordion_item.accordion_parent;
		// Get the accordion options.
		const accordion_options = accordion_parent.accordion_options;

		// If multiple open items are not allowed.
		if(accordion_options.allow_multiple_open_items === false) {
			// Get all the open items within this accordion.
			const open_items = accordion_parent.querySelectorAll('[' + Accordion.item_state_attrubute + '="opened"]');
			// For each open item.
			for(let open_item = 0; open_item < open_items.length; open_item++) {
				// Close the accordion item.
				Accordion.closeItem(open_items[open_item]);
			}
		}

		// Get the current item height.
		const item_height_start = accordion_item.offsetHeight;
		// Set the item to its current height, keeping it at that height.
		accordion_item.style.height = item_height_start + 'px';
		// Set the accordion item state attribute to show the beginning of the opening process.
		accordion_item.setAttribute(Accordion.item_state_attrubute, 'opening');
		// Set the related aria attributes to show the accordion is open.
		accordion_item.accordion_item_heading.setAttribute('aria-expanded', 'true');
		accordion_item.accordion_item_content.setAttribute('aria-hidden', 'false');

		if(skip_transition) {
			finishOpening();
		}
		else {
			// Get the height of the accordion heading.
			const item_heading_height = accordion_item.accordion_item_heading.offsetHeight;
			// Get the height of the accordion content.
			const item_content_height = accordion_item.accordion_item_content.offsetHeight;
			// Calculate the end height for the accordion item.
			const item_height_end = item_heading_height + item_content_height;
			// Add a transition end event listener to the accordion item.
			accordion_item.addEventListener('transitionend', finishOpening);
			// Set the accordion item to it's end height.
			accordion_item.style.height = item_height_end + 'px';
		}

	} // End function: openItem.

	/**
	 *
	 */

	static closeItem(accordion_item, skip_transition) {

		/**
		 * Finish closing the accordion item.
		 */

		const finishClosing = () => {
			// If the accordion item is still closing (not interrupted).
			if(accordion_item.getAttribute(Accordion.item_state_attrubute) === 'closing') {
				// Remove the explicit height (should default back to auto).
				accordion_item.style.removeProperty('height');
				// Set the accordion item state attribute to show the item has finished closing.
				accordion_item.setAttribute(Accordion.item_state_attrubute, 'closed');

				// If the close item children is true.
				if(accordion_options.close_child_items === true) {
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
						
					}
				}

			}
			// If the accordion item is no longer closing (interrupted).
			else {
				// Nothing.
			}
			// Remove the transition end event listener.
			accordion_item.removeEventListener('transitionend', finishClosing);
		}; // End function: finishClosing.

		const accordion_parent = accordion_item.accordion_parent;
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

		if(skip_transition) {
			finishClosing();
		}
		else {
			// Get the height of the accordion heading.
			const item_heading_height = accordion_item.accordion_item_heading.offsetHeight;
			// Add a transition end event listener to the accordion item.
			accordion_item.addEventListener('transitionend', finishClosing);
			// Set the accordion item to it's heading height.
			accordion_item.style.height = item_heading_height + 'px';
		}

	} // End function: closeItem.

	/**
	 * Opens or closes an accordion item based on it's current state.
	 */

	static toggleItem(accordion_item) {
		// Get the current accordion item state.
		const accordion_item_state = accordion_item.getAttribute(Accordion.item_state_attrubute);
		// If the accordion item is currently closed.
		if(accordion_item_state === 'closed') {
			// Open the accordion item.
			Accordion.openItem(accordion_item);
		}
		// If the accordion item is currently closing.
		else if(accordion_item_state === 'closing') {
			// Open the accordion item.
			Accordion.openItem(accordion_item);
		}
		// If the accordion is currently opening.
		else if(accordion_item_state === 'opening') {
			// Close the accordion item.
			Accordion.closeItem(accordion_item);
		}
		// If the accordion is currently open.
		else if(accordion_item_state === 'opened') {
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
	 * Handles a click event on an accordion item heading.
	 */

	headingClick(event) {
		// Get the accordion parent item.
		const accordion_item = event.target.accordion_item_parent;
		// Toggle the accordion item.
		Accordion.toggleItem(accordion_item);
	} // End function: headingClick.

	/**
	 * Handles a key down event on an accordion item heading.
	 */

	headingKeyDown(event) {
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
	} // End function: headingKeyDown.

	/**
	 * Initializes an accordion.
	 *
	 * @param {object} options - The merged options used to configure the accordion.
	 */

	initialize(options) {
		
		//
		// Accordion
		//

		// Get the accordion element(s).
		const accordion_elements = document.querySelectorAll(options.selectors.accordion);
		// For each accordion.
		for(let accordion_element = 0; accordion_element < accordion_elements.length; accordion_element++) {
			// Get this current accordion element for the loop.
			const this_accordion_element = accordion_elements[accordion_element];
			// Attach the accordion options to the accordion element.
			this_accordion_element.accordion_options = options;
			// Generate UUID.
			const this_accordion_uuid = uuid();
			// Set this accordion selector by identifier attribute UUID.
			const this_accordion_selector = '[' + Accordion.id_attribute + '="' + this_accordion_uuid + '"]';
			// Set the universal accordion identifier data attribute.
			this_accordion_element.setAttribute(Accordion.id_attribute, this_accordion_uuid);
			// Set the accordion aria-label attribute.
			this_accordion_element.setAttribute('aria-label', options.aria_label);
			// Initialize accordion aria-level attribute value.
			let accordion_level = 1;
			// Get the closest accordion (parent) that is not this accordion.
			const parent_accordion = this_accordion_element.closest('[' + Accordion.id_attribute + ']:not(' + this_accordion_selector + ')');
			// If a parent accordion exists.
			if(parent_accordion) {
				// Get the parent accordion first heading element.
				const parent_heading = parent_accordion.querySelector(parent_accordion.accordion_options.selectors.heading);
				// Get the parent accordion heading aria-level.
				const parent_heading_aria_level = parent_heading.getAttribute('aria-level');
				// Add one to the parent aria-level for the current level.
				accordion_level = parseInt(parent_heading_aria_level) + 1;
			}
			// Get all child accordion elements with aria-level.
			const aria_level_elements = this_accordion_element.querySelectorAll('[' + Accordion.id_attribute + '] [aria-level]');
			// For each aria-level element.
			for(let aria_level_element = 0; aria_level_element < aria_level_elements.length; aria_level_element++) {
				// Get this current aria-level element.
				const this_aria_level_element = aria_level_elements[aria_level_element];
				// Get the current aria-level.
				const current_aria_level = parseInt(this_aria_level_element.getAttribute('aria-level'));
				// Set a new aria-level one greater than before.
				this_aria_level_element.setAttribute('aria-level', (current_aria_level + 1));
			}

			//
			// Item
			//

			// Get accordion items.
			const accordion_items = this_accordion_element.querySelectorAll(this_accordion_selector + ' > ' + options.selectors.item);
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
				accordion_item_heading.addEventListener('click', this.headingClick);
				// Add key down event listener for switching between accordion items and accessibility.
				accordion_item_heading.addEventListener('keydown', this.headingKeyDown);

			} // End loop: accordion_items.

		} // End loop accordion_elements.

	} // End function: initialize.
};

// Export the accordion class.
// export default Accordion;
