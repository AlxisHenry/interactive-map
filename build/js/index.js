var Area = /** @class */ (function () {
    function Area($el) {
        this.$el = $el;
        this.list = [];
        this.isActive = false;
        this.parse();
    }
    Area.prototype.parse = function () {
        var _this = this;
        if (!this.$el.dataset.id || !this.$el.dataset.title) {
            throw new Error("Area element must have data-id and data-title attributes");
        }
        this.id = parseInt(this.$el.dataset.id);
        this.title = this.$el.dataset.title;
        this.$el.dataset.list.split(',').forEach(function (element) {
            _this.list.push(element);
        });
    };
    Area.prototype.getTitle = function () {
        return this.title;
    };
    Area.prototype.getProperties = function () {
        return {
            id: this.id,
            title: this.title,
            isActive: this.isActive
        };
    };
    Area.prototype.getList = function () {
        return this.list;
    };
    return Area;
}());
var AreaManager = /** @class */ (function () {
    function AreaManager(map) {
        if (map === void 0) { map = undefined; }
        var _this = this;
        this.map = map;
        this.areas = [];
        if (this.map !== undefined) {
            this.map.querySelectorAll('area').forEach(function (area) {
                _this.areas.push(new Area(area));
            });
            this.areas;
        }
        else {
            throw new Error('Map element undefined.');
        }
    }
    AreaManager.prototype.getAreas = function () {
        return this.areas;
    };
    return AreaManager;
}());
var InteractiveMap = /** @class */ (function () {
    function InteractiveMap(events) {
        if (events === void 0) { events = true; }
        var _this = this;
        this.areas = [];
        document.addEventListener("DOMContentLoaded", function () {
            _this.load(events);
            _this.makeAreas();
            document.addEventListener("resize", function () {
                _this.makeAreas();
            });
        });
    }
    InteractiveMap.prototype.makeAreas = function () {
        var _this = this;
        document.querySelectorAll(".outline").forEach(function (el) { return el.remove(); });
        this.areas.forEach(function (area) {
            var _a = _this.getPositionAndSize(area), offsetX = _a.offsetX, offsetY = _a.offsetY, height = _a.height, width = _a.width;
            var $div = document.createElement("div");
            $div.classList.add("outline");
            $div.style.top = offsetX + "px";
            $div.style.left = offsetY + "px";
            $div.style.width = width + "px";
            $div.style.height = height + "px";
            document.body.appendChild($div);
        });
    };
    InteractiveMap.prototype.load = function (events) {
        var _this = this;
        var _a, _b;
        this.image =
            (_a = document.querySelector("img[usemap]")) !== null && _a !== void 0 ? _a : document.createElement("img");
        this.map = (_b = document.querySelector("map")) !== null && _b !== void 0 ? _b : document.createElement("map");
        this.areas = new AreaManager(this.map).getAreas();
        if (events) {
            this.areas.forEach(function (area) {
                _this.events(area);
            });
        }
    };
    InteractiveMap.prototype.events = function (area) {
        var _this = this;
        area.$el.addEventListener("mouseenter", function () {
            area.$el.style.cursor = "pointer";
            _this.highlight(area);
        });
        area.$el.addEventListener("mouseleave", function () {
            _this.clear();
        });
    };
    InteractiveMap.prototype.highlight = function (area) {
        var _a = this.getPositionAndSize(area), offsetX = _a.offsetX, offsetY = _a.offsetY, height = _a.height, width = _a.width;
        var hightlight = document.createElement("div");
        hightlight.classList.add("highlight");
        hightlight.style.top = offsetX + "px";
        hightlight.style.left = offsetY + "px";
        hightlight.style.width = width + "px";
        hightlight.style.height = height + "px";
        document.body.appendChild(hightlight);
        var container = document.createElement("div");
        var triangle = document.createElement("div");
        triangle.classList.add("triangle");
        container.classList.add("details");
        container.style.top = "calc(".concat(offsetX, "px - 30px)");
        container.style.left = "calc(".concat(offsetY, "px + ").concat(width, "px + 20px)");
        var name = area.getTitle() || "No name";
        container.innerHTML = "<div class='title'>".concat(name, "</div><ul class='list'>").concat(area.getList().map(function (value) { return "<li>".concat(value, "</li>"); }), "</ul>");
        container.innerHTML = container.innerHTML.replaceAll(',', '');
        container.appendChild(triangle);
        document.body.appendChild(container);
    };
    InteractiveMap.prototype.clear = function () {
        document.querySelectorAll(".highlight, .details").forEach(function (element) {
            element.remove();
        });
    };
    InteractiveMap.prototype.getPositionAndSize = function (area) {
        var _a = area.$el.coords.split(","), y1 = _a[0], x1 = _a[1], l = _a[2], h = _a[3];
        // Get the spacing between the top of the window and the start of the image
        var imageXOffset = +this.image.offsetTop;
        var imageYOffset = +this.image.offsetLeft;
        var offsetX = imageXOffset + parseInt(x1);
        var offsetY = imageYOffset + parseInt(y1);
        var height = parseInt(h) - parseInt(x1);
        var width = parseInt(l) - parseInt(y1);
        if (height < 0) {
            offsetX += height;
            height = Math.abs(height);
        }
        if (width < 0) {
            offsetY += width;
            width = Math.abs(width);
        }
        return {
            offsetX: offsetX,
            offsetY: offsetY,
            height: height,
            width: width,
        };
    };
    return InteractiveMap;
}());
new InteractiveMap();
