
import { Vector3, Box3, } from "three"
import ModelViewer3D from "./model-viewer-3d"
import gsap from "gsap"

// Extract the "src", "color", and "clean" parameters from the URL
const modelSrc = "{{MODEL_SRC}}" // Replace with "{{MODEL_SRC}}" when building
const colorHex = "{{COLOR}}" // Replace with "{{COLOR}}" when building

// Add mouse down / touch start listeners to change mouse cursor
document.addEventListener("mousedown", () => {
    document.body.classList.add("__isMouseDown")
})
document.addEventListener("mouseup", () => {
    document.body.classList.remove("__isMouseDown")
})
document.addEventListener("touchstart", () => {
    document.body.classList.add("__isMouseDown")
})
document.addEventListener("touchend", () => {
    document.body.classList.remove("__isMouseDown")
})



// Initialize the 3D model viewer
window.onload = () => {
    const viewer = new ModelViewer3D(modelSrc, colorHex, "#viewer-container")

    document.getElementById("home-icon").addEventListener("click", () => {
        const duration = .64
        const ease = "circ.out"

        gsap.to(viewer.camera.position, {
            x: viewer.offset,
            y: viewer.offset,
            z: viewer.offset,
            duration,
            ease,
            onUpdate: () => {
                const box = new Box3().setFromObject(viewer.model);
                const center = box.getCenter(new Vector3());
                viewer.camera.lookAt(center)
                viewer.camera.updateProjectionMatrix()
            }
        })

        gsap.to(viewer.camera, {
            zoom: 1,
            duration,
            ease,
        })
    })
}