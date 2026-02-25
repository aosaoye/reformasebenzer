"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function HomeAnimations() {
    useEffect(() => {
        // Reveal project cards
        const cards = gsap.utils.toArray(".project-card");
        if (cards.length > 0) {
            gsap.from(cards, {
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".grid",
                    start: "top 85%",
                }
            });
        }

        // Reveal AI Section Image
        if (document.querySelector('.reveal-image')) {
            gsap.from(".reveal-image", {
                scale: 0.9,
                opacity: 0,
                duration: 1.5,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: ".reveal-image",
                    start: "top 80%",
                }
            });
        }

        // Commitment Section animations (Kasaya)
        if (document.querySelector('.kasaya-container')) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".kasaya-container",
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });

            tl.from(".kasaya-card", {
                opacity: 0,
                y: 50,
                duration: 1.2,
                ease: "power4.out"
            })
                .from(".kasaya-bg img", {
                    scale: 1.3,
                    duration: 2,
                    ease: "power2.out"
                }, "-=1");

            // Parallax background
            gsap.to(".kasaya-bg img", {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: ".kasaya-container",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        return () => {
            ScrollTrigger.getAll().forEach((t: any) => t.kill());
        };
    }, []);

    return null;
}
