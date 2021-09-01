# accordion

Accordion is a JavaScript based, ADA compliant, general use accordion script. An accordion enables showing/hiding certain content via collapsable areas.

<a href="http://alexanderspirgel.com/accordion/demo" target="_blank">View the demo →</a>

## Installation

### Using NPM:

```js
npm install @alexspirgel/accordion
```

```js
const Accordion = require('@alexspirgel/accordion');
```

### Using a script tag:

Download the normal or minified script from the `/dist` folder.

```html
<script src="path/to/accordion.js"></script>
```

## Usage

HTML:
```html
<ul class="bundle">
	<li class="item">
		<button class="trigger">Trigger</button>
		<div class="content">
			<div class="content-inner">
				<p>Content</p>
			</div>
		</div>
	</li>
	<li class="item">
		<button class="trigger">Trigger</button>
		<div class="content">
			<div class="content-inner">
				<p>Content</p>
			</div>
		</div>
	</li>
</ul>
```

CSS:
```css
[data-accordion-item-state="closed"] [data-accordion="content"] {
	/* Hide content when the item is closed. */
	visibility: hidden
}
[data-accordion="content"] {
	/* Prevent the content from overflowing the parent. */
	overflow: hidden;
}
[data-accordion="content-inner"] {
	/* Margins will cause incorrect dimension calculations. */
	margin-top: 0;
	margin-bottom: 0;
	margin-left: 0;
	margin-right: 0;
	/* Force element to account for children margins in dimensions. */
	overflow: auto;
}
```

JS:
```js
const accordion = new Accordion({
	elements: {
		bundle: '.bundle',
		item: '.item',
		trigger: '.trigger',
		content: '.content'
	}
});
```

## Options
### `elements`
#### `elements.bundle`
Default value: `null`

Allowed values: Can be a selector string, element reference, node list, or an array containing any of the previously mentioned. Null and undefined are also allowed.

Defines the elements to be used as bundles during the script initialization.

#### `elements.item`
Default value: `null`

Allowed values: Can be a selector string, element reference, node list, or an array containing any of the previously mentioned. Null and undefined are also allowed.

Defines the elements to be used as items during the script initialization. Item elements must be located within bundle elements.

#### `elements.trigger`
Default value: `null`

Allowed values: Can be a selector string, element reference, node list, or an array containing any of the previously mentioned. Null and undefined are also allowed.

Defines the elements to be used as triggers during the script initialization. Trigger elements toggle the opening and closing of the related item. Trigger elements must be located within an item element. A maximum of one trigger element is allowed per item. If more than one trigger element is found for a single item, the first element will be used.

Items are restricted to a single trigger to adhere to ADA guidelines for tag structure, attributes, and keyboard navigation. However, adding additional elements to act as secondary triggers can be done manually by using the API.

#### `elements.content`
Default value: `null`

Allowed values: Can be a selector string, element reference, node list, or an array containing any of the previously mentioned. Null and undefined are also allowed.

Defines the elements to be used as content during the script initialization. Content elements must be located within an item element. A maximum of one content element is allowed per item. If more than one content element is found for a single item, the first element will be used.

#### `elements.contentInner`
Default value: `null`

Allowed values: Can be a selector string, element reference, node list, or an array containing any of the previously mentioned. Null and undefined are also allowed.

Defines the elements to be used as content inner elements during the script initialization. A maximum of one content inner element is allowed per item. If more than one content inner element is found for a single item, the first element will be used. Content inner elements must be located within content elements. It is recommended that this element is not styled and is the only immediate child of the content element.

### `accessibilityWarnings`
Default value: `true`

Allowed values: boolean

If `true`, warnings about potential accessibility concerns will be logged to the console.

If `false`, accessibility warnings will be suppressed.

### `closeNestedItems`
Default value: `false`

Allowed values: boolean

If `true` closing an item will also close the immediately nested items. Can chain to nested accordions depending on value of nested accordion options.

If `false` closing an item will not close the nested items.

### `defaultOpenItems`
Default value: `null`

Allowed values: Can be a selector string, element reference, node list, or an array containing any of the previously mentioned. Null and undefined are also allowed.

Set which item(s) should default to open. When set to `null` or `undefined`, no items will default to open.

### `multipleOpenItems`
Default value: `true`

Allowed values: boolean

If `true`, unlimited items can be open at once.

If `false`, only one item can be open at a time. When an item is opened, all other items in that bundle will close.

**Note that this can cause odd behavior.** If an item is opened while another item is open above it, the closing of the above item will cause the content to shift based on the height of the above item. If the above item is large enough, it's possible that newly opened item has been positioned out of view due to the closing of the item above.

### `openAnchoredItems`
Default value: `true`

Allowed values: boolean

If `true`, items will open when the item element or any element within the item is anchored to.

If `false`, items will not open when anchored to.

### `debug`
Default value: `false`

Allowed values: boolean

If `true`, helpful messages for debugging will be logged to the console.

## Notes
* Adheres to ADA requirements outline here: [https://www.w3.org/TR/wai-aria-practices-1.1/#accordion](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion)
* Opening and closing transition is handled by: [https://github.com/alexspirgel/transition-auto](https://github.com/alexspirgel/transition-auto)

## Goals
* Changes for web component implementation:
	* Remove the need to initialize with existing elements.
	* Review each class to update the code to accommodate this change:
		* ~~accordion.js~~
		* ~~bundle.js~~
		* ~~item.js~~
		* trigger.js
		* content.js
		* content-inner.js
* Remove adding data directly to the element in favor of using the new `dataFromElement()` method.