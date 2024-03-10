import htmx from 'htmx.org'
import Alpine from 'alpinejs'
import { initFlowbite } from 'flowbite';

window.htmx = htmx
window.Alpine = Alpine

import('htmx.org/dist/ext/path-params')
Alpine.start()


htmx.onLoad(() => {
	initFlowbite();
})

window.waitForAlpine = (cb) => {
	let count = 0
	const interval = setInterval(() => {
		if (window.Alpine) {
			clearInterval(interval)
			cb()
		}
		if (count > 100) {
			clearInterval(interval)
		}
		count++
	}, 100)
}

window.waitForHtmx = (cb) => {
	let count = 0
	const interval = setInterval(() => {
		if (window.htmx) {
			clearInterval(interval)
			cb()
		}
		if (count > 100) {
			clearInterval(interval)
		}
		count++
	}, 100)
}