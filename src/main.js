import ModelViewer3D from "./model-viewer-3d"
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param)
}

// Extract the "src", "color", and "clean" parameters from the URL
const modelSrc = getQueryParam("src")
const colorHex = getQueryParam("color") || "#FFFFFF" // Default to white if no color is provided
const cleanParam = getQueryParam("clean")

if (!cleanParam) {
    document.querySelector(".header").classList.add("__isVisible")
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
document.onload = () => {
    const viewer = new ModelViewer3D(modelSrc, colorHex, "#viewer-container")
}