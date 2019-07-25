# accordion
## Options:
```js
{
  selectors: {
    accordion: '.accordion', // {string} Custom accordion element selector.
    item: '.accordion__item', // {string} Custom item element selector.
    heading: '.accordion__item__heading', // {string} Custom heading element selector.
    content: '.accordion__item__content', // {string} Custom content element selector.
    content_inner: '.accordion__item__content__inner' // {string} Custom content inner element selector.
  },
  close_nested_items: false, // {boolean} Close immediate nested items. Can chain down levels depending on nested options.
  default_open_items: null, // {number|string|object|array} Initializes item(s) to default open by default.
  heading_trigger_selector: null, // {string} Selector (scoped within heading) to trigger item open/close, rather than entire heading element.
  multiple_open_items: true, // {boolean} When true, allow multiple items to be open at the same time.
  trigger_on_hover: false, // {boolean} Trigger open/close based on if the cursor is hovered over the item.
  callbacks: {
    accordion: {
      initialize: {
        before: null,
        after: null
      }
    },
    item: {
      initialize: {
        before: null,
        after: null
      }
    }
  },
  debug: false // Log helpful messages to the console for development.
}
````
## To-do:
* Add readme documentation.
* Finish commenting.
* Finish destroy methods.
* Switch global CSS identifiers from data attributes to prefixed classes??? maybe, not sold on this yet.
* Remove CSS style sheet in favor of adding styles inline with optional override for external styles.
	* Add advanced option to use all custom css if you know what you're doing.
* Use try catch statements for error catching.
* Implement commented out options.