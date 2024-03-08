/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./resources/**/*.edge",
		"./resources/**/*.{js,ts,jsx,tsx,vue}",
		"./node_modules/flowbite/**/*.js",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#d1155a',
					'50': '#fdf8f2',
					'100': '#fdf0e8',
					'200': '#fcdacf',
					'300': '#fcafa6',
					'400': '#f76e70',
					'500': '#f0425c',
					'600': '#e02453',
					'700': '#d1155a',
					'800': '#ba0059',
					'900': '#9b0064',
					'950': '#5f004a',
				},
				secondary: {
					DEFAULT: '#52646e',
					'50': '#f4f7f7',
					'100': '#e3e9ea',
					'200': '#cad4d7',
					'300': '#a4b5bc',
					'400': '#788f98',
					'500': '#5d747d',
					'600': '#52646e',
					'700': '#455259',
					'800': '#3d464d',
					'900': '#363d43',
					'950': '#21262b',
				}
			}
		},
	},
	plugins: [
		require('flowbite/plugin')
	],
}

