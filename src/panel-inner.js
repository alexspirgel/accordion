const isElement = require('@alexspirgel/is-element');

module.exports = class PanelInner {

	static isPanelInner(panelInner) {
		return (panelInner instanceof this);
	}

	constructor({panel, element}) {
		this.panel = panel;
		this.element = element;
		this.initialized = true;
	}

	get options() {
		if (this.accordion) {
			return this.accordion.options;
		}
	}

	get accordion() {
		if (this.bundle) {
			return this.bundle.accordion;
		}
	}

	get bundle() {
		if (this.item) {
			return this.item.bundle;
		}
	}

	get item() {
		if (this.panel) {
			return this.panel.item;
		}
	}

	get panel() {
		return this._panel;
	}

	set panel(panel) {
		if (this.initialized) {
			throw new Error(`The 'panel' property should not be changed after construction. Instead, destroy the instance and create a new one.`);
		}
		const Panel = require('./panel.js');
		if (!Panel.isPanel(panel)) {
			throw new Error(`'panel' must be an instance of the 'Panel' class.`);
		}
		this._panel = panel;
	}

	get element() {
		return this._element;
	}

	set element(element) {
		if (!isElement(element)) {
			throw new Error(`'element' must be an element.`);
		}
		if (this.accordion.constructor.getAccordionObject(element)) {
			throw new Error(`'element' is already used in an accordion.`);
		}
		element.setAttribute(this.accordion.options.get('dataAttributes.elementType'), 'panel-inner');
		this._unsetElement();
		this._element = element;
	}

	_unsetElement(element) {
		if (isElement(this.element)) {
			element.removeAttribute(this.accordion.options.get('dataAttributes.elementType'));
		}
		this._element = undefined;
	}

	destroy() {
		this._unsetElement();
		if (this.panel && this.panel.panelInner === this) {
			this.panel.panelInner = undefined;
		}
	}

};