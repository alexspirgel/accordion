const AccordionItem = class {

	/**
	 * Defines a set of constant class variables.
	 */

	static get constants() {
		return {
			item_index_attrubute: 'data-item-index',
			item_state_attrubute: 'data-item-state'
		};
	} // End: constants

};

// If script is being required as a node module.
if (typeof module !== 'undefined' && module.exports) {
	// Export the AceAccordion class.
	module.exports = AccordionItem;
}