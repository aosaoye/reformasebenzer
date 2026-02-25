import { products, getProductById, searchProducts, getSimilarProducts, filterProducts } from './db.js';

// Reusable Product Card Component
// Reusable Project Card Component
function createProjectCard(project) {
    return `
    <a href="proyecto-detalle.html?id=${project.id}" class="block h-full cursor-pointer group">
        <div class="relative mb-6 overflow-hidden rounded-xl bg-stone-100 aspect-[4/3]">
            <img
                src="${project.image}"
                class="object-cover w-full h-full transition-all duration-700 opacity-0 ease-out group-hover:scale-105"
                alt="${project.name}"
                loading="lazy"
                onload="this.classList.remove('opacity-0')"
            />
            <div class="absolute inset-0 flex items-center justify-center transition duration-300 opacity-0 group-hover:opacity-100 bg-black/40">
                <button class="bg-white rounded-full text-stone-900 px-8 py-3 uppercase text-[10px] font-bold tracking-widest hover:bg-stone-900 hover:text-white transition transform translate-y-4 group-hover:translate-y-0 duration-300">
                    Ver Proyecto
                </button>
            </div>
        </div>
        <div class="flex flex-col gap-2">
            <h3 class="text-lg font-semibold tracking-tight transition-all truncate text-stone-900 group-hover:underline decoration-stone-400 underline-offset-4 decoration-1">
                ${project.name}
            </h3>
            <p class="text-[10px] uppercase tracking-widest text-stone-500">
                ${project.category}
            </p>
        </div>
    </a>
    `;
}

// ------------------------------------------------------------------
// Page Logic
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    // 1. Index Page: Carousel
    const carousel = document.getElementById('product-carousel');
    if (carousel) {
        carousel.innerHTML = '';
        const featuredProducts = products.slice(0, 8);

        featuredProducts.forEach(product => {
            const slide = document.createElement('div');
            slide.className = "min-w-full md:min-w-[calc(33.333%-1.34rem)] sm:min-w-[calc(50%-1rem)] snap-start";
            slide.innerHTML = createProjectCard(product);
            carousel.appendChild(slide);
        });
    }

    // 2. Proyectos Page: Full Grid & Filtering
    const gridContainer = document.querySelector('main .grid');
    const categoryList = document.getElementById('category-list');

    const sidebar = document.getElementById('filter-sidebar');

    if (sidebar && gridContainer) {
        let currentCategory = 'Todos';

        const renderProjects = () => {
            const filtered = filterProducts(currentCategory === 'Todos' ? null : currentCategory, 100000);

            const counter = document.querySelector('.text-stone-400.font-bold');
            if (counter && counter.textContent.includes('Mostrando')) {
                counter.textContent = `Mostrando ${filtered.length} Proyectos`;
            }

            gridContainer.innerHTML = '';
            filtered.forEach(project => {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = createProjectCard(project);
                gridContainer.appendChild(wrapper.firstElementChild);
            });
        };

        renderProjects();

        if (categoryList) {
            const items = categoryList.querySelectorAll('li');
            items.forEach(item => {
                item.addEventListener('click', () => {
                    const cat = item.dataset.category;
                    if (cat) {
                        currentCategory = cat;
                        items.forEach(i => i.classList.remove('text-stone-900', 'font-bold'));
                        item.classList.add('text-stone-900', 'font-bold');
                        renderProjects();
                    }
                });
            });
        }
    }


    // 3. Search Page
    if (window.location.pathname.includes('search.html')) {
        const searchInput = document.querySelector('input[type="text"]');
        const resultsContainer = document.querySelector('main .grid');

        if (resultsContainer) {
            renderSearchResults(products.slice(0, 4));

            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value;
                    const results = query ? searchProducts(query) : products.slice(0, 4);
                    renderSearchResults(results);
                });
            }
        }

        function renderSearchResults(results) {
            resultsContainer.innerHTML = '';
            results.forEach(product => {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = createProjectCard(product);
                resultsContainer.appendChild(wrapper.firstElementChild);
            });
        }
    }

    // 4. Proyecto Detalle Page
    if (window.location.pathname.includes('proyecto-detalle.html')) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (id) {
            const project = getProductById(id);
            if (project) {
                document.title = `${project.name} | Reformas Ebenzer`;

                const mainImg = document.querySelector('.aspect-\\[4\\/5\\] img');
                if (mainImg) {
                    mainImg.src = project.image;
                    mainImg.alt = project.name;
                }

                const title = document.querySelector('h1');
                if (title) title.textContent = project.name;

                const desc = document.querySelector('.space-y-6 text-sm p');
                if (desc) desc.textContent = project.description;

                const breadcrumbName = document.querySelector('nav.text-xs span.text-stone-900');
                if (breadcrumbName) breadcrumbName.textContent = project.name;

                // Specs
                const detailNodes = document.querySelectorAll('.grid-cols-2 div p.font-bold');
                if (detailNodes.length >= 3) {
                    detailNodes[0].textContent = project.details[1] || '4 Semanas'; // Plazo
                    detailNodes[1].textContent = "Nórdico Industrial"; // Style
                    detailNodes[2].textContent = "25 m²"; // Area
                    detailNodes[3].textContent = project.category; // Category
                }

                // Similar Projects
                const similarContainer = document.querySelector('section.mt-32 .grid');
                if (similarContainer) {
                    similarContainer.innerHTML = '';
                    const sim = getSimilarProducts(project.category, project.id);
                    sim.forEach(p => {
                        const wrapper = document.createElement('div');
                        wrapper.innerHTML = createProjectCard(p);
                        similarContainer.appendChild(wrapper.firstElementChild);
                    });
                }
            }
        }
    }


    // 5. Offers Page
    if (window.location.pathname.includes('offers.html')) {
        const offersGrid = document.getElementById('offers-grid');
        if (offersGrid) {
            const offerProducts = products.filter(p => p.originalPrice).slice(0, 12); // First 12 offers
            offersGrid.innerHTML = '';
            offerProducts.forEach(product => {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = createProductCard(product);
                offersGrid.appendChild(wrapper.firstElementChild);
            });
        }
    }

    // ------------------------------------------------------------------
    // Existing UI Logic (Drawer, Listeners)
    // ------------------------------------------------------------------

    // Mobile Drawer
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const closeBtn = document.getElementById("close-drawer-btn");
    const drawer = document.getElementById("mobile-drawer");
    const overlay = document.getElementById("drawer-overlay");

    function toggleDrawer() {
        if (!drawer || !overlay) return;
        const isClosed = drawer.classList.contains("-translate-x-full");
        if (isClosed) {
            drawer.classList.remove("-translate-x-full");
            overlay.classList.remove("opacity-0", "pointer-events-none");
        } else {
            drawer.classList.add("-translate-x-full");
            overlay.classList.add("opacity-0", "pointer-events-none");
        }
    }

    if (mobileBtn) mobileBtn.addEventListener("click", toggleDrawer);
    if (closeBtn) closeBtn.addEventListener("click", toggleDrawer);
    if (overlay) overlay.addEventListener("click", toggleDrawer);


    // Filter Sidebar Logic
    const openFiltersBtn = document.getElementById('open-filters');
    const closeFiltersBtn = document.getElementById('close-filters');
    const filterOverlay = document.getElementById('filter-overlay');
    let filterTl;

    if (sidebar && openFiltersBtn && closeFiltersBtn && filterOverlay) {
        filterTl = gsap.timeline({ paused: true, reversed: true });

        filterTl.to(filterOverlay, { opacity: 1, pointerEvents: "auto", duration: 0.2 }, 0);
        filterTl.to(sidebar, { x: 0, duration: 0.3, ease: "expo.out" })
            .from("#filter-sidebar h3, #filter-sidebar h4, #filter-sidebar ul li, #filter-sidebar input", {
                y: 20, opacity: 0, duration: 0.2, stagger: 0.05, ease: "power2.out"
            }, "-=0.4");

        const toggleFilter = () => {
            if (filterTl.reversed()) {
                filterTl.play();
                document.body.style.overflow = 'hidden';
            } else {
                filterTl.reverse();
                document.body.style.overflow = 'auto';
            }
        };

        openFiltersBtn.addEventListener('click', toggleFilter);
        closeFiltersBtn.addEventListener('click', toggleFilter);
        filterOverlay.addEventListener('click', toggleFilter);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !filterTl.reversed()) toggleFilter();
        });
    }

    // Carousel Nav
    const carouselNavPrev = document.getElementById('prev-prod');
    const carouselNavNext = document.getElementById('next-prod');

    if (carousel && carouselNavPrev && carouselNavNext) {
        const getScrollAmount = () => {
            const item = carousel.firstElementChild;
            if (!item) return 0;
            return item.offsetWidth + 32;
        };

        carouselNavPrev.addEventListener('click', () => {
            carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        carouselNavNext.addEventListener('click', () => {
            carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });
    }

    // GSAP ScrollTrigger
    if (document.querySelector('.kasaya-container')) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".kasaya-container",
                start: "top 80%",
                end: "top 20%",
                toggleActions: "play none none reverse"
            }
        });

        tl.to(".kasaya-card", { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" })
            .to(".kasaya-bg", { scale: 1, duration: 2, ease: "power2.out" }, "-=1");

        gsap.to(".kasaya-bg", {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: ".kasaya-container",
                scrub: true
            }
        });
    }

    if (document.querySelector('footer')) {
        gsap.to(".brand-bg-text", {
            xPercent: -20,
            ease: "none",
            scrollTrigger: {
                trigger: "footer",
                start: "top bottom",
                end: "bottom bottom",
                scrub: 1
            }
        });

        gsap.from("footer .grid > div", {
            y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out",
            scrollTrigger: { trigger: "footer", start: "top 85%" }
        });
    }

    // 6. WhatsApp Button Injection
    const waButton = document.createElement('a');
    waButton.href = "https://wa.me/34600000000?text=Hola,%20estoy%20interesado%20en%20solicitar%20un%20presupuesto%20para%20una%20reforma.";
    waButton.target = "_blank";
    waButton.className = "fixed bottom-8 right-8 z-[100] group";
    waButton.id = "whatsapp-chat";
    waButton.innerHTML = `
        <div class="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow-xl text-stone-900 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300 pointer-events-none border border-stone-100">
            ¿Te ayudamos con tu reforma?
        </div>
        <div class="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-200/50 hover:scale-110 transition-transform duration-300">
            <ion-icon name="logo-whatsapp" style="font-size: 32px;"></ion-icon>
        </div>
        <span class="absolute top-0 right-0 flex h-4 w-4">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
        </span>
    `;
    document.body.appendChild(waButton);

    // Initial appearance animation
    gsap.from(waButton, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        delay: 1,
        ease: "back.out(1.7)"
    });
});