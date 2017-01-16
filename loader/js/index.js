"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// some stuff we are gonna need

var TAU = Math.PI * 2;
var PI_HALF = Math.PI * 0.5;

var settings = {
    "slices": 32,
    "radius": 600,
    "seperation": 600
};

var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(90, window.innwerWidth / window.innerHeight, 1, 10000);

// The plane that the shader draws on

function getTriangleSide() {
    var angle = PI_HALF - TAU / settings.slices / 2;
    var side = 2 * settings.radius * Math.cos(angle);

    return side;
}

var KaleidoPlane = function (_THREE$Mesh) {
    _inherits(KaleidoPlane, _THREE$Mesh);

    function KaleidoPlane(canvas, renderer) {
        _classCallCheck(this, KaleidoPlane);

        var texture = new THREE.Texture(canvas);

        texture.anistropy = renderer.getMaxAnisotropy();
        texture.needsUpdate = true;

        var geometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
        var material = new THREE.ShaderMaterial({
            uniforms: {
                image: { value: texture },
                imageSize: { value: new THREE.Vector2(canvas.width, canvas.height) },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                radius: { value: settings.radius },
                slices: { value: settings.slices },
                maxSize: { value: getTriangleSide() },
                seperation: { value: settings.seperation }
            },

            fragmentShader: document.getElementById("fragment").innerText,
            vertexShader: document.getElementById("vertex").innerText
        });

        var _this = _possibleConstructorReturn(this, _THREE$Mesh.call(this, geometry, material));

        _this.texture = texture;

        window.addEventListener("resize", function () {
            material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
            material.needsUpdate = true;
        });
        return _this;
    }

    KaleidoPlane.prototype.update = function update() {
        this.texture.needsUpdate = true;
    };

    return KaleidoPlane;
}(THREE.Mesh);

// Texture shenanigans

var Shape = function () {
    function Shape() {
        _classCallCheck(this, Shape);

        this.x = Math.random() * 1024;
        this.y = Math.random() * 512;
        this.width = 8 + Math.random() * 40;
        this.height = 8 + Math.random() * 40;
        this.rotation = Math.random() * TAU;
        this.color = "#665a" + Math.round(Math.random() * 20).toString(16) + Math.round(Math.random() * 15).toString(16);

        this.rotate = (-Math.PI + TAU * Math.random()) / TAU / 10;
    }

    Shape.prototype.update = function update() {
        this.rotation += this.rotate;
    };

    return Shape;
}();

var Pattern = function () {
    function Pattern() {
        _classCallCheck(this, Pattern);

        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");

        this.canvas.width = 1024;
        this.canvas.height = 512;

        this.shapes = [];

        this.randomCanvas();
    }

    Pattern.prototype.getCanvas = function getCanvas() {
        return this.canvas;
    };

    Pattern.prototype.update = function update() {
        this.context.fillStyle = "#ffffff";
        this.context.fillRect(0, 0, 1024, 512);

        var shape;

        for (var i = 0; i < this.shapes.length; i++) {
            shape = this.shapes[i];
            shape.update();

            this.context.save();
            this.context.translate(shape.x, shape.y);
            this.context.rotate(shape.rotation);
            this.context.strokeStyle = shape.color;
            this.context.strokeRect(0, 0, shape.width, shape.height);
            this.context.restore();
        }
    };

    Pattern.prototype.randomCanvas = function randomCanvas() {
        for (var i = 0; i < 150; i++) {
            this.shapes.push(new Shape());
        }

        this.update();
    };

    return Pattern;
}();

// let's get this jazz setup

onResize();

document.body.appendChild(renderer.domElement);

window.addEventListener("resize", onResize);

var pattern = new Pattern();
var plane = new KaleidoPlane(pattern.getCanvas(), renderer);

scene.add(plane);

render();

// callbacks

function onResize() {
    var _window = window;
    var innerWidth = _window.innerWidth;
    var innerHeight = _window.innerHeight;

    renderer.setSize(innerWidth, innerHeight);

    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
}

function render() {
    pattern.update();
    plane.update();

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}
