// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Establecer las referncias del DOM (elementos de la vista html)
// ----------------------------------------------------------------------------------------------------------------------------------------------------
let boton = document.querySelector('button'); // Hace referencia al elemento <button> (botón "Generar nuevo Ticket") del html

let label = document.querySelector('#lblNuevoTicket'); // Hace referencia al <span> con (id="lblNuevoTicket") del html

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

socket.on('ticketActual', function(ticket) { // En cuanto se establece conexión con el Socket del servidor escuchar el evento "ticketActual" para recibir el objeto enviado por este en este caso "ticket"
    label.innerHTML = ticket.ticketActual; // Escribe dentro del "label" (dentro del <span> siguienteTicket </span>) de la vista html el contenido del objeto "ticket.ticketActual" retornado por el socket del servidor
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Escuchar el evento "click" del botón "Generar nuevo ticket"
// ----------------------------------------------------------------------------------------------------------------------------------------------------
boton.addEventListener('click', () => { // Pone al botón "Generar nuevo ticket" (boton) a escuchar el evento "click"

    socket.emit('siguienteTicket', function(siguienteTicket) { // Al hacer click sobre "boton" emite el evento "siguienteTicket" (al socket que esté escuchando dicho evento, en este caso el servidor). El 1er parámetro es el nombre del evento que se emite, el 2do es un objeto con la data que se envía con el evento (en este caso no se envía ningún dato, es null por eso no se escribe nada) y el 3ro es un callback que ejecuta su contenido
        label.innerHTML = siguienteTicket; // Escribe dentro del "label" (dentro del <span> siguienteTicket </span>) de la vista html el contenido de "siguienteTicket" retornado por el socket del servidor
    });
});