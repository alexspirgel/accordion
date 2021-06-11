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
Default value: `'.accordion'`

Custom bundle element. Can be a selector, element reference, node list, or an array containing any of the previously mentioned.

#### `elements.item`
Default value: `'.accordion__item'`

Custom item element. Can be a selector, element reference, node list, or an array containing any of the previously mentioned. Item elements must be located within bundle elements.

#### `elements.trigger`
Default value: `'.accordion__trigger'`

Custom item trigger element. Triggers the opening and closing of its item. Can be a selector, element reference, node list, or an array containing any of the previously mentioned. Trigger elements, must be located within item elements. Only one trigger element per accordion item. If more than one trigger element is passed or matches the selector for an accordion item, the fist element will be used.

#### `elements.content`
Default value: `'.accordion__content'`

Custom item content element. Can be a selector, element reference, node list, or an array containing any of the previously mentioned. Content elements must be located within item elements. Only one content element per accordion item. If more than one content element is passed or matches the selector for an accordion item, the fist element will be used.

#### `elements.contentInner`
Default value: `undefined`

Custom item content inner element. Can be a selector, element reference, node list, or an array containing any of the previously mentioned. Only one content inner element per accordion item. If more than one content inner element is passed or matches the selector for an accordion item, the fist element will be used. Can also be left undefined. When left undefined, the fist child element of the content element. Content inner elements must be located within content elements. It is recommended that this element is not styled and is the only child of the content element.

### `accessibilityWarnings`
Default value: `true`

When set to `true`, warnings about potential accessibility concerns will be logged to the console.

When set to `false`, accessibility warnings will be suppressed.

### `closeNestedItems`
Default value: `false`

When set to `true` closing an item will also close the immediately nested items. Can chain down further depending on nested options.

When set to `false` closing an item will not close the nested items.

### `defaultOpenItems`
Default value: `null`

Set which item(s) should default to open. Can be a selector, element reference, node list, or an array containing any of the previously mentioned. When set to `null`, no items will default to open.

### `multipleOpenItems`
Default value: `true`

When set to `true`, there's no limit to how many items can be open at once.

When set to `false`, only one item can be open at a time per bundle. When an item is opened all other items in that bundle will close. **Note that this can cause odd behavior:** If you open an item while there's another open item above it, the closing of the above item will cause the viewport to shift based on the height of the above item. If the above item is large enough, it's possible that the item you just opened has been scrolled out of view due to the closing of the item above.

### `openAnchoredItems`
Default value: `true`

When set to `true`, items will open when the item or content within the item is anchored to.

When set to `false`, items will not open when anchored to.

### `debug`
Default value: `false`

When set to `true`, helpful messages for debugging will be logged to the console.

## Notes
* Adheres to ADA requirements outline here: [https://www.w3.org/TR/wai-aria-practices-1.1/#accordion](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion)
* Opening and closing transition is handled by: [https://github.com/alexspirgel/transition-auto](https://github.com/alexspirgel/transition-auto)