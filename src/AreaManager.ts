class AreaManager {

	private areas: Array<Area> = []

	constructor(
		private map: HTMLMapElement|undefined = undefined
	) {
		if (this.map !== undefined) {
			this.map.querySelectorAll('area').forEach((area: HTMLAreaElement) => {
				this.areas.push(new Area(area))
			})
			this.areas
		} else {
			throw new Error('Map element undefined.')
		}
	}

	getAreas(): Array<Area> {
		return this.areas;
	}

}