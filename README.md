# accordion
https://www.w3.org/TR/wai-aria-practices-1.1/#accordion

https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html

## Options
### `elements`
#### `bundle`
Default value: `'.accordion'`

Custom bundle element. Can be a selector, element reference, or an array containing selectors and/or element references.

#### `item`
Default value: `'.accordion__item'`

Custom item element. Can be a selector, element reference, or an array containing selectors and/or element references. Item elements must be located within bundle elements.

#### `trigger`
Default value: `'.accordion__trigger'`

Custom item trigger element. Triggers the opening and closing of its item. Can be a selector, element reference, or an array containing selectors and/or element references. Trigger elements, must be located within item elements.

#### `content`
Default value: `'.accordion__content'`

Custom item content element. Can be a selector, element reference, or an array containing selectors and/or element references. Content elements must be located within item elements.

#### `container`
Default value: `'.accordion__container'`

Custom item content inner element. Can be a selector, element reference, or an array containing selectors and/or element references. Container elements must be located within content elements. It is recommended that this element is not styled and is the first and only child of the `content` element.

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

Set which item(s) should default to open. Can be a selector (string), an element reference (object), an item index (number), or an array including any combination of the previously stated. When set to `null`, no items will default to open.

### `inlineStyles`
Default value: `true`

When set to `true`, necessary styles will be automatically added inline on the elements.

When set to `false`, inline styles will not be added. These styles are necessary to ensure the accordion works as intended, so it's important to add them yourself. The styles you should add can be found in the _____ file. Make sure to update the selectors if they have changed from the default.

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

## API
### `open`
open by index or element reference

open all

### `close`
close by index or element reference

close all

### `options`
update options

### `destroy`
destroy

## Events