type AreaPositionAndSize = {
  offsetX: number;
  offsetY: number;
  height: number;
  width: number;
};

class InteractiveMap<T> {
  private image: HTMLImageElement;

  private map: HTMLMapElement;

  private areas: Array<Area> = [];

  constructor(events: boolean = true) {
    document.addEventListener("DOMContentLoaded", () => {
      this.load(events);
      this.makeAreas();
      document.addEventListener("resize", () => {
        this.makeAreas();
      });
    });
  }

  private makeAreas(): void {
    document.querySelectorAll(".outline").forEach((el) => el.remove());
    this.areas.forEach((area) => {
      const { offsetX, offsetY, height, width } = this.getPositionAndSize(area);

      let $div: HTMLDivElement = document.createElement("div");
      $div.classList.add("outline");
      $div.style.top = offsetX + "px";
      $div.style.left = offsetY + "px";
      $div.style.width = width + "px";
      $div.style.height = height + "px";

      document.body.appendChild($div);
    });
  }

  private load(events: boolean): void {
    this.image =
      document.querySelector("img[usemap]") ?? document.createElement("img");
    this.map = document.querySelector("map") ?? document.createElement("map");
    this.areas = new AreaManager(this.map).getAreas();
    if (events) {
      this.areas.forEach((area) => {
        this.events(area);
      });
    }
  }

  private events(area: Area): void {
    area.$el.addEventListener("mouseenter", () => {
      area.$el.style.cursor = "pointer";
      this.highlight(area);
    });
    area.$el.addEventListener("mouseleave", () => {
      this.clear();
    });
  }

  private highlight(area: Area): void {
    const { offsetX, offsetY, height, width } = this.getPositionAndSize(area);

    let hightlight: HTMLDivElement = document.createElement("div");
    hightlight.classList.add("highlight");
    hightlight.style.top = offsetX + "px";
    hightlight.style.left = offsetY + "px";
    hightlight.style.width = width + "px";
    hightlight.style.height = height + "px";

    document.body.appendChild(hightlight);

    let container: HTMLDivElement = document.createElement("div");
    let triangle: HTMLDivElement = document.createElement("div");
    triangle.classList.add("triangle");
    container.classList.add("details");
    container.style.top = `calc(${offsetX}px - 30px)`;
    container.style.left = `calc(${offsetY}px + ${width}px + 20px)`;

    let name = area.getTitle() || "No name";
    
    container.innerHTML = `<div class='title'>${name}</div><ul class='list'>${area.getList().map((value) => `<li>${value}</li>` )}</ul>`;
    container.innerHTML = container.innerHTML.replaceAll(',', '');
    container.appendChild(triangle);
    document.body.appendChild(container);
  }

  private clear(): void {
    document.querySelectorAll(".highlight, .details").forEach((element) => {
      element.remove();
    });
  }

  private getPositionAndSize(area: Area): AreaPositionAndSize {
    const [y1, x1, l, h] = area.$el.coords.split(",");

    // Get the spacing between the top of the window and the start of the image
    let imageXOffset: number = +this.image!.offsetTop;
    let imageYOffset: number = +this.image!.offsetLeft;
    
    let offsetX: number = imageXOffset + parseInt(x1);
    let offsetY: number = imageYOffset + parseInt(y1);

    let height: number = parseInt(h) - parseInt(x1);
    let width: number = parseInt(l) - parseInt(y1);

    if (height < 0) {
      offsetX += height;
      height = Math.abs(height);
    }

    if (width < 0) {
      offsetY += width;
      width = Math.abs(width);
    }

    return {
      offsetX,
      offsetY,
      height,
      width,
    };
  }
}
