export default class Map {

	/**
	 * @type {?HTMLImageElement}
	 */
	#image = null;

	/**
	 * @type {?HTMLMapElement}
	 */
	#map = null;

	/**
	 * @type {Array<HTMLAreaElement>}
	 */
	#areas = [];

	constructor(events = true) {
		this.load(events);
	}

	/**
	 * This method will create the outlines for the map areas
	 * 
	 * @returns {void}
	 */
	outlines() {
		document.querySelectorAll(".outline").forEach((el) => el.remove());
		this.#areas.forEach(area => {
			const { offsetX, offsetY, height, width } = this.getPositionAndSize(area);

			let $outline = document.createElement('div');
			$outline.classList.add('outline');
			$outline.style.top = offsetX + 'px';
			$outline.style.left = offsetY + 'px';
			$outline.style.width = width + 'px';
			$outline.style.height = height + 'px';

			document.body.appendChild($outline);
		});
	}

	/**
	 * This method will set the class attributes and load the events on the areas
	 * 
	 * @returns {void}
	 */
	load(events) {
		this.#image = document.querySelector('img[usemap]');
		this.#map = document.querySelector('map');
		this.#areas = Array.from(this.#map.querySelectorAll('area'));
		if (events) {
			this.#areas.forEach(area => {
				this.events(area);
			});
		}
	}

	/**
	 * This method will add the events (mousenter, mouseleave) to the areas
	 * 
	 * @param {HTMLAreaElement} area 
	 */
	events(area) {
		area.addEventListener('mouseenter', () => {
			area.style.cursor = 'pointer';
			this.highlight(area);
		});
		area.addEventListener('mouseleave', () => {
			this.clear();
		});
	}

	/**
	 * This method will create the highlight and details elements and append them to the body when the mouse enters an area
	 * 
	 * @param {HTMLAreaElement} area
	 */
	async highlight(area) {

		const { offsetX, offsetY, height, width } = this.getPositionAndSize(area);

		let $hightlight = document.createElement('div');
		$hightlight.classList.add('highlight');
		$hightlight.style.top = offsetX + 'px';
		$hightlight.style.left = offsetY + 'px';
		$hightlight.style.width = width + 'px';
		$hightlight.style.height = height + 'px';

		document.body.appendChild($hightlight);

		let $container = document.createElement('div');
		let $triangle = document.createElement('div');
		$triangle.classList.add('triangle');
		$container.classList.add('details');
		$container.style.top = `calc(${offsetX}px - 50px)`;
		$container.style.left = `calc(${offsetY}px + ${width}px + 30px)`;

		const { id, name, description, services } = await this.retrieveBuildingFromJson(area.dataset.id);

		$container.innerHTML = `
			<h2>${name}</h2>
			<p>${description}</p>
			<ul>
				${services.map(service => `<li>${service.title}</li>`).join('')}
			</ul>
		`;

		$container.appendChild($triangle);
		document.body.appendChild($container);

	}

	/**
	 * This method will remove the highlight and details elements from the body when the mouse leaves an area
	 * 
	 * @returns {void}	
	 */
	clear() {
		document.querySelectorAll('.highlight, .details').forEach(element => {
			element.remove();
		});
	}

	/**
	 * This method will return the position and size of the area
	 * 
	 * @param {HTMLAreaElement} area 
	 * @returns {{offsetX: number, offsetY: number, height: number, width: number}}
	 */
	getPositionAndSize(area) {
		/**
		 * @type {Array<string>} x1,y1,x2,y2
		 */
		const [y1, x1, y2, x2] = area.coords.split(',');

		// Get the spacing between the top of the window and the start of the image
		let imageXOffset = parseInt(this.#image.getBoundingClientRect().top);
		let imageYOffset = parseInt(this.#image.getBoundingClientRect().left);

		let offsetX = imageXOffset + parseInt(x1);
		let offsetY = imageYOffset + parseInt(y1);

		let height = parseInt(x2) - parseInt(x1);
		let width = parseInt(y2) - parseInt(y1);

		if (height < 0) {
			offsetX += height;
			height = Math.abs(height);
		}

		return {
			offsetX,
			offsetY,
			height,
			width
		}
	}

	/**
	 * This method will retrieve the building data from the json file using id key
	 * 
	 * @param {string} id
	 * @return {Promise<{id: string, name: string, description: string, services: Array<string>}>}
	 */
	async retrieveBuildingFromJson(id) {
		const response = await fetch('buildings.json');
		const json = await response.json();
		const building = json.find(item => item.id === id);

		return {
			id: building.id,
			name: building.name,
			description: building.description,
			services: building.services,
		}
	}

}