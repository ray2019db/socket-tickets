const express = require('express'); // Importa el modulo de express (framework)

const socketio = require('socket.io'); // Importar paquete de Socket.io para integrarlo con express

const http = require('http'); // Importar el servidor http de Node (viene integrado con Node)

const path = require('path'); // Importa el path para utilizarlo en los path absolutos de la aplicación

const app = express(); // Almacena el método express para poder usar todos sus métodos, propiedades y middlewares

const server = http.createServer(app); // Definir el servidor http integrado con express para correr la aplicación

const publicPath = path.resolve(__dirname, '../public'); // Almacena el path absoluto de la carpeta "public" que comparte el servidor
const port = process.env.PORT || 3000; // Almacena el puerto por donde escuchará las peticiones el servidor. Si la variable de entorno existe y tiene un valor ese será el puerto para escuchar las peticiones (por ej: un servidor Heroku), de lo contrario el puerto será el "3000"

app.use(express.static(publicPath)); // Middleware para habilitar la carpeta "public" y que todos puedan acceder a ella para llamar archivos estáticos (en este caso ejecuta el contenido del archivo index.html por defecto si existe en la carpeta "public")

// -----------------------------------------------------------------------------------------------------------------------------------------
// COMUNICACIÓN DE SOCKET.IO DEL BACKEND
// -----------------------------------------------------------------------------------------------------------------------------------------
module.exports.io = socketio(server); // Inicializa el socket.io (iniciar la comunicación del socket en el servidor). Con "module.exports.io" exporto la constante "io" que es quien contiene la comunicación del socket en el servidor para poder usarla en otros archivos de la aplicación, en este caso en el archivo "./sockets/socket.js"

require('./sockets/socket'); // Llamo al arhivo "socket.js" ubicado en "./sockets/socket.js" que contiene toda la configuración del socket en la aplicación

server.listen(port, (err) => { // El método "listen()" permite al servidor escuchar peticiones, el 1er parámetro es el puerto por donde escuchará las peticiones http y el 2do es un callback que devuelve un error "err" si existe o en caso contrario ejecuta el contenido de la función

    if (err) throw new Error(err); // Si existe un error retorna o devuelve "throw new Error()" el error "err"

    console.log(`Servidor corriendo en puerto ${ port }`);
});