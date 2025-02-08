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

// Initialize the 3D model viewer
const viewer = new ModelViewer3D(modelSrc, colorHex, "#viewer-container")