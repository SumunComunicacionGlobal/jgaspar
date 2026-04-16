document.addEventListener('DOMContentLoaded', function () {
    // Registrar el plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Animar elementos con la clase .animate al entrar en el viewport
    gsap.utils.toArray('.wp-block-separator, #colophon nav.items-justified-center li, .block-animation > * > *').forEach(function (element) {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element, // Elemento que activa la animación
                start: 'top 80%', // Inicia cuando el top del elemento está al 80% del viewport
                end: 'bottom 20%', // Termina cuando el bottom del elemento está al 20% del viewport
                toggleActions: 'play none none none', // Reproducir solo una vez
            },
            opacity: 0,
            y: 50,
            duration: 0.3,
        });
    });

    // Función personalizada para dividir texto sin SplitText
    function splitTextToChars(element) {
        if (!element) return [];
        
        const text = element.textContent;
        element.innerHTML = '';
        
        const chars = [];
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const span = document.createElement('span');
            
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = char;
            }
            
            span.style.display = 'inline-block';
            chars.push(span);
            element.appendChild(span);
        }
        
        return chars;
    }
    
    // Verificar si el elemento existe
    const headingElement = document.querySelector(".wp-block-post-title");
    
    if (headingElement) {
        console.log("Elemento .wp-block-post-title encontrado:", headingElement);
        
        // Configurar el elemento
        //gsap.set("#heading", { opacity: 1 });
        
        // Crear los spans para cada caracter
        const chars = splitTextToChars(headingElement);
        
        console.log("Caracteres creados:", chars.length);
        
        // Animar cada caracter
        gsap.from(chars, {
            y: 20,
            autoAlpha: 0,
            stagger: 0.05,
            duration: 0.6,
            ease: "power2.out"
        });
    } else {
        console.error("Elemento .wp-block-post-title no encontrado");
    }

    //gsap.registerPlugin(ScrollTrigger, ScrollSmoother);


//Horizontal Scroll Galleries
if (document.getElementById("portfolio")) {
  const horizontalSections = gsap.utils.toArray(".horiz-gallery-wrapper");

  horizontalSections.forEach(function (sec, i) {
    const pinWrap = sec.querySelector(".horiz-gallery-strip");

    let pinWrapWidth;
    let horizontalScrollLength;

    function refresh() {
      pinWrapWidth = pinWrap.scrollWidth;
      horizontalScrollLength = pinWrapWidth - window.innerWidth;
    }

    refresh();
    // Pinning and horizontal scrolling
    gsap.to(pinWrap, {
      scrollTrigger: {
        scrub: true,
        trigger: sec,
        pin: sec,
        pinOffset: "100rem",
        start: "center center",
        end: () => `+=${pinWrapWidth}`,
        invalidateOnRefresh: true
      },
      x: () => -horizontalScrollLength,
      ease: "none"
    });

    ScrollTrigger.addEventListener("refreshInit", refresh);
  });
}

});