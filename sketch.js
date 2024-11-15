/*
 * Copyright (c) 2024 Your Company Name
 * All rights reserved.
 */

// Variables del juego
let anchoCanvas = 930;
let altoCanvas = 350;
let sonidoColision = ('./sonidos/bounce.wav');// Variable para almacenar el sonido de la colisión
let jugadorX = 15; // Posición horizontal de la raqueta del jugador
let jugadorY;
let jugadorAltura = 80;
let jugadorAnchura = 10;

let computadoraX = anchoCanvas - 20; // Posición horizontal de la raqueta de la computadora
let computadoraY;
let computadoraAltura = 80;
let computadoraAnchura = 10;

let pelotaX, pelotaY; // Posición de la pelota
let pelotaTamano = 20;
let velocidadPelotaX = 3; // Velocidad inicial de la pelota en el eje X (reducción de la velocidad)
let velocidadPelotaY = 3; // Velocidad inicial de la pelota en el eje Y (reducción de la velocidad)
let anguloRotacion = 0; // Variable para el ángulo de rotación de la pelota

let grosorMarco = 10; // Grosor del marco superior e inferior

// Variables de puntuación
let jugadorPuntaje = 0;
let computadoraPuntaje = 0;

// Variables para las imágenes
let fondo;
let imgJugador, imgComputadora, imgPelota;

function preload() {
    // Cargar las imágenes
    fondo = loadImage('fondo1.png');
    imgJugador = loadImage('barra1.png');  // Raqueta del jugador
    imgComputadora = loadImage('barra2.png');  // Raqueta de la computadora
    imgPelota = loadImage('bola.png');  // Pelota
}

function setup() {
    createCanvas(anchoCanvas, altoCanvas);
    jugadorY = altoCanvas / 2 - jugadorAltura / 2;
    computadoraY = altoCanvas / 2 - computadoraAltura / 2;
    pelotaX = anchoCanvas / 2;
    pelotaY = altoCanvas / 2;
}

function draw() {
    // Dibujar la imagen de fondo
    background(0);
    image(fondo, 0, 0, anchoCanvas, altoCanvas); // Dibuja la imagen para cubrir todo el canvas

    // Dibujar marco superior e inferior
    fill("#2B3FD6"); // Color blanco para el azul
    rect(0, 0, anchoCanvas, grosorMarco); // Marco superior
    rect(0, altoCanvas - grosorMarco, anchoCanvas, grosorMarco); // Marco inferior

    // Mostrar puntuación
    textSize(32);
    fill("#2B3FD6");//Color blanco para el azul//k
    text(jugadorPuntaje, anchoCanvas / 4, 40); // Puntuación del jugador
    text(computadoraPuntaje, (3 * anchoCanvas) / 4, 40); // Puntuación de la computadora

    // Dibujar raqueta del jugador (usando imagen)
    image(imgJugador, jugadorX, jugadorY, jugadorAnchura, jugadorAltura);

    // Dibujar raqueta de la computadora (usando imagen)
    image(imgComputadora, computadoraX, computadoraY, computadoraAnchura, computadoraAltura);

    // Aplicar rotación a la pelota
    push();
    translate(pelotaX, pelotaY); // Mover el sistema de coordenadas a la posición de la pelota
    rotate(anguloRotacion); // Aplicar la rotación
    imageMode(CENTER); // Colocar la pelota centrada en la nueva posición
    image(imgPelota, 0, 0, pelotaTamano, pelotaTamano); // Dibujar la pelota
    pop();

    // Movimiento de la pelota
    pelotaX += velocidadPelotaX;
    pelotaY += velocidadPelotaY;

    // Aumentar el ángulo de rotación en función de la velocidad de la pelota
    anguloRotacion += (abs(velocidadPelotaX) + abs(velocidadPelotaY)) * 0.02;

    // Rebote de la pelota en el marco superior e inferior
    if (pelotaY - pelotaTamano / 2 <= grosorMarco || pelotaY + pelotaTamano / 2 >= altoCanvas - grosorMarco) {
        velocidadPelotaY *= -1;
    }

    // Rebote de la pelota en la raqueta del jugador con ajuste de ángulo
    if (pelotaX - pelotaTamano / 2 <= jugadorX + jugadorAnchura &&
        pelotaY >= jugadorY &&
        pelotaY <= jugadorY + jugadorAltura) {
        let offsetY = pelotaY - (jugadorY + jugadorAltura / 2);
        let angleAdjustment = offsetY * 0.4; // Ajusta este valor para cambiar el ángulo

        // Cambiar la dirección en X y ajustar la velocidad en Y para inclinar el ángulo
        velocidadPelotaX *= -1;
        velocidadPelotaY += angleAdjustment;

        // Asegurarse de que la velocidad no sea demasiado baja
        if (abs(velocidadPelotaX) < 2) velocidadPelotaX = 2; 
        if (abs(velocidadPelotaY) < 2) velocidadPelotaY = 2;
    }

    // Rebote de la pelota en la raqueta de la computadora con ajuste de ángulo
    if (pelotaX + pelotaTamano / 2 >= computadoraX &&
        pelotaY >= computadoraY &&
        pelotaY <= computadoraY + computadoraAltura) {
        let offsetY = pelotaY - (computadoraY + computadoraAltura / 2);
        let angleAdjustment = offsetY * 0.5; // Ajusta este valor para cambiar el ángulo

        // Cambiar la dirección en X y ajustar la velocidad en Y para inclinar el ángulo
        velocidadPelotaX *= -1;
        velocidadPelotaY += angleAdjustment;

        // Asegurarse de que la velocidad no sea demasiado baja
        if (abs(velocidadPelotaX) < 2) velocidadPelotaX = 2;
        if (abs(velocidadPelotaY) < 2) velocidadPelotaY = 2;
    }

    // Reiniciar posición de la pelota si sale del canvas (gol) y actualizar el puntaje
    if (pelotaX < 0) { // Gol de la computadora
        computadoraPuntaje++;
        resetPelota();
    } else if (pelotaX > anchoCanvas) { // Gol del jugador
        jugadorPuntaje++;
        resetPelota();
    }

    // Movimiento de la raqueta del jugador
    let velocidadRaquetaJugador = 10; // Reducir la velocidad de la raqueta del jugador
    if (keyIsDown(UP_ARROW)) {
        jugadorY -= velocidadRaquetaJugador;
    } else if (keyIsDown(DOWN_ARROW)) {
        jugadorY += velocidadRaquetaJugador;
    }

    // Movimiento de la raqueta de la computadora (más suave)
    let velocidadComputadora = 4; // Velocidad de seguimiento de la computadora
    if (pelotaY < computadoraY + computadoraAltura / 2) {
        computadoraY -= velocidadComputadora;
    } else if (pelotaY > computadoraY + computadoraAltura / 2) {
        computadoraY += velocidadComputadora;
    }

    // Limitar el movimiento de las raquetas dentro del área entre los marcos usando constrain
    jugadorY = constrain(jugadorY, grosorMarco, altoCanvas - grosorMarco - jugadorAltura);
    computadoraY = constrain(computadoraY, grosorMarco, altoCanvas - grosorMarco - computadoraAltura);
}

// Función para reiniciar la posición de la pelota al centro
function resetPelota() {
    pelotaX = anchoCanvas / 2;
    pelotaY = altoCanvas / 2;
    velocidadPelotaX = random([-3, 3]); // Cambiar dirección de la pelota
    velocidadPelotaY = random([-3, 3]);
}
//velocidad progresiva//
if (jugadorPuntaje > 5 || computadoraPuntaje > 5) {
    velocidadPelotaX = velocidadPelotaX * 1.1;  // Aumentar velocidad gradualmente
    velocidadPelotaY = velocidadPelotaY * 1.1;
}
if (!sonidoColision.isPlaying()) {
    sonidoColision.play();
}
    
