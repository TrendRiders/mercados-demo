document.addEventListener('DOMContentLoaded', async function() {
    const qualityRange = document.getElementById('quality-range');
    const qualityRangeNumber = document.getElementById('quality-range-number');
    const productsRange = document.getElementById('products-range');
    const productsRangeNumber = document.getElementById('products-range-number');

    productsRange.value = 50;
    productsRangeNumber.innerHTML = 50;
    qualityRange.value = 50;
    qualityRangeNumber.innerHTML = 50;

    populateCanalDropdown();
    populateTiendaDropdown()
    populateFabricanteDropdown()
});

function openFilePicker() {
    document.getElementById('file-input').click();
}

function previewPhoto(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('photo').setAttribute('src', e.target.result);
    }
    reader.readAsDataURL(file);
}

async function populateCanalDropdown() {
    const dropdown = document.getElementById('canal');

    const emptyOption = document.createElement('option');
    emptyOption.value = ''; // Set the value to an empty string
    emptyOption.text = ''; // Set the text to an empty string
    dropdown.appendChild(emptyOption);

    const canales = await call('canal');
    const results = canales.results;
    results.forEach(function(item) {
        const option = document.createElement('option');
        option.value = item.id; // Set the value to id
        option.text = item.canal; // Set the text to canal
        dropdown.appendChild(option);
    });
}

async function populateTiendaDropdown() {
    const dropdown = document.getElementById('tienda');

    const emptyOption = document.createElement('option');
    emptyOption.value = ''; // Set the value to an empty string
    emptyOption.text = ''; // Set the text to an empty string
    dropdown.appendChild(emptyOption);

    const tiendas = await call('tienda');
    const results = tiendas.results;
    results.forEach(function(item) {
        const option = document.createElement('option');
        option.value = item.id; // Set the value to id
        option.text = item.tienda; // Set the text to canal
        dropdown.appendChild(option);
    });
}

async function populateFabricanteDropdown() {
    const dropdown = document.getElementById('fabricante');

    const emptyOption = document.createElement('option');
    emptyOption.value = ''; // Set the value to an empty string
    emptyOption.text = ''; // Set the text to an empty string
    dropdown.appendChild(emptyOption);

    const fabricantes = await call('fabricante');
    const results = fabricantes.results;
    results.forEach(function(item) {
        const option = document.createElement('option');
        option.value = item.id; // Set the value to id
        option.text = item.fabricante; // Set the text to canal
        dropdown.appendChild(option);
    });
}

async function getAnalisis(endpoint) {
    const colorCoding = document.getElementById('colorCoding');
    const qualityRange = document.getElementById('quality-range');
    const qualityRangeNumber = document.getElementById('quality-range-number');
    const productsRange = document.getElementById('products-range');
    const productsRangeNumber = document.getElementById('products-range-number');
    const fotoHour = document.getElementById('fotoHour');
    const georef = document.getElementById('georef');
    const descripcion = document.getElementById('descripcion');

    colorCoding.classList.remove('white');
    colorCoding.classList.remove('green');
    colorCoding.classList.remove('orange');
    colorCoding.classList.remove('red');

    // qualityRange = Calidad de la foto
    // productsRangeNumber = Marcas o productos presentes

    let params = {'calidadFoto': qualityRange.value, 'marcasPresentes': productsRange.value}

    colorCoding.innerHTML = "&nbsp;";
    productsRange.value = 50;
    productsRangeNumber.innerHTML = 50;
    qualityRange.value = 50;
    qualityRangeNumber.innerHTML = 50;
    fotoHour.innerHTML = "&nbsp;";
    georef.innerHTML = "&nbsp;";
    descripcion.innerHTML = "&nbsp;"

    document.getElementById('file-input').addEventListener("change", handlePhoto, false);

    function handlePhoto(event) {
        const file = event.target.files[0];

        if (_.isEmpty()) {
            return false;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const photo = e.target.result;
        }

        reader.onerror = function (e) {
            console.log(e)
        }

        reader.readAsText(file);
    }

    try {
        const fileInput = document.getElementById('file-input');
        const file = fileInput.files[0];

        const formData = new FormData();
        formData.append('file', file);

        if (file) {
            const analisis = await call(endpoint, 'POST', formData, params);
            const result = analisis.results
            
            console.log(result)
            let color;
            switch (true) {
                case (result.puntaje >= 0 && result.puntaje <= 33):
                    color = 'red';
                    break;
                case (result.puntaje >= 34 && result.puntaje <= 66):
                    color = 'orange';
                    break;
                case (result.puntaje >= 67 && result.puntaje <= 100):
                    color = 'green';
                    break;
                default:
                    color = 'white';
                    break;
            }

            colorCoding.classList.add(color);
            colorCoding.innerHTML = result.puntaje;
            productsRange.value = result.productos;
            productsRangeNumber.innerHTML = result.productos;
            qualityRange.value = result.calidad;
            qualityRangeNumber.innerHTML = result.calidad;
            fotoHour.innerHTML = moment(result.hora).local().format('DD-MM-YYYY HH:mm:ss');

            const link = `<a id="geo-link" href="https://www.google.com/maps?q=${result.georef.lat}, ${result.georef.lng}" target="_blank" class="text-blue-500 underline">${result.georef.lat}, ${result.georef.lng}</a>`;
            georef.innerHTML = link;
            descripcion.innerHTML = result.description;
        }
    } catch (e) {
        console.log(e.message);
    }
}

function updateProductRange() {
    rangeNumber.textContent = rangeInput.value;
}
const rangeInput = document.getElementById('products-range');
const rangeNumber = document.getElementById('products-range-number');
rangeInput.addEventListener('input', updateProductRange);

function updateQualityRange() {
    qualityRangeNumber.textContent = qualityRangeInput.value;
}

const qualityRangeInput = document.getElementById('quality-range');
const qualityRangeNumber = document.getElementById('quality-range-number');
qualityRangeInput.addEventListener('input', updateQualityRange);