// Function to initialize the app and hide sections
function initializeApp() {
    hideSections();
    showSection('foto-section');
}

// Function to hide all sections except the specified one
function hideSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
}

// Function to show a specific section
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
    }
}

// Function to handle taking a new photo
function openFilePicker() {
    document.getElementById('file-input').click();
}

// Function to handle previewing a photo
function previewPhoto(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('photo').setAttribute('src', e.target.result);
        showSectionsAfterPhoto(); // Show other sections after selecting a photo
    }
    reader.readAsDataURL(file);
}

// Function to show sections other than 'Foto' after a photo is uploaded
function showSectionsAfterPhoto() {
    const sectionsToShow = ['informacion-section', 'analisis-section', 'descripcion-section', 'startover-section'];
    sectionsToShow.forEach(sectionId => {
        showSection(sectionId);
    });
    setRandomArea();
    setRandomGeoLocation();
}

// Function to reset the app and start over with a new photo
function resetApp() {
    hideSections();
    showSection('foto-section');
    document.getElementById('photo').src = ''; // Reset photo preview
    document.getElementById('file-input').value = ''; // Clear file input
}

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Event listener for when the color range input is changed
document.getElementById('color-range').addEventListener('input', function() {
    updateColor();
});

// Function to update the color based on the range value
function updateColor() {
    const range = document.getElementById('color-range');
    const colorPicker = document.getElementById('color-picker');
    const value = range.value;

    // Calculate color based on value
    const red = Math.floor(255 * (100 - value) / 100);
    const green = Math.floor(255 * value / 100);
    const color = `rgb(${red}, ${green}, 0)`;

    // Set color picker value
    colorPicker.value = rgbToHex(red, green, 0);
    colorPicker.style.backgroundColor = color;
}

// Function to convert RGB to HEX color format
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Function to set a random area value
function setRandomArea() {
    const areaText = document.getElementById('area-text');
    const randomPercentage = Math.floor(Math.random() * 100) + 1;
    areaText.value = `${randomPercentage}%`;
}

// Function to set a random geolocation within Lima Metropolitana, Lima, Peru
function setRandomGeoLocation() {
    const geoLink = document.getElementById('geo-link');
    const minLat = -12.15;
    const maxLat = -12.05;
    const minLng = -77.10;
    const maxLng = -76.90;

    const randomLat = (Math.random() * (maxLat - minLat) + minLat).toFixed(6);
    const randomLng = (Math.random() * (maxLng - minLng) + minLng).toFixed(6);
    const geoUrl = `https://www.google.com/maps?q=${randomLat},${randomLng}`;

    geoLink.href = geoUrl;
    geoLink.textContent = `(${randomLat}, ${randomLng})`;
}
