const Accordion = class {

	/**
	 * Defines a set of constant class variables.
	 */

	static get constants() {
		return {
			accordion_id_attribute: 'data-accordion-id'
		};
	} // End: constants

};

// If script is being required as a node module.
if (typeof module !== 'undefined' && module.exports) {
	// Export the AceAccordion class.
	module.exports = Accordion;
}