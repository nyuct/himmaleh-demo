/// Global Variables
const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Nokia|Opera Mini/i.test(navigator.userAgent) ? true : false;
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;

let isAudioEnabled = false;
const showMarkers = false;

const select = e => document.querySelector(e);
const selectAll = e => document.querySelectorAll(e);

if (document.getElementById("kumaonVideo")) {
  const kumaon = () => {
    console.log("Animation INit");
    let tl = gsap.timeline({
      delay: 0.5,
      onComplete: () => {
        console.log("complete");
        if (window.innerWidth <= 767) {
          let vid = document.getElementById("kumaonVideoMobile");
          vid.play();
        } else {
          let vid = document.getElementById("kumaonVideo");
          vid.play();
        }
      },
    });
    tl.from(".kumaon-wrapper .content", {
      x: -80,
      opacity: 0,
      duration: 2,
      ease: "power4",
    })
      .from(
        "#KumaonBottle img",
        {
          x: 80,
          opacity: 0,
          duration: 2,
          ease: "power4",
        },
        0.5
      )
      .from(
        "#KumaonBottle video",
        {
          scale: 0,
          opacity: 0,
          duration: 3,
          ease: "power4",
        },
        1
      );
  };
}

(function ($) {
  "use strict";
  // Detect Firefox
  // Add class "is-firefox" to </body>
  if (isFirefox) {
    $("body").addClass("is-firefox");
  }
  // Add class "is-mobile" to </body>
  if (isMobile) {
    $("body").addClass("is-mobile");
  }

  // Page transitions
  if ($("body").hasClass("tt-transition")) {
    // Wait until the whole page is loaded.
    $(window).on("load", function () {
      setTimeout(function () {
        HideLoad(); // call out animations.
      }, 0);
    });

    // Transitions In (when "ptr-overlay" slides in).
    function RevealLoad() {
      var tl_transitIn = gsap.timeline({ defaults: { duration: 1.5, ease: Expo.easeInOut } });
      if ($("#page-transition").length) {
        tl_transitIn.set("#page-transition", { autoAlpha: 1 });
        tl_transitIn.to(".ptr-overlay", { scaleY: 1, transformOrigin: "center bottom" }, 0);
        tl_transitIn.to(".ptr-preloader", { autoAlpha: 1 }, 0.4);
      }
      tl_transitIn.to("#content-wrap", { y: -80, autoAlpha: 0 }, 0);
      tl_transitIn.to("#tt-header", { y: -20, autoAlpha: 0 }, 0);
    }

    // Transitions Out (when "ptr-overlay" slides out)
    function HideLoad() {
      const tl_transitOut = gsap.timeline();
      if ($("#page-transition").length) {
        tl_transitOut.to(".ptr-preloader", { duration: 1.5, autoAlpha: 0, ease: Expo.easeInOut });
        tl_transitOut.to(".ptr-overlay", { duration: 1.5, scaleY: 0, transformOrigin: "center top", ease: Expo.easeInOut }, 0.3);
      }
    }

    const soundBtn = select("#soundButton");
    soundBtn.addEventListener("click", enableSound);
    function enableSound() {
      isAudioEnabled = !isAudioEnabled;
      soundBtn.classList.toggle("mute");

      if (!isAudioEnabled && isAudioPlaying) {
        const audioEl = select("#audio");
        audioEl.pause();
        isAudioPlaying = false;
      }
    }

    // Force page a reload when browser "Back" button click.
    window.onpageshow = function (event) {
      if (event.persisted) {
        window.location.reload();
      }
    };

    // On link click
    $("a")
      .not('[target="_blank"]') // omit from selection
      .not('[href^="#"]') // omit from selection
      .not('[href^="mailto"]') // omit from selection
      .not('[href^="tel"]') // omit from selection
      .not(".lg-trigger") // omit from selection
      .not(".tt-btn-disabled") // omit from selection
      .not(".no-transition") // omit from selection
      .on("click", function (e) {
        e.preventDefault();
        const el = e.currentTarget.dataset.sneak;
        if ($(e.currentTarget).hasClass("label-link")) {
          window.sneakActive = true;
          $(el).addClass("full");

          if (this.href.includes("coming-soon.html")) {
            $(".coming-soon-popup").addClass("active");
            return;
          }

          setTimeout(
            function (url) {
              window.location = url;
            },
            1500,
            this.href
          );
        } else {
          setTimeout(
            function (url) {
              window.location = url;
            },
            1500,
            this.href
          );
          RevealLoad(); // call in animations.
        }
      });
  }

  $(".coming-soon-popup").on("click", function () {
    $(this).removeClass("active");
    $(".sneak_large li").removeClass("active").removeClass("full");
  });

  // Hover fix for iOS
  // ==================
  $("*")
    .on("touchstart", function () {
      $(this).trigger("hover");
    })
    .on("touchend", function () {
      $(this).trigger("hover");
    });
})(jQuery);

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  start: 0,
  end: "max",
  onUpdate: scrollEvents,
});

let scrollDirection = 1;
let scrollDirectionOld = 1;
function scrollEvents(self) {
  const headerEl = select("#header");
  scrollDirection = self.direction;
  if (scrollDirection !== scrollDirectionOld) {
    self.prevDirection = self.direction;
    // headerEl.classList.toggle("up");
    scrollDirectionOld = scrollDirection;
  }

  playSound();
}

// SOUND
let soundValue = "";
let soundOldValue = "";
let soundActive = [false, false];
let isAudioPlaying = false;

function playSound() {
  const waterAudio = select(".waterAudio");
  if (waterAudio) {
    if (ScrollTrigger.isInViewport(waterAudio)) {
      soundValue = waterAudio.dataset.audioFile;
      soundActive[0] = true;
    } else {
      soundActive[0] = false;
    }
  }

  const fireflyAudio = select(".fireflyAudio");
  if (fireflyAudio) {
    if (ScrollTrigger.isInViewport(fireflyAudio)) {
      soundValue = fireflyAudio.dataset.audioFile;
      soundActive[1] = true;
    } else {
      soundActive[1] = false;
    }
  }

  if (isAudioEnabled) {
    const audioEl = select("#audio");
    if (soundValue != soundOldValue) {
      isAudioPlaying = true;
      soundOldValue = soundValue;
      audioEl.src = "assets/sound/" + soundValue;
      audioEl.muted = false;
      audioEl.play();
    } else {
      if (!soundActive.includes(true) && isAudioPlaying) {
        audioEl.pause();
        isAudioPlaying = false;
      }
    }
  }
}

// Split type animation
const splitTypes = selectAll(".reveal-type");
if (splitTypes) {
  splitTypes.forEach((char, i) => {
    const bg = char.dataset.bgColor;
    const fg = char.dataset.fgColor;
    const text = new SplitType(char, { types: "words" });
    gsap.fromTo(
      text.words,
      {
        color: bg,
      },
      {
        color: fg,
        duration: 0.3,
        stagger: 0.02,
        scrollTrigger: {
          trigger: char,
          start: "top 80%",
          end: "top 10%",
          scrub: true,
          markers: showMarkers,
          toggleActions: "play play reverse reverse",
        },
      }
    );
  });
}

const imageAnim = selectAll(".reveal-image");
if (imageAnim) {
  imageAnim.forEach((char, i) => {
    gsap.fromTo(
      char,
      {
        y: window.innerWidth > 768 ? 75 : 30,
        ease: "power1.inOut",
        duration: 1,
      },
      {
        y: window.innerWidth > 768 ? -160 : -30,
        ease: "power1.inOut",
        duration: 1,
        scrollTrigger: {
          trigger: char,
          start: "top bottom",
          end: "top -50%",
          scrub: true,
          markers: false,
        },
      }
    );
  });
}

const stage = select(".stage");

const initHeader = () => {
  let tl = gsap.timeline({ delay: 0.5 });
  tl.from(".main-header .logo", {
    x: -40,
    opacity: 0,
    duration: 2,
    ease: "power4",
  }).from(
    ".main-header .main-nav",
    {
      x: 40,
      opacity: 0,
      duration: 2,
      ease: "power4",
    },
    0.5
  );
};

const initIntro = () => {
  // animate the intro elements into place

  let tl = gsap.timeline({ delay: 0.2 });

  tl.from(".line__inner.i1", {
    // x: 100,
    y: 400,
    ease: "power4",
    duration: 2,
  })
    .from(
      ".line__inner.i2",
      {
        y: 400,
        opacity: 0,
        ease: "power4",
        duration: 2,
      },
      0.2
    )
    .from(
      ".mountain",
      {
        // x: -50,
        y: 200,
        scale: 1.2,
        opacity: 0,
        ease: "power2",
        duration: 3,
      },
      1
    );
};

const bgColor = () => {
  $(window)
    .scroll(function () {
      // selectors
      var $body = $("body"),
        $panel = $(".section");

      // Change 33% earlier than scroll position so colour is there when you arrive.
      var scroll = window.scrollY + window.innerHeight / 1.5;

      let audio = null;
      $panel.each(function () {
        var $this = $(this);
        // if position is within range of this panel.
        // So position of (position of top of div <= scroll position) && (position of bottom of div > scroll position).
        // Remember we set the scroll to 33% earlier in scroll var.
        if ($this.position().top <= scroll && $this.position().top + $this.height() > scroll) {
          // Remove all classes on body with color-
          $body.removeClass(function (index, css) {
            console.log((css.match(/(^|\s)color-\S+/g) || []).join(" "), 1.5);
            return (css.match(/(^|\s)color-\S+/g) || []).join(" ");
          });
          // Add class of currently active div
          $body.addClass("color-" + $(this).data("color"));
        }
      });
    })
    .scroll();
};

const bottomTransition = select("#waterBottle");
if (bottomTransition && window.innerWidth >= 768) {
  const bottomTransition = gsap.timeline({
    scrollTrigger: {
      trigger: "#waterBottle",
      scrub: 1.5,
      start: "top center",
      end: "=+800",
      ease: "none",
      // pin: true,
      // pinSpacing: true,
      markers: false,
      onToggle: () => {
        $(".mountain").toggleClass("hide");
        $("#waterVideo").toggleClass("clip-add");
        $("#waterBottle").toggleClass("bottel-clip");
      },
    },
  });
}

const fireFlyEl = select("#firefly");
if (fireFlyEl) {
  const fireFly = gsap.timeline({
    scrollTrigger: {
      trigger: "#firefly",
      scrub: 1.5,
      start: "top 20%",
      end: "bottom 40%",
      ease: "none",
      markers: false,
    },
  });
  fireFly.to("#firefly", {
    duration: 2,
    scale: 1,
    borderRadius: 0,
    transformOrigin: "center",
  });
}

const grow = select("#grow");
if (grow && window.innerWidth >= 768) {
  const growTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#grow",
      scrub: 1,
      start: "top 30%",
      end: "bottom -200%",
      ease: "power1.out",
      markers: false,
      onToggle: () => {
        $("#grow").toggleClass("grow-fixed");
      },
      onLeave: () => {
        $("#grow").css("bottom", "0%");
      },
      onEnterBack: () => {
        $("#grow").css("top", "0%");
        $("#grow").css("bottom", "unset");
      },
    },
  });
  growTl.to("#grow ,.grow-img", { scale: 1 });
}

// Text Anim
const textAnim = selectAll(".textAnim");
textAnim.forEach((target, i) => {
  /*
	ScrollTrigger.create({
		trigger: target,
		markers: showMarkers,
		scrub: 1,
		start: "top center",
		end: "bottom center",
	})
	*/
  gsap.to(target, {
    backgroundPositionX: 0,
    ease: "none",
    scrollTrigger: {
      trigger: target,
      markers: showMarkers,
      scrub: 1,
      start: "top center",
      end: "bottom center",
    },
  });
});

const sneakSection = () => {
  window.sneakActive = false;

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: select("#sneakSection"),
      markers: showMarkers,
      start: "top 80%",
      end: "top 20%",
    },
  });

  tl.from(".sneakHeading", {
    opacity: 0,
    x: 100,
  }).from(".sneak_small li", {
    duration: 1,
    opacity: 0,
    y: 100,
    stagger: 0.1,
  });

  $(".sneak_small li a").hover(e => {
    const elNode = e.currentTarget.dataset.sneak;
    $(".sneak_large li").removeClass("active");
    $(elNode).addClass("active");
  });

  $(".images_section").mouseout(e => {
    if (!window.sneakActive) $(".sneak_large li").removeClass("active");
  });
};

/*
const titleAnim = () => {
	const headings = selectAll(".big-title");

	headings.forEach((heading, i) => {   

		let tl = gsap.timeline({
            scrollTrigger: {
                trigger: heading,
				start: "top center",
				markers: false
                // start: "40% 50%", // position of trigger meets the scroller position
            }
        });

		tl.from(headings, {
            ease: "power4",
            y: 400,
            duration: 2.5,
        })

	});
}
titleAnim();
*/

/*
const headings = document.querySelectorAll(".big-title")
headings.forEach((h) => {
	gsap.from(h, {
		y: 40,
		ease: "power4",
		duration: 2
	})
	gsap.to(h, {
		y: 0,
		scrollTrigger: {
			trigger: h,
			start: "50% 120%",
			end: "-=145",
			markers: true,
			scrub: true,
		},
	})
})
*/

// https://greensock.com/docs/v3/Eases
const footerPaths = [...selectAll(".footer-anim")];
footerPaths.forEach(el => {
  const svgEl = el.closest("svg");
  const pathTo = el.dataset.pathTo;

  const triggerEl = select(".main-footer");

  gsap
    .timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start: "top center",
        end: "bottom bottom",
        scrub: true,
        markers: showMarkers,
        onUpdate: updateValues,
      },
    })
    .to(el, {
      y: 0,
      ease: "none",
      duration: 1,
      // attr: { d: pathTo },
    });
});

function updateValues() {
  if (select("#x")) select("#x").innerText = ScrollTrigger.isInViewport(select(".main-footer"));
}

/*
const footerText = 
footerText.forEach((h) => {
	gsap.to(h, {
		transform: "matrix(1, 0, 0, 1, 0, 0)",
		ease: "power4",
		duration: 2,
		scrollTrigger: {
			trigger: h,
			start: "-=200",
			end: "bottom bottom",
			scrub: true,
			markers: showMarkers,
		},
	})
	
	/*
	gsap.from(h, {
		y: 0,
		transformOrigin:'center',
		transform: 'matrix(1, 0, 0, 1, 0, 0)',
		scrollTrigger: {
			trigger: h,
			start: "-=200",
			end: "bottom bottom",
			scrub: true,
			markers: false,
		},
	})
})

*/
/**
 * Rotating Circle
 */

// const roatatingCircle = () => {
//   // const currentRotation = gsap.to(".fixedImage", { rotation: 1440, duration: 360 })
//   const fixedImage = select(".fixedImage");
//   if (fixedImage) {
//     gsap.to(".fixedImage", {
//       scrollTrigger: {
//         trigger: select("body"),
//         scrub: 1,
//         start: "top center",
//         end: "bottom center",
//         markers: showMarkers,
//       },
//       rotation: 1440,
//       duration: 3,
//       ease: "none",
//     });
//   }
// };

const elementsVisibility = () => {
  // Top right circle
  const mb = select("#secoundBlock");
  if (mb) {
    const elOffetForTitle = mb.offsetTop - window.innerHeight;
    if (window.innerWidth >= 767 && window.scrollY >= 500) {
      select(".intro-title").classList.add("hidden");
    } else if (window.innerWidth <= 767 && window.scrollY >= 100) {
      select(".intro-title").classList.add("hidden");
    } else {
      select(".intro-title").classList.remove("hidden");
    }
  }

  // First section fixed title
  const ub = select("#unordinary");
  if (ub) {
    const elOffet = ub.offsetTop;
    // if (window.scrollY >= elOffet) {
    //   select(".fixedImage").classList.add("visible");
    // } else {
    //   select(".fixedImage").classList.remove("visible");
    // }
  }
  const s1 = selectAll(".audioContainerTrigger");
};

const paths = [...selectAll("path.path-anim")];
paths.forEach(el => {
  const svgEl = el.closest("svg");
  const pathTo = el.dataset.pathTo;

  gsap
    .timeline({
      scrollTrigger: {
        trigger: svgEl,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })
    .to(el, {
      ease: "none",
      attr: { d: pathTo },
    });
});

const circleExpand = () => {
  const ce = gsap.timeline({
    scrollTrigger: {
      // markers: true,
      trigger: ".circle-anim",
      scrub: 0.1,
      start: "top bottom",
      // end: "+=400",
      ease: "power1.out",
    },
  });
  ce.from(".outline-anim", {
    opacity: 0,
    onComplete: function () {
      $(".outline-anim").addClass("active");
    },
  })
    .from(
      ".circle-anim",
      {
        opacity: 0,
      },
      "+=0.5"
    )
    .from(".circle-block", {
      width: "160px",
      height: "160px",
      top: "400px",
      left: "170px",
      opacity: 0,
      stagger: { amount: 1 },
    });
};

/*
function playPauseAudioBasedOnSection() {
  let audioSections = selectAll("audioTrigger");
  audioSections.forEach((video) => {
    
      // We can only control playback without insteraction if video is mute
      video.muted = true;
      // Play is a promise so we need to check we have it
      let playPromise = video.play();
      if (playPromise !== undefined) {
          playPromise.then((_) => {
              let observer = new IntersectionObserver(
                  (entries) => {
                      entries.forEach((entry) => {
                          if (
                              entry.intersectionRatio !== 1 &&
                              !video.paused
                          ) {
                              video.pause();
                          } else if (video.paused) {
                              video.play();
                          }
                      });
                  },
                  { threshold: 0.2 }
              );
              observer.observe(video);
          });
      }
  });
}
*/

const init = () => {
  gsap.set(stage, { autoAlpha: 1 });
  initHeader();
  initIntro();
  bgColor();
  // roatatingCircle();
  if (select("#magnifierImg")) {
    // magnify("magnifierImg", 1)
  }

  if (select("#sneakSection")) {
    sneakSection();
  }
  /*
	initLinks();
	initSlides();
	initParallax();
    initKeys();
	*/
  circleExpand();

  // And you would kick this off where appropriate with:
  // playPauseAudioBasedOnSection();

  if (select(".page-kumaon") && document.getElementById("kumaonVideo")) {
    kumaon();
  }
};

const logoEl = select("#headerLogo");

window.onscroll = () => {
  elementsVisibility();

  // Header Logo Change on scroll
  if (logoEl) {
    if ($(window).scrollTop() >= 105) {
      logoEl.src = "assets/img/logo-mini.png";
    } else {
      logoEl.src = "assets/img/logo.svg";
    }
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: scrollEvents,
  });
};

// Throttling Function
const throttleFunction = (func, delay) => {
  // Previously called time of the function
  let prev = 0;
  return (...args) => {
    // Current called time of the function
    let now = new Date().getTime();

    // Logging the difference between previously
    // called and current called timings

    // If difference is greater than delay call
    // the function again.
    if (now - prev > delay) {
      prev = now;

      // "..." is the spread operator here
      // returning the function with the
      // array of arguments
      return func(...args);
    }
  };
};

const wait = n => new Promise(resolve => setTimeout(resolve, n));

function nextFocus(input) {
  console.log(input.value.length);
  if ((input.id == "ageDate" && input.value.length >= 2) || (input.id == "ageMonth" && input.value.length >= 2)) {
    $(`#${input.id}`).next().next().focus();
  } else {
    $(`#ageButton`).click();
  }
}

const ageChecker = {
  age: -1,
  checkAge: e => {
    e.preventDefault();
    const currentTime = new Date();
    const currentYear = currentTime.getFullYear();

    const errorPlaceholder = select("#ageError");
    errorPlaceholder.innerHTML = "";

    const day = select("#ageDate").value || 0;
    if (day < 1 && day >= 31) {
      errorPlaceholder.innerHTML = "Enter valid Date";
      return;
    }

    const month = select("#ageMonth").value || 0;
    if (month < 1 || month > 15) {
      errorPlaceholder.innerHTML = "Enter valid Month";
      return;
    }

    const year = select("#ageYear").value || 0;
    if (year <= 1900 || year >= currentYear) {
      errorPlaceholder.innerHTML = "Enter valid Year";
      return;
    }

    const age = currentYear - year;
    const status = ageChecker.checkAgeValidity(age);
    isAudioEnabled = true;
    select("#soundButton").classList.toggle("mute");
    if (status && gtag) {
      gtag("event", "AGE TRACKING", { age: age, DOB: `${day}/${month}/${year}}` });
    }

    return false;
  },
  checkAgeValidity: age => {
    if (age >= 25) {
      localStorage.setItem("AGE", age);
      // ageChecker.hideAgeForm()
      ageChecker.showNextModal();
      init();
      return true;
    } else {
      const errorPlaceholder = select("#ageError");
      errorPlaceholder.innerHTML = "Not a valid age";
      return false;
    }
  },
  showNextModal: async () => {
    select(".showAgeForm").classList.remove("active");
    select(".showAgeMsg").classList.add("active");
    await wait(4000);
    select("body").classList.remove("hm-age");
    select("#modalAgePopup").classList.add("goUp");
    await wait(4000);
    select("#modalAgePopup").classList.remove("goUp");
    select("#modalAgePopup").classList.remove("active");
  },
  showAgeForm: () => {
    select("body").classList.add("hm-age");
    select("#modalAgePopup").classList.add("active");
  },
  hideAgeForm: () => {
    select("body").classList.remove("hm-age");
    select("#modalAgePopup").classList.remove("active");
  },
  init: () => {
    const age = parseInt(localStorage.getItem("AGE"));
    if (isNaN(age) || age === -1) {
      ageChecker.showAgeForm();
      select("#modalAgePopup").classList.remove("d-none");
    } else {
      ageChecker.checkAgeValidity(age);
    }
  },
};

const ageForm = select("#ageForm");
if (ageForm) {
  ageChecker.init();
  ageForm.addEventListener("submit", ageChecker.checkAge);
}
let ageNow = parseInt(localStorage.getItem("AGE"));
setTimeout(() => {
  if (ageNow >= 25) {
    select(".modal-age-popup").style.display = "none";
  }
}, 7000);

// Item link hover
// ================
$(".portfolio-interactive-item").each(function () {
  var $piItem = $(this);
  $piItem
    .find(".pi-item-title-link")
    .on("mouseenter", function () {
      // hover title
      $(this).parents(".portfolio-interactive").addClass("hovered");
      $(this).parent().addClass("pi-item-hover");

      // hover video
      var $piItemVideo = $(this).parents("body").find(".pi-item-image video");
      if ($piItemVideo.length) {
        $piItemVideo.get(0).play();
      }
    })
    .on("mouseleave", function () {
      // hover title
      $(this).parents(".portfolio-interactive").removeClass("hovered");
      $(this).parent().removeClass("pi-item-hover");

      // hover video
      var $piItemVideo = $(this).parents("body").find(".pi-item-image video");
      if ($piItemVideo.length) {
        $piItemVideo.get(0).pause();
      }
    });
});

const debounce = (func, delay) => {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

let throttleTimer;
const throttle = (callback, time) => {
  if (throttleTimer) return;
  throttleTimer = true;
  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
};

let imgAdded = false;

function appearImage(e) {
  if (imgAdded) {
    return;
  }
  imgAdded = true;

  setTimeout(function () {
    imgAdded = false;
  }, 400);

  const rndInt = Math.floor(Math.random() * 6) + 1;
  const rndId = Math.floor(Math.random() * 14) + 1;
  $(`.interactive-img #int_img_${rndId}`).addClass(`active index_${rndInt} pos_${rndInt}`);

  $(`.interactive-img #int_img_${rndId}`)
    .css({ left: +e.clientX - 100 + "px", top: e.clientY - 100 + "px" })
    .addClass(`active pos_${rndInt}`);
  setTimeout(function () {
    $(`.interactive-img #int_img_${rndId}`).removeAttr("class");
    $(`.interactive-img #int_img_${rndId}`).attr("class", "");
  }, 1000);
}

$(".imageAppear").on(
  "mousemove",
  debounce(function (e) {
    appearImage(e);
  }, 0)
);

const distalarySection = select(".distalarySection");
if (distalarySection) {
  const ce = gsap.timeline({
    scrollTrigger: {
      trigger: distalarySection,
      scrub: 1.5,
      start: "top center",
      end: window.innerWidth >= 768 ? "bottom bottom" : "bottom center",
      markers: false,
      onToggle: () => {
        $("#waterBottle").toggleClass("d-none");
      },
    },
  });
  ce.to(distalarySection, {
    opacity: 1,
    onComplete: function () {
      distalarySection.classList.add("active");
    },
  });
  const popup = gsap.timeline({
    scrollTrigger: {
      trigger: "#unordinary",
      scrub: 1.5,
      start: "top center",
      end: "bottom center",
      //   markers: true,
      onToggle: () => {
        let obj = { clientX: 500, clientY: 200 };
        appearImage(obj);
      },
    },
  });
}

if (window.innerWidth <= 767) {
  const mainVid = select("#main-video");
  if (mainVid) {
    mainVid.src = "https://ronaktwo.s3.ap-south-1.amazonaws.com/Himmaleh_0a.mp4";
  }
}
