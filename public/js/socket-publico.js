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
var ticket1 = document.querySelector('#lblTicket1'); // Hace referencia al "<sapn> Ticket X </sapn>" en la vista html, se usa "var" en lugar de "let" para aumentar compatibilidad con los navegadores
var ticket2 = document.querySelector('#lblTicket2');
var ticket3 = document.querySelector('#lblTicket3');
var ticket4 = document.querySelector('#lblTicket4');

var escritorio1 = document.querySelector('#lblEscritorio1'); // Hace referencia al "<sapn> Escritorio X </sapn>" en la vista html
var escritorio2 = document.querySelector('#lblEscritorio2');
var escritorio3 = document.querySelector('#lblEscritorio3');
var escritorio4 = document.querySelector('#lblEscritorio4');

var tickets = [ticket1, ticket2, ticket3, ticket4]; // Almacena en un arreglo las referencias de los tickets en la vista html
var escritorios = [escritorio1, escritorio2, escritorio3, escritorio4] // Almacena en un arreglo las referencias de los Escritorios en la vista html

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Escuchar Evento 'ticketActual' Emitido por el Socket del Servidor que devuelve la respueste "resp" en un objeto con el ticket actual (último ticket creado) y los útimos 4 tickets que están siendo atendido por los escritorios "{ ticketActual: X, ultimos4: [ {numero: X, escritorio: X}, {numero: Y, escritorio: Y}, {numero: Z, escritorio: Z}, {numero: W, escritorio: W} ] }"
// ----------------------------------------------------------------------------------------------------------------------------------------------------
socket.on('ticketActual', function(resp) {
    pintarHTML(resp.ultimos4); // Ejecuta la función "pintarHTML()" se pasa como parámetro el arreglo de tickets "ultimos4" retornado en la respuesta "resp" del Socket Servidor con los últimos 4 tickets atendidos por los escritorios
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Escuchar el Evento 'ultimos4' Emitido por el Socket del Servidor para todos los clientes (broadcast) al escuchar el evento "atenderTicket" que devuelve la respueste "resp" en un objeto que contiene un arreglo con los útimos 4 tickets que están siendo atendido por los escritorios "{ ticketActual: X, ultimos4: [ {numero: X, escritorio: X}, {numero: Y, escritorio: Y}, {numero: Z, escritorio: Z}, {numero: W, escritorio: W} ] }"
// ----------------------------------------------------------------------------------------------------------------------------------------------------
socket.on('ultimos4', function(resp) {
    var audio = new Audio('audio/new-ticket.mp3'); // Almacena un archivo de audio. Se instancia mediante "new Audio()" para indicarle a esta variable el tipo de información que contendrá (en este caso audio) y se pasa como parámetro la ruta o path del archivo de audio
    audio.play(); // Carga y reproduce un archivo multimedia mediante el método "play()", en este caso reproduce el archivo que contiene la variable "var audio"
    pintarHTML(resp.ultimos4); // Ejecuta la función "pintarHTML()" que pasa como parámetro el arreglo de tickets "ultimos4" retornado en la respuesta "resp" del Socket Servidor con los últimos 4 tickets atendidos por los escritorios

});

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Pintar los Elementos en la vista html
// ----------------------------------------------------------------------------------------------------------------------------------------------------
function pintarHTML(ultimos4) {
    for (var i = 0; i <= ultimos4.length - 1; i++) { // Recorre en un ciclo For un arreglo "ultimos4" pasado como parámetro con los ultimos 4 tickets atendidos por los escritorios
        tickets[i].innerHTML = 'Ticket: ' + ultimos4[i].numero; // Pinta en el html los Tickets que contien el arreglo "ultimos4" recorridos por el ciclo For
        escritorios[i].innerHTML = 'Escritorio: ' + ultimos4[i].escritorio; // Pinta en el html los Escritorios que contiene el arreglo "ultimos4" recorridos por el ciclo For
    }
};