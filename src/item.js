const isElement = require('@alexspirgel/is-element');
const Header = require('./header.js');
const Panel = require('./panel.js');

module.exports = class Item {

	static isItem(item) {
		return (item instanceof this);
	}

	constructor({bundle, element, header, panel, panelInner}) {
		this.bundle = bundle;
		this.element = element;
		if (isElement(header)) {
			this.addHeader({
				element: header
			});
		}
		if (isElement(panel)) {
			this.addPanel({
				element: panel,
				panelInner: panelInner
			});
		}
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
		return this._bundle;
	}

	set bundle(bundle) {
		if (this.initialized) {
			throw new Error(`The 'bundle' property should not be changed after construction. Instead, destroy the instance and create a new one.`);
		}
		const Bundle = require('./bundle.js');
		if (!Bundle.isBundle(bundle)) {
			throw new Error(`'bundle' must be an instance of the 'Bundle' class.`);
		}
		this._bundle = bundle;
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
		element.setAttribute(this.accordion.options.get('dataAttributes.elementType'), 'item');
		this._unsetElement();
		this._element = element;
	}

	_unsetElement(element) {
		if (isElement(this.element)) {
			element.removeAttribute(this.accordion.options.get('dataAttributes.elementType'));
		}
		this._element = undefined;
	}

	get header() {
		return this._header;
	}

	set header(header) {
		if (!Header.isHeader(header) && typeof header !== undefined) {
			throw new Error(`'header' must be an instance of Header or undefined.`);
		}
		const existingHeader = this._header;
		if (header !== existingHeader) {
			this._header = header;
			if (Header.isHeader(existingHeader)) {
				existingHeader.destroy();
			}
		}
	}

	addHeader({element}) {
		const header = new Header({
			item: this,
			element: element,
		});
		this.header = header;
		return header;
	}

	get panel() {
		return this._panel;
	}

	set panel(panel) {
		if (!Panel.isPanel(panel) && typeof panel !== undefined) {
			throw new Error(`'panel' must be an instance of Panel or undefined.`);
		}
		const existingPanel = this._panel;
		if (panel !== existingPanel) {
			this._panel = panel;
			if (Panel.isPanel(existingPanel)) {
				existingPanel.destroy();
			}
		}
	}

	addPanel({element, panelInner}) {
		const panel = new Panel({
			item: this,
			element: element,
			panelInner: panelInner
		});
		this.panel = panel;
		return panel;
	}

	destroy() {
		if (this.header) {
			this.header.destroy();
		}
		if (this.panel) {
			this.panel.destroy();
		}
		this._unsetElement();
		this.bundle.removeItem(this);
	}

};