# accordion
https://www.w3.org/TR/wai-aria-practices-1.1/#accordion

https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html

## Options
### `elements`
#### `bundle`
Default value: `'.accordion'`

Custom bundle element. Can be a selector, element reference, node list, or an array containing any of the previously mentioned.

#### `item`
Default value: `'.accordion__item'`

Custom item element. Can be a selector, element reference, node list, or an array containing any of the previously mentioned. Item elements must be located within bundle elements.

#### `trigger`
Default value: `'.accordion__trigger'`

Custom item trigger element. Triggers the opening and closing of its item. Can be a selector, element reference, node list, or an array containing any of the previously mentioned. Trigger elements, must be located within item elements. Only one trigger element per accordion item. If more than one trigger element is passed or matches the selector for an accordion item, the fist element will be used.

#### `content`
Default value: `'.accordion__content'`

Custom item content element. Can be a selector, element reference, node list, or an array containing any of the previously mentioned. Content elements must be located within item elements. Only one content element per accordion item. If more than one content element is passed or matches the selector for an accordion item, the fist element will be used.

#### `contentInner`
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