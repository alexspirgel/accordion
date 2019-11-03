# accordion
## To-do:
* Update documentation.
* Finish commenting.
* Switch global CSS identifiers from data attributes to prefixed classes??? maybe.
* Remove CSS style sheet in favor of adding styles inline with optional override for external styles
* Find good solution to content height changing mid transition causing incorrect end point and jumpiness at the end of the transition.
	* Idea: On height transition end, check the current ending height against the original ending height, if it is different (maybe give a pixel of wiggle room) transition all over again to the new height.
* Use try catch statements for error catching.
* Implement commented out options.
* Implement methods for all items close/open/toggle.