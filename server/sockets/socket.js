const { io } = require('../server'); // Importar la constante "io" del archivo '../server.js' que es quien maneja la comunicación del socket.io en el servidor

const { TicketControl } = require('../classes/ticket-control'); // Importar la clase "TicketControl" para poder usar todos sus métodos y propiedades

const ticketControl = new TicketControl(); // Instancio o inicializo la clase "TicketControl". Con solo hacer esto disparo el constructor de la clase y se ejecuta todo el código que este contiene

// ----------------------------------------------------------------------------------------------------------------------------------------------------
// Establecer conexión del socket del servidor con el cliente
// ----------------------------------------------------------------------------------------------------------------------------------------------------
io.on('connection', (client) => { // Establece la conexión con el socket.io del cliente. Tiene 2 parámetros, el 1ro tal cual literal 'connection' y el 2do un callback que ejecuta su contenido y pasa como parámetro los datos del cliente "client" (los datos de la PC cliente que está conectada)
    console.log('Usuario Conectado');

    client.emit('ticketActual', { // En cuanto se establece la conexión con el Socket Cliente emite un evento "ticketActual" y envía el sgte objeto con el ticket actual (último ticket creado) y los útimos 4 tickets que están siendo atendido por los escritorios
        ticketActual: ticketControl.ticketActual(), // La key "ticketActual" del objeto contendrá el valor retornado por la función "ticketActual()" que no es más qué el último ticket insertado o creado
        ultimos4: ticketControl.ultimos4tickets()
    });

    client.on('siguienteTicket', (callback) => { // Escuchar mediante el método "on()" el evento "siguienteTicket" emitido por algún socket cliente. El 1er parámetro es el nombre del evento a escuchar y el 2do es un callback que tiene como parámetro otra función callback
        let siguiente = ticketControl.siguienteTicket(); // Almacena el resultado devuelto por el método "siguienteTicket()"
        console.log(siguiente);
        callback(siguiente); // Ejecuta la función callback que viene como parámetro y a su vez se le pasa como parámetro a esta el contenido de "let siguiente" que no es más que lo que retornó la función "siguienteTicket()"
    });

    client.on('atenderTicket', (data, callback) => { // Escuchar mediante el método "on()" el evento "atenderTicket" emitido por algún socket cliente. El 1er parámetro es el nombre del evento a escuchar y el 2do es un callback que tiene como parámetros la "data" que envía el socket cliente y otra función "callback"
        if (!data.escritorio) { // Si en la "data" no viene ningún escritorio:
            return callback({ // Retorna en el callback el sgte objeto y no ejecutes más código
                err: true,
                message: 'Es necesario un Escritorio'
            });
        }
        let atenderTicket = ticketControl.atenderTicket(data.escritorio); // Almacena en un objeto retornado por la función "atenderTicket()" (a esta función se le pasa como parámetro el escritorio que viene en el evento "data.escritorio") el número del ticket y el número del escritorio que lo atenderá
        callback(atenderTicket); // Retorna en el callback un objeto "atenderTicket" que contiene el número del ticket y el número del escritorio que lo atenderá "{numero: X, escritorio: X}"

        client.broadcast.emit('ultimos4', { // Emite un evento para todos los clientes (broadcast) con un objeto que contiene un arreglo con los últimos 4 tickets atendidos por los escritorios
            ultimos4: ticketControl.ultimos4tickets() // Ejecuta la función "ultimos4Tickets" que retorna un arreglo con los últimos 4 tickets que están siendo atendidos por los escritorios
        });
    });

    client.on('ultimoTicketAtendido', (callback) => { // Escuchar mediante el método "on()" el evento "ultimoTicketAtendido" emitido por algún socket cliente. El 1er parámetro es el nombre del evento a escuchar y el 2do es un callback que ejecuta su contenido y lo devuelve como respuesta al Socket Cliente que emitió este evento
        let ultimoTicket = ticketControl.ultimoTicketAtendido(); //Almacena el valor retornado por la función "ultimoTicketAtendido", que no es más que el número del último ticket que está siendo atendido
        callback(ultimoTicket); // Devuelve en el callback como respuesta el valor almacenado en "let ultimoTicket"
    });

    client.on('disconnect', () => { // Con el método "on()" puedo escuchar si el usuario (client) se desconectó. El 1er parámetro tal cual literal 'disconnect' y el 2do es un callback que ejecuta su contenido cuando detecta que el usuario se desconecta
        console.log('Usuario Desconectado');
    });

});