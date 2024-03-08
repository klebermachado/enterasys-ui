import htmx from 'htmx.org'

window.htmx = htmx

import('htmx.org/dist/ext/path-params')

import { initFlowbite } from 'flowbite';
htmx.onLoad(() => {
	initFlowbite();
})