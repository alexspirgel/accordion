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
<ul class="accordion__bundle">
	<li class="accordion__item">
		<button class="accordion__trigger">Trigger</button>
		<div class="accordion__content">
			<div class="accordion__content-inner">
				<p>Content</p>
			</div>
		</div>
	</li>
	<li class="accordion__item">
		<button class="accordion__trigger">Trigger</button>
		<div class="accordion__content">
			<div class="accordion__content-inner">
				<p>Content</p>
			</div>
		</div>
	</li>
</ul>
```

JS:
```js
const accordion = new Accordion({
	elements: {
		bundle: '.accordion__bundle',
		item: '.accordion__item',
		trigger: '.accordion__trigger',
		content: '.accordion__content'
		contentInner: '.accordion__content-inner'
	}
});
```

## Options

## Notes
* Adheres to ADA requirements outline here: [https://www.w3.org/TR/wai-aria-practices-1.1/#accordion](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion)
* Opening and closing transition is handled by: [https://github.com/alexspirgel/transition-auto](https://github.com/alexspirgel/transition-auto)