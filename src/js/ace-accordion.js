/**
 * AceAccordion v1.0.0
 * https://github.com/alexspirgel/accordion
 */

// Require extend function.
const extend = require('@alexspirgel/extend');
// Require Accordion class.
const Accordion = require('./accordion.js');

/**
 * Defines an Ace Accordion (a handling wrapper for the Accordion Class).
 */

const AceAccordion = class {

	/**
	 * Defines the default set of options.
	 */

	static get options_default() {
		return {
			selectors: {
				accordion: '.accordion', // {string} Custom accordion element selector.
				item: '.accordion__item', // {string} Custom item element selector.
				heading: '.accordion__item__heading', // {string} Custom heading element selector.
				content: '.accordion__item__content', // {string} Custom content element selector.
				content_inner: '.accordion__item__content__inner' // {string} Custom content inner element selector.
			},
			// accessibility_warnings: true, // {boolean} Log detected accessibility issues as warnings.
			close_nested_items: false, // {boolean} Close immediate nested items. Can chain down levels depending on nested options.
			// custom_css: false, // {boolean} When true, prevent the script from adding it's own styles (not recommended).
			default_open_items: null, // {number|string|object|array} Initializes item(s) to default open by default.
			heading_trigger_selector: null, // {string} Selector (scoped within heading) to trigger item open/close, rather than entire heading element.
			multiple_open_items: true, // {boolean} When true, allow multiple items to be open at the same time.
			// open_anchored_items: false, // {boolean} When anchored to an accordion item, open it.
			// trigger_on_hover: false, // {boolean} Trigger open/close based on if the cursor is hovered over the item.
			callbacks: {
				accordion: {
					initialize: {
						before: null,
						after: null
					}
				},
				item: {
					initialize: {
						before: null,
						after: null
					},
					open: {
						// before: null,
						// after: null
					},
					close: {
						// before: null,
						// after: null
					}
				}
			},
			debug: false // Log helpful messages to the console for development.
		};
	} // End method: static get options_default

	/**
	 * Defines constant class variables.
	 */

	static get constants() {
		return {
			id_attribute: 'data-ace-instance-id'
		};
	} // End method: static get constants

	/**
	 *
	 */

	get accordion_elements() {
		// Get accordion elements and convert the result into an array.
		return Array.from(document.querySelectorAll(this.options.selectors.accordion));
	} // End method: get accordion_elements

	/**
	 * Adds an instance to a class.
	 * @returns {number} instance_id - The id of the instance (zero indexed).
	 */

	static addInstance(holder, count_property, list_property, instance) {
		// Generate the instance id from the instance count.
		const instance_id = holder[count_property];
		// Increment the instance count.
		holder[count_property]++;
		// Add the instance to the instances list.
		holder[list_property][instance_id] = instance;
		// Return the instance id.
		return instance_id;

	} // End method: static addInstance

	/**
	 *
	 */

	addAceAccordion() {

		if (typeof this.constructor.ace_accordion_count !== 'number') {
			//
			this.constructor.ace_accordion_count = 0;
		}

		if (typeof this.constructor.ace_accordions !== 'object') {
			//
			this.constructor.ace_accordions = {};
		}

		// Call the static function to add the instance.
		return this.constructor.addInstance(this.constructor, 'ace_accordion_count', 'ace_accordions', this);

	} // End method: addAceAccordion

	/**
	 *
	 */

	addAccordion(accordion_element) {

		// If the callback option value is a function.
		if (typeof this.options.callbacks.accordion.initialize.before === 'function') {
			// Call the callback function, passing null as this and the accordion element as an argument.
			this.options.callbacks.accordion.initialize.before.call(null, accordion_element);
		}

		// Get the next instance id.
		// The current instance count equals the next instance id because the id is zero indexed.
		const accordion_id = this.accordion_count;

		// Create a new accordion.
		const accordion = new Accordion(this, accordion_id, accordion_element);

		//
		if (accordion) {
			// Call the static function to add the instance.
			this.constructor.addInstance(this, 'accordion_count', 'accordions', accordion);
		}

		// If the callback option value is a function.
		if (typeof this.options.callbacks.accordion.initialize.after === 'function') {
			// Call the callback function, passing the accordion object as this and the accordion element as an argument.
			this.options.callbacks.accordion.initialize.after.call(accordion, accordion_element);
		}

	} // End method: addAccordion

	/**
	 *
	 */

	setOption(option, value) {
		//
	} // End method: setOption

	/**
	 * AceAccordion class constructor.
	 * @param {object} options_user - A set of override options supplied by the user.
	 * @returns {object} this - The reference to this instance.
	 */

	constructor(options_user) {

		// For now, assume passed parameter is a correctly formed options object.
		// TO-DO: implement schema checking script.

		// Merge default options and user options into new object using the imported extend function.
		this.options = extend([{}, this.constructor.options_default, options_user], true);
		// Add this instance to the static class object and set the instance id on this instance.
		this.id = this.addAceAccordion();
		// Create a selector for the unique local instance id.
		this.selector = '[' + this.constructor.constants.id_attribute + '="' + this.id + '"]';

		//
		this.accordion_count = 0;
		//
		this.accordions = {};

		// If there at least one element matching the accordion selector.
		if (this.accordion_elements.length > 0) {
			// For each matching accordion element.
			for (let accordion_element = 0; accordion_element < this.accordion_elements.length; accordion_element++) {
				// Initialize an accordion.
				this.addAccordion(this.accordion_elements[accordion_element]);
			}
		}
		// If there are no elements matching the accordion selector.
		else {
			// Send a warning to the console.
			console.warn(this.constructor.name + ": No accordions found using selector: '" + this.options.selectors.accordion + "'");
		}

		// If debug is true.
		if (this.options.debug) {
			// Log the class.
			console.log('AceAccordion Debug: AceAccordion Class:');
			console.dir(this.constructor);
		}

		// Return this instance.
		return this;

	} // End method: constructor

	/**
	 *
	 */

	destroy() {
		//
	} // End method: destroy

	
	/******************************************************
	* OLD CODE WAITING TO BE REFACTORED BEYOND THIS POINT *
	*******************************************************/
	

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
	 * Initializes an accordion.
	 *
	 * @param {object} options - The merged options used to configure the accordion.
	 */

	initialize_old(options) {

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
			this_accordion_element[Accordion.constants.data_property] = {};
			// Define a shortcut to this accordion's data, for code clarity.
			this_accordion_data = this_accordion_element[Accordion.constants.data_property];
			
			// Attach the accordion element to the accordion data.
			this_accordion_data.element = this_accordion_element;

			// Attach the accordion options to the accordion data.
			this_accordion_data.options = options;

			// Get the existing accordions.
			accordions_existing = document.querySelectorAll('[' + Accordion.constants.id_attribute + ']');
			// Generate the next accordion id.
			accordion_next_id = accordions_existing.length + 1;
			while (document.querySelector('[' + Accordion.constants.id_attribute + ']="' + thing + '"')) {
				thing++;
			}

			// Set the accordion id data attribute.
			this_accordion_element.setAttribute(Accordion.constants.id_attribute, accordion_next_id);
			// Set this accordion selector by accordion id attribute.
			this_accordion_data.unique_selector = '[' + Accordion.constants.id_attribute + '="' + accordion_next_id + '"]';

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
			accordion_parent = this_accordion_element.parentNode.closest('[' + Accordion.constants.id_attribute + ']');
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
			accordion_children = this_accordion_element.querySelectorAll('[' + Accordion.constants.id_attribute + ']');
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
}; // End class: AceAccordion

// If script is being required as a node module.
if (typeof module !== 'undefined' && module.exports) {
	// Export the AceAccordion class.
	module.exports = AceAccordion;
}
