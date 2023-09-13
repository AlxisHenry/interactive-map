type AreaProperties = {
	id: number;
	title: string;
	isActive: boolean;
}

class Area {

	private id: number;

	private title: string;

	private list: Array<string> = [];

	private isActive: boolean = false;

	constructor(
		public $el: HTMLAreaElement
	) {
		this.parse();
	}

	private parse(): void {
		if (!this.$el.dataset.id || !this.$el.dataset.title) {
			throw new Error("Area element must have data-id and data-title attributes");
		}
		this.id = parseInt(this.$el.dataset.id);
		this.title = this.$el.dataset.title;
		this.$el.dataset.list.split(',').forEach(element => {
			this.list.push(element)
		});
	}

	public getTitle(): string {
		return this.title;
	}

	public getProperties(): AreaProperties {
		return {
			id: this.id,
			title: this.title,
			isActive: this.isActive
		};
	}

	public getList(): Array<string> {
		return this.list;
	}

}