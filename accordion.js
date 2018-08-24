const testfunc = (event) => {
	console.log(event.srcElement);
};
// include object extend
var extend = function (target_object, merge_objects, deep) {
	'use strict';

	var extend_object = function (target_object, merge_object, deep) {
		// For each property in the merge_object.
		for(var property in merge_object) {
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
				// Call the extend_object function recursively.
				extend_object(target_object[property], merge_object[property], deep);
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
	for(var object = 0; object < merge_objects.length; object++) {
		// Extend the target_object with the merge_object.
		extend_object(target_object, merge_objects[object], deep);
	}

	// Return the extended target_object.
	return target_object;
};

/**
 * Accordion v1.0.0
 * https://github.com/alexspirgel/accordion
 */

const Accordion = class {

	/**
	 *
	 */

	constructor(options_user) {

		//
		this.options_user = options_user;
		//
		this.options_default = {
			"selectors": {
				"accordion": ".accordion",
				"item": ".accordion__item",
				"heading": ".accordion__item__heading",
				"content": ".accordion__item__content"
			},
			"id_prefix": "accordion",
			"allow_multiple_open_items": true,
			"always_one_item_open": true,
			"first_item_default_open": false,
			"close_child_accordion_items": true,
			"scroll_to_top": {
				"enabled": true,
				"scroll_element": window,
				"transition": {
					"enabled": true,
					"duration": 500, // Transition duration in milliseconds.
					"cancel_on_scroll": true,
					"easing_function": (t) => {return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;} // Ease In Out Cubic.
				}
			},
			"callbacks": {
				"accordion": {
					"initialize": {
						"before": (accordion_element, accordion_object) => {},
						"after": (accordion_element, accordion_object) => {}
					}
				},
				"item": {
					"initialize": {
						"before": (item_element, accordion_object) => {},
						"after": (item_element, accordion_object) => {}
					},
					"open": {
						"before": (item_element, accordion_object) => {},
						"after": (item_element, accordion_object) => {}
					},
					"close": {
						"before": (item_element, accordion_object) => {},
						"after": (item_element, accordion_object) => {}
					}
				}
			}
		}; // End variable: options_default.
		//
		this.options = extend({}, [this.options_default, this.options_user], true);
		//
		this.initialize(this.options);
		//
		return this;

	} // End function: constructor.

	/**
	 *
	 */

	initialize(options) {

		/**
		 *
		 */

		const getNextAvailableAccordionId = (id_prefix) => {
			// Initialize the id increment at 1.
			let i = 1;
			// While an id with the increment exists.
			while(document.getElementById(id_prefix + '-' + i)) {
				i++;
			}
			// Return the next available id.
			return id_prefix + '-' + i;
		}; // End function: getNextAvailableAccordionId.

		// Initialize accordion identifying data attribute.
		const accordion_identifier_attribute = 'data-accordion';
		
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
			// Set the universal accordion identifier data attribute.
			this_accordion_element.setAttribute(accordion_identifier_attribute, '');
			// Set the accordion aria-label attribute.
			this_accordion_element.setAttribute('aria-label', 'Accordion Control Button Group');
			// Get the next available accordion id.
			const accordion_id = getNextAvailableAccordionId(options.id_prefix);
			// Set the accordion id.
			this_accordion_element.id = accordion_id;
			// Initialize accordion aria-level attribute value.
			let accordion_level = 1;
			// Get the first parent accordion.
			const parent_accordion = this_accordion_element.closest('[' + accordion_identifier_attribute + ']:not(#' + accordion_id + ')');
			// If a parent accordion exists.
			if(parent_accordion) {
				// Get the parent accordion first heading element.
				const parent_heading = parent_accordion.querySelector(parent_accordion.accordion_options.selectors.heading);
				// get the parent accordion first heading aria-level.
				const parent_heading_aria_level = parent_heading.getAttribute('aria-level');
				// Add one to the parent aria-level for the current level.
				accordion_level = parseInt(parent_heading_aria_level) + 1;
			}
			// Get all child accordion elements with aria-level.
			const aria_level_elements = this_accordion_element.querySelectorAll('[data-accordion] [aria-level]');
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
			const accordion_items = this_accordion_element.querySelectorAll(':scope > ' + options.selectors.item);
			// For each accordion item.
			for(let accordion_item = 0; accordion_item < accordion_items.length; accordion_item++) {
				// Get this current item element in the accordion.
				const this_accordion_item = accordion_items[accordion_item];
				// Set the accordion item id.
				this_accordion_item.id = this_accordion_element.id + '__item-' + (accordion_item + 1);

				//
				// Content
				//

				// Get accordion item content.
				const accordion_item_content = this_accordion_item.querySelector(':scope > ' + options.selectors.content);
				// Set the accordion item content id.
				accordion_item_content.id = this_accordion_item.id + '__content';
				// Set the accordion item content aria-hidden attribute.
				accordion_item_content.setAttribute('aria-hidden', 'true');

				//
				// Heading
				//

				// Get accordion item heading.
				const accordion_item_heading = this_accordion_item.querySelector(':scope > ' + options.selectors.heading);
				// Set the accordion item heading id.
				accordion_item_heading.id = this_accordion_item.id + '__heading';
				// Set the accordion item heading role attribute.
				accordion_item_heading.setAttribute('role', 'heading');
				// Set the accordion item heading aria-controls attribute to the accordion item content id.
				accordion_item_heading.setAttribute('aria-controls', accordion_item_content.id);
				// Set the accordion item heading aria-level attribute.
				accordion_item_heading.setAttribute('aria-level', accordion_level);
				// Set the accordion item heading aria-expanded attribute.
				accordion_item_heading.setAttribute('aria-expanded', 'false');
				//
				accordion_item_heading.addEventListener('click', testfunc);

			} // End loop: accordion_items.

		} // End loop accordion_elements.

	} // End function: initialize.
};