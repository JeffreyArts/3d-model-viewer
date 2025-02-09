
import { Vector3, Box3, } from "three"
import ModelViewer3D from "./model-viewer-3d"
import gsap from "gsap"

// Remove this function when building
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param)
}

// Extract the "src", "color", and "clean" parameters from the URL
const modelSrc = getQueryParam("src") // Replace with {{MODEL_SRC}} when building
const colorHex = getQueryParam("color") || "#FFFFFF" // Replace with {{COLOR}} when building
const cleanParam = getQueryParam("clean") // Remove this when building
console.log(cleanParam, typeof cleanParam)

// Remove this if statement when building + the HTML code from index.html
if (cleanParam === "1") {
    document.body.classList.add("__isVisible")
}

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