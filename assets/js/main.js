import Map from './Map.js';

document.addEventListener('DOMContentLoaded', () => {
 	new Map().outlines();
	
	window.addEventListener('resize', () => {
		new Map(false).outlines();
	});
	
})