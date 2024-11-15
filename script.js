
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

// Display images for the current page with lazy loading
function displayImages() {
    galleryContainer.innerHTML = "";
    const startIndex = currentPage * imagesPerPage;
    const endIndex = Math.min(startIndex + imagesPerPage, shuffledImages.length);
    const imagesToDisplay = shuffledImages.slice(startIndex, endIndex);

    imagesToDisplay.forEach((image, index) => {
        const imgElement = document.createElement("img");
        imgElement.setAttribute("data-src", `${imageFolder}${image}`); // Lazysizes uses data-src
        imgElement.classList.add("col-6", "col-md-3", "img-thumbnail", "lazyload"); // lazyload class for Lazysizes
        imgElement.alt = `Image ${startIndex + index + 1}`;
        imgElement.onclick = () => openZoomedView(startIndex + index);
        galleryContainer.appendChild(imgElement);
    });

    updatePagination();
}

// Update pagination buttons based on total pages
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

// Open modal with the selected image in zoomed view
function openZoomedView(index) {
    currentZoomIndex = index;
    updateModalImage();
    modal.show();
}

// Update modal with current zoomed image
function updateModalImage() {
    modalImage.src = `${imageFolder}${shuffledImages[currentZoomIndex]}`; // Load full image in zoom
}

// Navigate in zoomed view
function navigateZoomedImage(direction) {
    currentZoomIndex = (currentZoomIndex + direction + shuffledImages.length) % shuffledImages.length;
    updateModalImage();
}

// Download functionality with watermark
function downloadImage() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = modalImage.src;

    img.onload = () => {
        // Set canvas size to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image to the canvas
        context.drawImage(img, 0, 0);

        // Add watermark
        context.font = '20px Arial';
        context.fillStyle = 'rgba(255, 255, 255, 0.7)';
        context.textAlign = 'right';
        context.fillText('https://bitch.asia', img.width - 10, img.height - 10);

        // Convert canvas to data URL
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg');
        link.download = 'downloaded_from_https://bitch.asia.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
}

// Share functionality
function shareImage() {
    const imgSrc = modalImage.src;
    if (navigator.share) {
        navigator.share({
            title: "Check out this image",
            url: imgSrc
        }).catch(console.error);
    } else {
        alert("Share functionality is not supported in this browser.");
    }
}

// Initialize gallery on load
shuffleImages();
displayImages();
