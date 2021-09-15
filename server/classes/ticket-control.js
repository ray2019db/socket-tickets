const fs = require('fs'); // Importa el File System de Node "fs" para poder trabajar con archivos en la aplicación, en este caso para guardar el contenido de "dataJsonString" en el archivo '../data/data.json'

class Ticket { // Esta clase no hace falta exportarla ya que solo se usará en este archivo

    constructor(numero, escritorio) { // En el constructor paso como parámetro el número del ticket en cuestión y el escritorio que lo va a atender (imagínense un ticket de una cola en el Banco). En otras palabras un Ticket sería un objeto con la sgte estructura "ticket= {numero: X, escritorio: X}"
        this.numero = numero;
        this.escritorio = escritorio;
    };
};

class TicketControl {

    constructor() { // Constructor de la clase, es un método que se ejecuta de manera automática tan pronto se llame o instancie la clase, por ej: "let ticket = new TicketControl()" (es lo primero que se ejecuta en una clase)

        this.ultimo = 0; // Almacena el valor del último ticket
        this.hoy = new Date().getDate(); // Almacena la fecha actual del sistema
        this.tickets = []; // Almacena todos los tickets en un arreglo
        this.ultimos4 = []; // Arreglo que almacena los ultimos 4 tickets que se están atendiendo en los escritorios

        let data = require('../data/data.json'); // Almacena el contenido del JSON que contiene el archivo '../data/data.json'

        if (data.hoy === this.hoy) { // Si la fecha actual (el día de hoy) es igual al día "data.hoy" almacenado en el json del archivo "data/data.json"
            this.ultimo = data.ultimo; // Almacena el valor de la clave "ultimo" del archivo "data.json"
            this.tickets = data.tickets; // Almacena el valor de la clave "tickets" del archivo "data.json" (almacena el arreglo de tickets)
            this.ultimos4 = data.ultimos4 // Almacena el valor de la clave "ultimos4" del archivo "data.json" (almacena en un arreglo los últimos 4 tickets que están siendo atendidos por los escritorios)
        } else { // Si la fecha actual (el día de hoy) NO es igual al día "data.hoy" almacenado en el json del archivo "data/data.json"
            this.reiniciarConteo(); // Cambia el valor de la clave "hoy" del json al valor de hoy de la fecha actual del sistema
        }
    };

    siguienteTicket() {
        this.ultimo += 1; // Incrementa en "1" el valor de "this.ultimo"
        let ticket = new Ticket(this.ultimo, null); // Instancio un nuevo ticket con la clase "Ticket" y le paso como parámetro (parámetros del constructor de la clase Ticket) el "numero = this.ultimo" y "escritorio = null" ya que aún no sé que escritorio va a atender ese ticket. let ticket = { this.numero: this.ultimo, this.escritorio: null}
        this.tickets.push(ticket); // Agrego con el método "push()" el nuevo ticket dentro del arreglo "tickets" en la última posición
        this.guardarArchivo(); // Guarda el valor de "this.ultimo" y el arreglo "tickets" en el archivo "data.json"
        return `Ticket ${this.ultimo}`; // Retorna o devuelve el valor del ültimo ticket, en este caso "this.ultimo"
    };

    ticketActual() {
        return `Ticket ${this.ultimo}`; // Retorna o devuelve el valor del ticket actual, en este caso el valor que tiene el último ticket "this.ultimo"
    };

    atenderTicket(escritorio) {
        if (this.tickets.length === 0) { // Si el array "tickets" está vacío:
            return 'No hay tickets para atender';
        }
        let numeroTicket = this.tickets[0].numero; // Almacena el ticket ubicado en la 1ra posición "[0]" del array "tickets"
        this.tickets.shift(); // Elimina el 1er ticket del arreglo "tickets" o sea "this.tickets[0]". El método "shift()" elimina la 1ra posición de un arreglo [0]
        let atenderTicket = new Ticket(numeroTicket, escritorio); // Almacena el ticket que está siendo atendido. Sería la instanciación del 1er ticket del arreglo "tickets" (1ra posición del arry [0]) cuyo número sería "numeroTicket" y el escritorio sería el pasado por parámetro en el método "atenderTicket"
        this.ultimos4.unshift(atenderTicket); // Inserta en la 1ra posición del arreglo "ultimos4" el ticket "atenderTicket". El método "unshift()" inserta un elemento en la 1ra posición de un arreglo [0]

        if (this.ultimos4.length > 4) { // Si la longitud del array "ultimos4" es mayor que "4":
            this.ultimos4.pop(); // Elimina el último ticket del arreglo "ultimos4". El método "pop()" elimina la última posición de un arreglo [legth -1]
        }

        console.log('Ultimos 4: ', this.ultimos4);

        this.guardarArchivo(); // Almacena el último Ticket que está siendo atendido en la 1ra posición del arreglo "ultimos4" y lo elimina del array "tickets", además elimina el ticket que ocupa la última posición del array "ultimos4"

        return atenderTicket; // Retorna en un objeto el último Ticket que está siendo atendido
    }

    ultimoTicketAtendido() { // Devuelve el último ticket que está siendo atendido
        if (this.ultimos4.length === 0) { // Si el arreglo "ultimos4" esta vacío:
            if (this.tickets.length === 0) { // Si el arry "tickets" está vacío:
                return 'No hay tickets para atender';
            } // // Si el arry "tickets" NO está vacío:
            return 'Hay Tickets en espera para ser atendidos'
        } // Si el arreglo "ultimos4" NO esta vacío:
        let ultimoTicket = this.ultimos4[0].numero; // Almacena el primer elemento del arreglo "ultimos4"
        return ultimoTicket; // Retorna el número del último ticket que está siendo atendido "this.ultimos4[0].numero"
    };

    ultimos4tickets() { // Devuelve un arreglo con los últimos 4 tickets que están siendo atendidos
        let ultimos4 = this.ultimos4;
        return ultimos4;
    };

    guardarArchivo() {
        let dataJson = { // Objeto que almacena los valores de inicialización empleados en el constructor de la clase
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        };
        let dataJsonString = JSON.stringify(dataJson); // Almacena el "dataJson" convertido a string en "dataJsonString"

        fs.writeFileSync('server/data/data.json', dataJsonString); // Guarda mediante el método "writeFileSync()" en el archivo '../data/data.json' el contenido de "dataJsonString". El 1er parámetro es la ruta o path del archivo donde queremos guardar los datos y el 2do es el dato a guardar
    };

    reiniciarConteo() { // Reinicia el valor de "ultimo" a 0
        this.ultimo = 0; // Reinicia en "0" el valor de "this.ultimo"
        this.tickets = []; //  Borra todos los Tickets que están dentro del arreglo y deja un arreglo vacío
        this.ultimos4 = []; //Elimina todos los tickets que se encuentran dentro del arreglo "ultimos4"
        this.guardarArchivo(); // Guardo "this.ultimo = 0" en el archivo "data.json"
        console.log('Reiniciando el conteo');
    };
};

module.exports = { TicketControl };