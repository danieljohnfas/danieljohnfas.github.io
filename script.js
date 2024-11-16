
console.log("Script loaded and running");

const imageFolder = 'newimages/'; // Folder containing images
const totalImages = 390; // Total number of images
const imagesPerPage = 20; // Number of images per page
let shuffledImages = [];
let currentPage = 0;
let currentZoomIndex = 0;

const galleryContainer = document.getElementById("gallery-container");
const paginationContainer = document.getElementById("pagination");
const modalImage = document.getElementById("modal-image");
const modal = new bootstrap.Modal(document.getElementById("modal"));

// Shuffle images array and initialize the gallery
function shuffleImages() {
    shuffledImages = Array.from({ length: totalImages }, (_, i) => `newphoto${i + 1}.jpg`);
    shuffledImages.sort(() => Math.random() - 0.5);
}

// Display images for the current page
function displayImages() {
    galleryContainer.innerHTML = "";
    const startIndex = currentPage * imagesPerPage;
    const endIndex = Math.min(startIndex + imagesPerPage, shuffledImages.length);
    const imagesToDisplay = shuffledImages.slice(startIndex, endIndex);

    imagesToDisplay.forEach((image, index) => {
        const imgElement = document.createElement("img");
        imgElement.src = `${imageFolder}${image}`; // Directly load images
        imgElement.classList.add("col-6", "col-md-3", "img-thumbnail");
        imgElement.alt = `Image ${startIndex + index + 1}`;
        imgElement.onclick = () => openZoomedView(startIndex + index);
        galleryContainer.appendChild(imgElement);
    });

    updatePagination();
}

// Update pagination buttons
function updatePagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(shuffledImages.length / imagesPerPage);

    for (let i = 0; i < totalPages; i++) {
        const li = document.createElement("li");
        li.classList.add("page-item");
        if (i === currentPage) li.classList.add("active");

        const button = document.createElement("button");
        button.classList.add("page-link");
        button.textContent = i + 1;
        button.onclick = () => goToPage(i);

        li.appendChild(button);
        paginationContainer.appendChild(li);
    }
}

// Navigate to the specified page
function goToPage(page) {
    currentPage = page;
    displayImages();
}

// Open modal for zoomed view
function openZoomedView(index) {
    currentZoomIndex = index;
    updateModalImage();
    modal.show();
}

// Update modal with current zoomed image
function updateModalImage() {
    modalImage.src = `${imageFolder}${shuffledImages[currentZoomIndex]}`; // Load full image in zoom
}

// Initialize gallery
shuffleImages();
displayImages();
