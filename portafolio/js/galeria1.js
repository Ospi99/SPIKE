// js/galeria1.js

/*--------------------
Vars
--------------------*/
let progress = 0;
let startX = 0;
let active = 0;
let isDown = false;

/*--------------------
Contants
--------------------*/
const speedWheel = 0.02;
const speedDrag = -0.1;

/*--------------------
Get Z
--------------------*/
const getZindex = (array, index) => (array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i)));

/*--------------------
Items
--------------------*/
const $items = document.querySelectorAll('.carousel-item');


// --- INICIALIZACIÓN DE ELEMENTOS DEL CURSOR Y BOTÓN ---
// Se aseguran de que se busquen DESPUÉS de que el DOM esté cargado.
let customCursor = null;
let backButton = null;

document.addEventListener('DOMContentLoaded', () => {
    customCursor = document.querySelector('.custom-cursor');
    backButton = document.getElementById('backButton');

    if (!customCursor) {
        console.error("Error: Elemento '.custom-cursor' no encontrado en el DOM. El cursor personalizado no funcionará.");
    }
    if (!backButton) {
        console.warn("Advertencia: Elemento '#backButton' no encontrado en el DOM. El efecto de hover del cursor para este botón no funcionará.");
    }

    // --- LÓGICA PARA EFECTO DE HOVER EN EL BOTÓN "VOLVER" PARA EL ÚNICO CURSOR ---
    if (backButton && customCursor) {
        backButton.addEventListener('mouseenter', () => {
            customCursor.classList.add('custom-cursor-hover-effect');
        });

        backButton.addEventListener('mouseleave', () => {
            customCursor.classList.remove('custom-cursor-hover-effect');
        });
    }

    // Opcional: Si quieres que el cursor se vea diferente sobre todos los elementos cliqueables del carrusel
    const interactiveElements = document.querySelectorAll('.carousel-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (customCursor) customCursor.classList.add('custom-cursor-hover-effect');
        });
        el.addEventListener('mouseleave', () => {
            if (customCursor) customCursor.classList.remove('custom-cursor-hover-effect');
        });
    });

    // Animar la galería solo después de cargar todo
    animate();
});
// --- FIN INICIALIZACIÓN ---


const displayItems = (item, index, active) => {
    const zIndex = getZindex([...$items], active)[index];
    item.style.setProperty('--zIndex', zIndex);
    item.style.setProperty('--active', (index - active) / $items.length);
};

/*--------------------
Animate
--------------------*/
const animate = () => {
    progress = Math.max(0, Math.min(progress, 100));
    active = Math.floor(progress / 100 * ($items.length - 1));

    $items.forEach((item, index) => displayItems(item, index, active));
};
// La llamada a animate() inicial se mueve dentro del DOMContentLoaded


/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
    item.addEventListener('click', () => {
        progress = (i / ($items.length - 1)) * 100;
        animate();
    });
});

/*--------------------
Handlers
--------------------*/
const handleWheel = e => {
    const wheelProgress = e.deltaY * speedWheel;
    progress = progress + wheelProgress;
    animate();
};

const handleMouseMove = (e) => {
    // --- LÓGICA PARA MOVER EL ÚNICO CURSOR PERSONALIZADO ---
    if (customCursor) { // Asegura que el customCursor fue encontrado
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    }
    // --- FIN LÓGICA DE MOVIMIENTO ---

    if (!isDown) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const mouseProgress = (x - startX) * speedDrag;
    progress = progress + mouseProgress;
    startX = x;
    animate();
};

const handleMouseDown = e => {
    isDown = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
};

const handleMouseUp = () => {
    isDown = false;
};

/*--------------------
Listeners
--------------------*/
// Estos listeners se adjuntan al `document` para que funcionen globalmente
document.addEventListener('wheel', handleWheel);
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('touchstart', handleMouseDown);
document.addEventListener('touchmove', handleMouseMove);
document.addEventListener('touchend', handleMouseUp);