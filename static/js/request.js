async function call(endpoint, method = "GET", data = null, params = null) {
    if (_.isUndefined(endpoint) || _.isEmpty(endpoint)) {
        return false;
    }

    let url = `http://localhost:8000/${endpoint}`;
    // let url = `https://api.sorteos.proy.iteraciona.com/fotos/${endpoint}`
    // Añade parámetros a la URL si se proporcionan
    if (params) {
        const urlParams = new URLSearchParams(params);
        url += `?${urlParams.toString()}`;
    }

    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json' // Optional for GET requests
        }
    };

    if (_.isEqual(method, "POST") && data instanceof FormData) {
        options.body = data;
        delete options.headers;
    }

    try {
        return await fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the response as JSON
            })
            .then(data => {
                console.log('Success:', data); // Handle the JSON response data
                return data;
            })
            .catch(error => {
                console.error('Error:', error); // Handle any errors
                return false;
            });
    } catch (e) {
        console.log(e.message);
        return false;
    }
}