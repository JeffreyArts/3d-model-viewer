import {
    Scene,
    OrthographicCamera,
    WebGLRenderer,
    Vector3,
    Box3,
    AmbientLight,
    DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    Color,
} from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class ModelViewer3D {
    constructor(modelSrc, color = "#FFFFFF", targetEl = "#viewer-container") {
        if (!modelSrc) {
            throw new Error("Error: No model source provided.");
        }

        this.modelSrc = modelSrc;
        this.modelColor = this.validateColor(color);

        if (typeof targetEl === "string" ) {
            this.targetEl = document.querySelector(targetEl);
        } else {
            this.targetEl = targetEl;
        }

        this.offset = 0;
        this.scene = new Scene();
        this.camera = new OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
        this.renderer = new WebGLRenderer({ alpha: true });

        this.controls = null;
        this.model = null;

        this.init();
    }

    init() {
        // Attach renderer to the container
        
        if (!this.targetEl) {
            throw new Error(`No valid container found for targetEl, "${this.targetEl}" not found.`);
        }

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.targetEl.appendChild(this.renderer.domElement);

        // Set up controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.enableRotate = true;
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        // Load the model
        this.loadModel(this.modelSrc);
        this.updateCameraSize()

        // Adjust on window resize
        window.addEventListener("resize", () => this.updateCameraSize());
    }

    loadModel(modelSrc) {
        const fileExtension = modelSrc.split(".").pop().toLowerCase();

        if (fileExtension === "stl") {
            const loader = new STLLoader();
            loader.load(modelSrc, (geometry) => {
                const material = new MeshStandardMaterial({ color: this.modelColor });
                this.model = new Mesh(geometry, material);
                this.scene.add(this.model);
                this.setupScene();
            });
        } else if (fileExtension === "obj") {
            const loader = new OBJLoader();
            loader.load(modelSrc, (object) => {
                const material = new MeshStandardMaterial({ color: this.modelColor });
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material = material;
                    }
                });
                this.model = object;
                this.scene.add(this.model);
                this.setupScene();
            });
        } else {
            console.error("Unsupported file format. Please use an STL or OBJ file.");
        }
    }

    setupScene() {
        if (this.model) {
            const box = new Box3().setFromObject(this.model);
            const center = box.getCenter(new Vector3());
            this.model.position.sub(center);

            const size = box.getSize(new Vector3()).length();
            this.setCameraPosition(size);
            this.addLighting();
            this.animate();
        }
    }

    setCameraPosition() {
        if (!this.model) {
            return
        }
        
        const box = new Box3().setFromObject(this.model);
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3()).length();
        this.offset = size * 1.5 // Distance from the object to fit it well within view
        this.camera.position.set(this.offset, this.offset, this.offset)
        this.camera.lookAt(center)

        // Adjust camera's orthographic view to keep the object visible
        this.camera.left = -size / 2
        this.camera.right = size / 2
        this.camera.top = size / 2
        this.camera.bottom = -size / 2
        this.camera.updateProjectionMatrix()
    }

    addLighting() {
        const ambientLight = new AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 5, 5).normalize();
        this.scene.add(directionalLight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    validateColor(color) {
        const hexRegex = /^([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
        if (hexRegex.test(color)) {
            if (color && color[0] !== "#") {
                color = "#" + color;
            }
            return new Color(color);
        }

        return new Color(color);
    }

    updateCameraSize() {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        const size = Math.min(width, height);
        this.renderer.setSize(size, size);
        this.setCameraPosition(size);
    }
}

export default ModelViewer3D;
