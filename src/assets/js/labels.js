const labelsSection = () => {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: select(".our-labels"),
      markers: showMarkers,
      scrub: true,
      start: "top 80%",
      end: "top 20%",
    },
  });

  tl.from(".our-labels .label", {
    duration: 1,
    opacity: 0,
    y: 100,
    stagger: 0.1,
  });

  tl.to(".circle-bottle img", {
    animation: 4,
  });

  $(".sneak_small a").hover((e) => {
    const elNode = e.currentTarget.dataset.sneak;
    $(".sneak_large li").removeClass("active");
    $(elNode).addClass("active");
  });

  $(".images_section").mouseout((e) => {
    $(".sneak_large li").removeClass("active");
  });
};

labelsSection();
// Add a trigger element to start the section's animation when it enters the viewport
const sectionAnimation = gsap.timeline({
  scrollTrigger: {
    trigger: "#mainSection", // Replace with the section's selector
    start: "top center", // Adjust the start position as needed
    end: "bottom center", // Adjust the end position as needed
    scrub: true, // Enables smooth scrubbing
  },
});

// Add animation to the timeline with a 10-second duration when scrolling
sectionAnimation.from(".circle-bottle img", {
	animation: 5, // Initial duration (10 seconds)
});

const divAnim = selectAll(".div-parallex");
if (divAnim) {
  divAnim.forEach((char, i) => {
    gsap.fromTo(
      char,
      {
        y: (window.innerWidth > 768) ? 50 : '' ,
        // opacity: 0.5,
      },
      {
        y: (window.innerWidth > 768) ? -50 : '' ,
        // ease: Power1.ease,
        ease: 'Power1.easeIn',
        // opacity: 1,
        duration: 0.3,
        stagger: 0.02,
        scrollTrigger: {
          trigger: char,
          start: "top bottom",
          end: "top -50%",
          scrub: true,
          markers: false,
          toggleActions: "play play reverse reverse",
        },
      }
    );
  });
}
