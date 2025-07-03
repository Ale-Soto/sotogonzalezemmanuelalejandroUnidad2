//Primero buscamos la API de Open Weather que es gratuita y nos registramos para obtener la API key con la que consumiremos la API.
const urlBase = 'https://api.openweathermap.org/data/2.5/weather';
let api_key = '7c0b536af4f464225311760ab53f873f';
let conv = 273.15; //>Tomando en cuenta que la API nos arroja el clima en grados kelvin y que la diferencia entre kelvin y celsius es de 273.15.
//Utilizaremos la url que nos define el clima dependiendo de la ciudad:
//La url original (la que nos brina la pág.) es: https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
//Sin enbargo modificamos lo que esta encerrado en llaves por lo que indica, la ciudad de nuestra elección y la API Key que guardamos en una variable previamente. 
// Función que escucha el evento "input" en el campo de ciudad y llama a la API de autocompletado.

document.getElementById('ciudadEntrada').addEventListener('input', async (e) => {
    const ciudad = e.target.value.trim();
    const opcionesDiv = document.getElementById('opciones');

    if (ciudad.length > 2) {
        opcionesDiv.style.display = 'block'; // Mostrar contenedor (aún vacío)
        opcionesDiv.innerHTML = '<div class="opcion">Buscando...</div>'; // Feedback visual
        
        try {
            await buscarCiudades(ciudad); // Espera a que la búsqueda asíncrona termine
        } catch (error) {
            opcionesDiv.innerHTML = '<div class="opcion">Error al buscar</div>';
        }
    } else {
        opcionesDiv.style.display = 'none'; // Ocultar si hay menos de 3 caracteres
        opcionesDiv.innerHTML = '';
    }
});

async function buscarCiudades(ciudad) {
    const url = `https://api.openweathermap.org/data/2.5/find?q=${ciudad}&appid=${api_key}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.list && data.list.length > 0) {
        mostrarOpciones(data.list); // Mostrar resultados
    } else {
        document.getElementById('opciones').innerHTML = '<div class="opcion">No se encontraron resultados</div>';
    }
}

// Función para mostrar las opciones de ciudades en el div correspondiente.
function mostrarOpciones(ciudades) {
    const opcionesDiv = document.getElementById('opciones');
    opcionesDiv.innerHTML = ''; // Limpiar "Buscando..." o mensajes previos

    ciudades.forEach(ciudad => {
        const option = document.createElement('div');
        option.classList.add('opcion');
        option.textContent = `${ciudad.name}, ${ciudad.sys.country}`;
        option.addEventListener('click', () => {
            document.getElementById('ciudadEntrada').value = `${ciudad.name}, ${ciudad.sys.country}`;
            opcionesDiv.style.display = 'none'; // Ocultar al seleccionar
            fetchDatosClima(ciudad.name);
        });
        opcionesDiv.appendChild(option);
    });
}

document.getElementById('botonBusqueda').addEventListener('click', () => { //>Para que pueda ser dinámica la ciudad debe ser variable.
    const ciudad = document.getElementById('ciudadEntrada').value
    if (ciudad) {
        fetchDatosClima(ciudad)
    }
})

function fetchDatosClima(ciudad) {
    const datosClimaDiv = document.getElementById('datosClima');
    datosClimaDiv.innerHTML = '<div class="spinner">Cargando...</div>';

    fetch(`${urlBase}?q=${ciudad}&appid=${api_key}`)
        .then(response => {
            if (!response.ok) {
                // Si la respuesta no es 2xx (ej. 404)
                throw new Error(response.status === 404 ? 'Ciudad no encontrada' : 'Error en la petición');
            }
            return response.json();
        })
        .then(data => {
            mostrarDatosClima(data);
        })
        .catch(error => {
            datosClimaDiv.innerHTML = `
                <p class="error">${error.message === 'Ciudad no encontrada' 
                    ? `"${ciudad}" no fue encontrada. Intenta con otro nombre.` 
                    : 'Error al obtener datos. Intenta nuevamente.'}
                </p>`;
        });
}


//Realizamos una funcion para obtener la info de la api en base a la ciudad ingresada y para darle estructura:

function mostrarDatosClima(data) { //Esta funcion obtiene el elemento html con id 'datosClima' y debe mostrar la resolución de la promesa (que es la información del tiempo) dentro del elemento.
    const divDatosClima = document.getElementById('datosClima')
    divDatosClima.innerHTML = ''
        //https://openweathermap.org/img/wn/10d@2x.png

            // Verificamos si la API devuelve datos inesperados
    if (!data || !data.sys || !data.weather) {
        throw new Error('Datos climáticos incompletos');
    }

        //Aqi declaramos las variables que se desplegaran acorde a la obtención de los datos:
    const ciudadNombre = data.name; //debido a que data viene a ser un nodo le otorgamos el valor de cada clave correspondiente a cada variable.
    const paisNombre = data.sys.country;
    const temperatura = data.main.temp;
    const clima = Math.trunc(temperatura - conv);
    const descripcion = data.weather[0].description; //en este caso dentro del nodo weather es uno objeto,y la info que necesitamos se encuentra ene l indice 0 de dicho objeto.
    const icono = data.weather[0].icon;

    //Creamos los elementos que contendrá el div html a partir de las variables obtenidas:
    const ciudadTitulo = document.createElement('h2'); //creamos un h2 para el nombre de la ciudad.
    ciudadTitulo.textContent = `${ciudadNombre}, ${paisNombre}`;
    const ciudadTemp = document.createElement('p'); //Creamos un párrafo con la temperatura.
    ciudadTemp.textContent = `La temperatura es: ${clima}°C`;
    const climaIcono = document.createElement('img'); //Creamos una imagen con el icono del tiempo.
    climaIcono.src = `https://openweathermap.org/img/wn/${icono}@2x.png`;
    const ciudadDesc = document.createElement('p'); //Creamos otro párrafo con la descripción.
    ciudadDesc.textContent = `El día de hoy se presume con: ${descripcion}`;

    //Enlazamos los elementos que recién creamos al div html usando appendChild:

    divDatosClima.appendChild(ciudadTitulo); //appendChild es una función interna de java que ingresa elementos a un elemento contenedor (como lo es un div).
    divDatosClima.appendChild(ciudadTemp);
    divDatosClima.appendChild(climaIcono);
    divDatosClima.appendChild(ciudadDesc);
}

function hideLoader() {

    document.getElementById('loader').style.display = 'none'

    document.getElementById('content').style.display = 'block'

}

// Función para cargar todas las funciones y scripts necesarios

function loadAllScripts() {
    return new Promise((resolve, reject) => {
        // Aquí podrías verificar si todas las funciones están listas
        try {
            // Lógica para asegurar la carga completa de scripts y funciones
            // Esto puede incluir promesas de scripts específicos, revisiones de elementos o cualquier otro proceso asíncrono
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const MIN_LOADING_TIME = 2000 // 2 seconds
    let startLoadingTime = Date.now()

    window.addEventListener('load', function () {
        // Aquí se asegura que todas las funciones necesarias estén cargadas
        loadAllScripts().then(() => {

            let currentTime = Date.now()
            let elapsedTime = currentTime - startLoadingTime
            let remainingTime = MIN_LOADING_TIME - elapsedTime

            if (remainingTime > 0) {
                setTimeout(hideLoader, remainingTime)
            } else {
                hideLoader()
            }

        }).catch((error) => {

            toastr["error"](`ERROR AL CARGAR LOS SCRIPTS: ${error}`, "AVRE")
            hideLoader()

        })
    })

})