const isElement = require('@alexspirgel/is-element');
const PanelInner = require('./panel-inner.js');

module.exports = class Panel {

	static isPanel(panel) {
		return (panel instanceof this);
	}

	constructor({item, element, panelInner}) {
		this.item = item;
		this.element = element;
		if (isElement(panelInner)) {
			this.addPanelInner({
				element: panelInner
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
		if (this.item) {
			return this.item.bundle;
		}
	}

	get item() {
		return this._item;
	}

	set item(item) {
		if (this.initialized) {
			throw new Error(`The 'item' property should not be changed after construction. Instead, destroy the instance and create a new one.`);
		}
		const Item = require('./item.js');
		if (!Item.isItem(item)) {
			throw new Error(`'item' must be an instance of the 'Item' class.`);
		}
		this._item = item;
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
		element.setAttribute(this.accordion.options.get('dataAttributes.elementType'), 'panel');
		this._unsetElement();
		this._element = element;
	}

	_unsetElement(element) {
		if (isElement(this.element)) {
			element.removeAttribute(this.accordion.options.get('dataAttributes.elementType'));
		}
		this._element = undefined;
	}

	get panelInner() {
		return this._panelInner;
	}

	set panelInner(panelInner) {
		if (!PanelInner.isPanelInner(panelInner) && typeof panelInner !== 'undefined') {
			throw new Error(`'panelInner' must be an instance of PanelInner or undefined.`);
		}
		const existingPanelInner = this._panelInner;
		if (panelInner !== existingPanelInner) {
			this._panelInner = panelInner;
			if (PanelInner.isPanelInner(existingPanelInner)) {
				existingPanelInner.destroy();
			}
		}
	}

	addPanelInner({element}) {
		const panelInner = new PanelInner({
			panel: this,
			element: element
		});
		this.panelInner = panelInner;
		return panelInner;
	}

	destroy() {
		if (PanelInner.isPanelInner(this.panelInner)) {
			this.panelInner.destroy();
		}
		this._unsetElement();
		if (this.item && this.item.panel === this) {
			this.item.panel = undefined;
		}
	}

};