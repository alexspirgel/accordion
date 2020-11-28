# accordion
## Options
### `selectors`
#### `accordion`
Default value: `'.accordion'`

Custom accordion element. Can be a selector (string), or an array of selectors.

#### `item`
Default value: `'.accordion__item'`

Custom item element. Can be a selector (string), or an array of selectors.

#### `itemTrigger`
Default value: `'.accordion__item'`

Custom item trigger. Triggers the opening and closing. Can be a selector (string), or an array of selectors. This selector is scoped to the item element.

#### `heading`
Default value: `'.accordion__heading'`

Custom heading element. Can be a selector (string), an element reference (object), or an array including any combination of the previously stated.

#### `content`
Default value: `'.accordion__content'`

Custom content element. Can be a selector (string), an element reference (object), or an array including any combination of the previously stated.

#### `contentInner`
Default value: `'.accordion__content-inner'`

Custom content inner element. Can be a selector (string), an element reference (object), or an array including any combination of the previously stated.

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

When set to `false`, only one item can be open at a time per accordion group. When an item is opened all other items in that group will close. Note that this can cause odd behavior: If you open an item while there's another open item above it, the closing of the above item will cause the viewport to shift based on the height of the above item. If the above item is large enough, it's possible that the item you just opened has been scrolled out of view due to the closing of the item above.

### `openAnchoredItems`
Default value: `true`

When set to `true`, items will open when the item or content within the item is anchored to.

When set to `false`, items will not open when anchored to.

### `callbacks`
#### `item`
##### `initialize`
###### `before`
Default value: `null`

Callback will trigger before item is initialized.

###### `after`
Default value: `null`

Callback will trigger after item is initialized.

##### `open`
###### `before`
Default value: `null`

Callback will trigger before item is opened.

###### `after`
Default value: `null`

Callback will trigger after item is opened.

##### `close`
###### `before`
Default value: `null`

Callback will trigger before item is closed.

###### `after`
Default value: `null`

Callback will trigger after item is closed.

### `debug`
Default value: `false`

When set to `true`, helpful messages for debugging will be logged to the console.
