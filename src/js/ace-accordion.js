// Notes:
// - Class > instance > accordion > item > heading/content
// - only re-index items when we need to check them, do not use attribute, track only internally
// - separate out classes in different files



/**
 * AceAccordion v1.0.0
 * https://github.com/alexspirgel/accordion
 */

// Require extend function.
const extend = require('@alexspirgel/extend');

// Require accordion classes.
const Accordion = require('./accordion.js');
const AccordionItem = require('./accordion-item.js');

/**
 * Defines an accordion.
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
				content: '.accordion__item__content' // {string} Custom content element selector.
			}, // End: selectors
			accessibility_warnings: true, // {boolean} Log detected accessibility issues as warnings.
			close_nested_items: false, // {boolean} Close immediate nested items. Can chain reaction to close further nested levels depending on nested options.
			custom_trigger_selector: '', // {string} Alternate selector to trigger open and close instead of the heading selector.
			default_open_items: [], // {number|string|object|array} Initializes item(s) already open.
			multiple_open_items: true, // {boolean} Allow multiple items to be open at the same time.
			open_anchored_items: false, // {boolean} When anchored to an accordion item, open it.
			callbacks: {
				accordion: {
					initialize: {
						before: () => {},
						after: () => {}
					}
				},
				item: {
					initialize: {
						before: () => {},
						after: () => {}
					},
					open: {
						before: () => {},
						after: () => {}
					},
					close: {
						before: () => {},
						after: () => {}
					}
				}
			}, // End: callbacks
			debug: false // Log helpful messages to the console for development.
		}; // End: return
	} // End: options_default

	/**
	 * Defines a set of constant class variables.
	 */

	static get constants() {
		return {
			instance_id_attribute: 'data-instance-id'
		};
	} // End: constants

	/**
	 * Sets an instance to a class.
	 * @returns {number} instance_id - The id of the instance (zero indexed).
	 */

	_setClassInstance(instance, Class, list_property, count_property) {

		// Initialize the instance id variable.
		let instance_id;

		// If the class instance list has not been initialized.
		if (!Class[list_property]) {
			// Initialize the class instances list.
			Class[list_property] = {};
		}

		// If the class instance list is not an array.
		if (!Array.isArray(Class[list_property])) {
			// If the class instance count has not been initialized.
			if (typeof Class[count_property] !== 'number') {
				// Set the class instance count to 0.
				Class[count_property] = 0;
			}
			// Increment the class instance count.
			Class[count_property]++;
			// Generate the instance id from the instance count.
			// Subtract one to have the id be zero indexed.
			instance_id = Class[count_property] - 1;
			// Add the instance to the class instances object.
			Class[list_property][instance_id] = instance;
		}
		// If the class instance list is an array.
		else {
			// Set the instance id equal to the array length (also the next available index).
			instance_id = Class[list_property].length;
			// Add the instance to the instance list.
			Class[list_property].push(instance);
		}

		// Return this instance's unique id.
		return instance_id;

	} // End: _setClassInstance

	/**
	 * Index accordion items.
	 */

	indexItems(accordion_id) {
		// If no accordion id is passed.
		if (typeof accordion_id === 'undefined') {
			// For each accordion in this Accordion class instance.
			for (let accordion in this.accordions) {
				// Recursive call with accordion id.
				this.indexItems(accordion);
			}
		}
		// If an accordion id is passed.
		else {
			// Generate the items selector for this accordion
			const items_selector = this.accordions[accordion_id].selector + ' > ' + this.options.selectors.item;
			// Get the items of this accordion.
			const items_elements = document.querySelectorAll(items_selector);
			// For each item in the accordion.
			for (let item = 0; item < items_elements.length; item++) {
				//
				items_elements[item].setAttribute(Accordion.constants.item_index_attrubute, item);
			}
		}
	} // End: indexItems

	/**
	 * Check if an item matches the input(s).
	 */

	_itemMatchesValue(item, match_criteria) {
		console.log(item);

		// If the match criteria is a node list.
		if (match_criteria instanceof NodeList) {
			// Convert the match criteria into an array.
			match_criteria = Array.from(match_criteria);
		}

		// If the match criteria is an array.
		if (Array.isArray(match_criteria)) {
			// For each value in the match criteria array.
			for (let value = 0; value < match_criteria.length; value++) {
				// Recursive call to check if the array value matches the item.
				if (this._itemMatchesValue(item, match_criteria[value])) {
					// If it matches, return true.
					return true;
				}
			}
		}

		// If the match criteria is a number (index).
		else if (typeof match_criteria === 'number') {
			// If the match criteria is an integer.
			if (Number.isInteger(match_criteria)) {
				// If the match criteria is zero or greater.
				if (match_criteria >= 0) {
					// If the item index matches the match criteria index.
					if (item.index === match_criteria) {
						return true;
					}
				}
			}
		}

		// If the match criteria is a string (selector).
		else if (typeof match_criteria === 'string') {
			// If the item element matches the match criteria selector.
			if (item.element.matches(match_criteria)) {
				return true;
			}
		}

		// If the match criteria is an element.
		else if (match_criteria instanceof Element) {
			// If the item element matches the match criteria.
			if (item.element === match_criteria) {
				return true;
			}
		}

		// If the item element does not match the match criteria.
		return false;

	} // End: _itemMatchesValue

	/**
	 * Initialize item.
	 */

	_initializeItem(item_element, accordion_id) {

		/**
		 * Initialize heading.
		 */

		const initializeHeading = (heading_element, item) => {
			console.log(heading_element);
			// Set the heading role attribute to heading.
			heading_element.setAttribute('role', 'heading');
			// Set the heading aria-controls attribute to the item content id.
			heading_element.setAttribute('aria-controls', item.content.id);
			// Set the accordion item heading aria-level attribute.
			accordion_item_heading.setAttribute('aria-level', accordion_level);
			// Set the accordion item heading aria-expanded attribute.
			accordion_item_heading.setAttribute('aria-expanded', aria_expanded_value);
			// Add click event listener to toggle the accordion item opened/closed state.
			accordion_item_heading.addEventListener('click', Accordion.headingClickEventHandler);
			// Add key down event listener for switching between accordion items and accessibility.
			accordion_item_heading.addEventListener('keydown', Accordion.headingKeyDownEventHandler);
		}; // End: initializeHeading

		/**
		 * Initialize content.
		 */

		const initializeContent = (content_element) => {}; // End: initializeContent

		// Get the accordion object. Assign it to a variable for easier access.
		const this_accordion = this.accordions[accordion_id];
		// Initialize this accordion to the instance object.
		const item_index = this._setClassInstance({}, this_accordion, 'items');

		// Initialize object to hold item data.
		const this_item = this_accordion.items[item_index];
		// Add the item index to the item object.
		this_item.index = item_index;
		// Add the item element reference to the item object.
		this_item.element = item_element;

		// Initialize the item state value.
		let item_state = 'closed';

		// Get the default_open_items options value.
		const default_open_items = this.options.default_open_items;
		// If the option value is not false, null, or undefined.
		if (default_open_items !== false || default_open_items !== null || typeof default_open_items !== 'undefined') {
			// If the element matches the default_open_items value.
			if (this._itemMatchesValue(this_item, default_open_items)) {
				// Set the item state value to opened.
				item_state = 'opened';
			}
		}

		// Add the item state to the item object.
		this_item.state = item_state;
		// Set the item state attribute.
		this_item.element.setAttribute(this.constructor.constants.item_state_attrubute, item_state);

		// Get this item's content element.
		// const content_element = this_item.element.querySelector(this_accordion.selector + ' > ' + this.options.selectors.item + ' > ' + this.options.selectors.content);
		//
		// this_item.content = initializeContent(content_element, this_item);

		// Get this item's heading element.
		// const heading_element = this_item.element.querySelector(this_accordion.selector + ' > ' + this.options.selectors.item + ' > ' + this.options.selectors.heading);
		//
		// this_item.heading = initializeHeading(heading_element, this_item);


	} // End: _initializeItem

	/**
	 * Initialize accordion.
	 */

	initializeAccordion(accordion_element) {

		// Initialize this accordion to the instance object.
		const accordion_id = this._setClassInstance({}, this, 'accordions', 'accordion_count');
		// Assign this accordion object to a variable for easier access.
		const this_accordion = this.accordions[accordion_id];

		// Add the accordion relative unique id (relative to this class instance).
		this_accordion.id = accordion_id;
		// Add the accordion element reference.
		this_accordion.element = accordion_element;
		// Initialize a list of accordion items.
		this_accordion.items = [];

		// Set the class instance id data attribute.
		this_accordion.element.setAttribute(AceAccordion.constants.instance_id_attribute, this.id);
		// Set the accordion id data attribute.
		this_accordion.element.setAttribute(AceAccordion.constants.accordion_id_attribute, this_accordion.id);

		// Create a selector for the unique local accordion id.
		const this_accordion_id_selector = '[' + AceAccordion.constants.accordion_id_attribute + '="' + this_accordion.id + '"]';
		// Set the global unique selector for this accordion.
		this_accordion.selector = this.selector + this_accordion_id_selector;

		// Get the items in this accordion.
		const accordion_items = this_accordion.element.querySelectorAll(this_accordion.selector + ' > ' + this.options.selectors.item);
		// If there is at least one item.
		if (accordion_items.length > 0) {
			// Initialize variable to hold the item element for the current loop.
			let loop_item_element;
			// For each item.
			for(let accordion_item = 0; accordion_item < accordion_items.length; accordion_item++) {
				// Set the current loop item element.
				loop_item_element = accordion_items[accordion_item];
				// Initialize the item.
				this._initializeItem(loop_item_element, this_accordion.id);
			}
		}
		// If there are no items in this accordion
		else {
			// If debug is true.
			if (this.options.debug) {
				// Send a warning to the console.
				console.warn(this.constructor.name + ": No items found using selector: '" + this.options.selectors.item + "'");
			}
		}


	} // End: initializeAccordion


	/**
	 * AceAccordion class constructor.
	 * @param {object} options_user - A set of override options supplied by the user.
	 * @returns {object} this - The reference to this instance.
	 */

	constructor(options_user) {

		// Add this instance to the static class object and set the instance id on this instance.
		this.id = this._setClassInstance(this, this.constructor, 'instances', 'instance_count');
		// Create a selector for the unique local instance id.
		this.selector = '[' + this.constructor.constants.instance_id_attribute + '="' + this.id + '"]';

		// For now, assume passed parameter is a correctly formed options object.
		// TO-DO: implement schema checking script.

		// Merge default options and user options into new object using the imported extend function.
		this.options = extend([{}, this.constructor.options_default, options_user], true);

		// Get the accordion element(s).
		const accordion_elements = document.querySelectorAll(this.options.selectors.accordion);
		// If there at least one element matching the accordion selector.
		if (accordion_elements.length > 0) {
			// For each matching accordion element.
			for (let accordion_element = 0; accordion_element < accordion_elements.length; accordion_element++) {
				// Initialize the accordion.
				this.initializeAccordion(accordion_elements[accordion_element]);
			}
		}
		// If there are no elements matching the accordion selector.
		else {
			// Send a warning to the console.
			console.warn(this.constructor.name + ": No accordions found using selector: '" + this.options.selectors.accordion + "'");
		}

		// If debug is true.
		if (true) {
			// Log the classes.
			console.dir(this.constructor);
		}

		// Return the this instance.
		return this;

	} // End: constructor

	
	/******************************************************
	* OLD CODE WAITING TO BE REFACTORED BEYOND THIS POINT *
	*******************************************************/
	

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
		const accordion_data = accordion_element[Accordion.constants.data_property];
		if (nested_level) {
			accordion_data.nested_level = nested_level;
			// Get all accordion children elements.
			const immediate_child_accordions = accordion_element.querySelectorAll('[' + Accordion.constants.id_attribute + ']');
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
			return accordion_element[Accordion.constants.data_property].nested_level;
		}
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
};

// If script is being required as a node module.
if (typeof module !== 'undefined' && module.exports) {
	// Export the AceAccordion class.
	module.exports = AceAccordion;
}