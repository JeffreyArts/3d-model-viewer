import ModelViewer3D from "./model-viewer-3d"

// Remove this function when building
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param)
}

// Extract the "src", "color", and "clean" parameters from the URL
const modelSrc = getQueryParam("src") // Replace with {{MODEL_SRC}} when building
const colorHex = getQueryParam("color") || "#FFFFFF" // Replace with {{COLOR}} when building
const cleanParam = getQueryParam("clean") // Remove this when building

// Remove this if statement when building + the HTML code from index.html
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
window.onload = () => {
    const viewer = new ModelViewer3D(modelSrc, colorHex, "#viewer-container")
}