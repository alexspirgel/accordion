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
				"bundle": ".accordion",
				"item": ".accordion__item",
				"heading": ".accordion__item__heading",
				"content": ".accordion__item__content"
			},
			"id_prefix": "accordion", // {id_prefix}-{#}
			"allow_multiple_open_items": true,
			"keep_one_open_item": true,
			"first_item_default_open": false,
			"scroll_to_top": {
				"enabled": true,
				"scroll_element": window,
				"animation": {
					"enabled": true,
					"duration": 500, // Transition duration in milliseconds.
					"cancel_on_scroll": true,
					"easing_function": (t) => {return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;} // Ease In Out Cubic.
				}
			},
			"callbacks": {
				"bundle": {
					"initialize": {
						"before": (bundle_element, accordion_object) => {},
						"after": (bundle_element, accordion_object) => {}
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
			},
			"close_nested_on_close": true,
			"nested_accordion_options": {} // A copy of the above options structure.
		};
		//
		this.options = this.options_default; // TODO: options merge.
		//
		this.initialize(this.options);

	} // End constructor.

	/**
	 *
	 */

	initialize(options) {

		 /**
		  *
		  */

		const getAvailableIds = (id_prefix) => {
			let i = 1;
			while(!document.getElementById(id_prefix + '-' + i)) {
				i++;
			}
			return i;
		};

		const bundle_elements = document.querySelectorAll(options.selectors.bundle);

	} // End initialize.
};