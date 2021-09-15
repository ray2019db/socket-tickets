// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Establecer conexión del Socket cliente con el servidor
// ----------------------------------------------------------------------------------------------------------------------------------------------------
var socket = io(); // Almacena el método "io()" de la librería "socket.io/socket.io.js" importada en el archivo "nuevo-ticket.html" para establecer la conexión entre sockets. Uso "var" y no "let" para aumentar la compatibilidad con los navegadores

socket.on('connect', function() { // Establece la conexión con el socket.io del servidor. Tiene 2 parámetros, el 1ro tal cual literal 'connect' y el 2do un callback que ejecuta su contenido (no uso función de flecha para aumentar compatibilidad ya que no sé si soporta ES6). El método "on()" se emplea para escuchar información (siempre estará escuchando o atento a la conexión, en este caso está escuchando cuando el servidor se conecte)
    console.log('Conectado al Servidor');
});

socket.on('disconnect', function() { // Se ejecuta cuando detecta que se perdió la conexión con el socket.io del servidor. Tiene 2 parámetros, el 1ro tal cual literal 'disconnect' y el 2do un callback que ejecuta su contenido. El método "on()" se emplea para escuchar información (siempre estará escuchando o atento a la conexión, en este caso estará atento a una desconexión del servidor)
    console.log('Perdimos la conexión con el Servidor');
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Establecer Referencias de los Elementos html
// ----------------------------------------------------------------------------------------------------------------------------------------------------
var h1 = document.querySelector('h1'); // Establece la referencia al elemento <h1> del archivo html
var button = document.querySelector('button'); // Establece la referencia al elemento <button> del archivo html
var small = document.querySelector('small'); // Establece la referencia al elemento <small> del archivo html

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Emitir evento para saber cuál es el último ticket que ha sido atendido tan pronto inicie o reinicie esta página y sea mostrado en la vista html
// ----------------------------------------------------------------------------------------------------------------------------------------------------
socket.emit('ultimoTicketAtendido', function(resp) { // Emite el evento "ultimoTicketAtendido" mediante el método "emit()", no se pasa nada como 2do parámetro (o sea null) y como 3ro el callback que tiene como parámetro la respuesta del Socket del Servidor
    if (resp === 'No hay tickets para atender') { // Si la respuesta recibida por el Socket del Servidor es "resp === 'No hay tickets para atender'"
        return small.innerHTML = resp;
    } else if (resp === 'Hay Tickets en espera para ser atendidos') { // Si la respuesta recibida por el Socket del Servidor es "resp === 'Hay Tickets en espera para ser atendidos'"
        return small.innerHTML = resp;
    }
    small.innerHTML = `Ticket ${resp}`; // Imprime lo sgte en la vista html dentro del elemento <small>
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Obtener parámetros por el url
// ----------------------------------------------------------------------------------------------------------------------------------------------------
var queryString = window.location.search; // Almacena en un string todos los query pasados por parámetro en un url por ej: "url = http://localhost:3000/escritorio.html?escritorio=1&prueba=4" de esta url el queryString sería "?escritorio=1&prueba=4". En este ej. estaríamos pasando por url los query "escritorio=1" y "prueba=4". Utilizo "var" en lugar de "let" para aumentar la compatibilidad con los navegadores
var urlSearchParams = new URLSearchParams(queryString); // Se intancia la variable de tipo "URLSearchParams" que contendrá todos los métodos y propiedades de los parámetros pasados por url

if (!urlSearchParams.has('escritorio')) { // Si "urlSearchParams" NO contiene (método "has()") el parámetro de búsqueda "escritorio". 
    window.location = 'index.html'; // Navega hacia el archivo "index.html" o sea "url = http://localhost:3000/index.html"
    throw new Error('El escritorio es necesario'); // Dispara el sgte error. El "throw" es como un "return" que retorna el error y detiene el código que sigue
}
var escritorio = urlSearchParams.get('escritorio'); // Almacena el valor del parámetro de búsqueda "escritorio" obtenido con el método "get()" que viene por la url

h1.innerHTML = `Escritorio ${escritorio}`; // Muestra dentro del <h1> de la vista html el número del escritorio pasado como parámetro de búsqueda por la url

console.log(escritorio);

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Listener del botón "Atender siguiente ticket" (poner a la escucha del "click" del botón)
// ----------------------------------------------------------------------------------------------------------------------------------------------------
button.addEventListener('click', function() { // Escuche el evento "click" en el elemento <button> y ejecuta el contenido del callback
    socket.emit('atenderTicket', { escritorio: escritorio }, function(resp) { // Emite el evento "atenderTicket" con el método "emit()", como 1er parámetro paso el nombre del evento "atenderTicket", como 2do paso la data "{ escritorio: escritorio }" obtenido en la url como parámetro de búsqueda y como 3ro un callback que se ejecuta cuando reciba la respuesta "resp" del Socket del Servidor

        if (resp === 'No hay tickets para atender') {
            return small.innerHTML = resp;
        }
        small.innerHTML = `Ticket ${resp.numero}`; // Imprime el número del ticket que está siendo atendido en la vista html dentro del elemento <small>
    });
});