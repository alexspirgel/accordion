# accordion
## To-do:
* Switch global CSS identifiers from data attributes to prefixed classes??? maybe.
* Remove CSS style sheet in favor of adding styles inline with optional override for external styles
* Find good solution to content height changing mid transition causing incorrect end point and jumpiness at the end of the transition.
	* Idea: On height transition end, check the current ending height against the original ending height, if it is different (maybe give a pixel of wiggle room) transition all over again to the new height.
* Implement commented out options.
* Change instance incrementing to be called from the parent. (generate new id, pass it into the init function, return the object, set the reference to it on the parent).