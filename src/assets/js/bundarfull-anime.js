// import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const scene = new THREE.Scene();
// const desktopCamera = new THREE.PerspectiveCamera(13, window.innerWidth / window.innerHeight, 0.1, 1e3);
// const mobileCamera = new THREE.PerspectiveCamera(25, 0.5, 1, 1000);
// const camera = window.innerWidth >= 768 ? desktopCamera : mobileCamera;

// let object;
// const loader = new GLTFLoader();

// loader.load("assets/3d/bandarfull.glb", function (e) {
//   object = e.scene;
//   object.scale.set(50, 50, 50);
//   scene.add(object);

//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.castShadow = true;
//     }
//   });
// });

// const renderer = new THREE.WebGLRenderer({
//   alpha: true,
//   logarithmicDepthBuffer: true,
// });

// renderer.shadowMap.enabled = true;
// renderer.setSize(window.innerWidth, 800);

// document.getElementById("container3D").appendChild(renderer.domElement);

// camera.position.z = 1100;
// camera.position.y = 0;
// camera.position.x = 0;
// camera.focus = 12;
// camera.fov = 0;
// camera.near = 20;
// camera.scale.z = 1.7;
// camera.scale.y = 1.1;

// const direction = new THREE.DirectionalLight(0xffffff, 0.4);
// direction.position.set(5, 5, 5);
// direction.castShadow = true;
// scene.add(direction);

// const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
// scene.add(ambientLight);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.25;
// controls.screenSpacePanning = false;
// controls.enabled = false;
// controls.enableZoom = false;

// function animate() {
//   requestAnimationFrame(animate);

//   if (object) {
//     object.rotation.y += 0.005;
//     object.position.y = -150;
//   }

//   controls.update();
//   renderer.render(scene, camera);
// }

// if (window.innerWidth >= 768) {
//   window.addEventListener("resize", function () {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   });
// }

// animate();

// document.onmousemove = function (e) {
//   const centerX = window.innerWidth * 0.9;
//   const centerY = window.innerHeight * 1.2;

//   scene.rotation.x = (((e.clientY - centerY) / centerY) * centerY) / 2000;
//   scene.rotation.z = (((e.clientX - centerX) / centerX) * centerX) / centerX;
// };

const tl1 = gsap.timeline({
  scrollTrigger: {
    trigger: ".animation-section",
    start: "top 25%",
    end: window.innerWidth >= 768 ? "+=7000px" : "+=2400px",
    scrub: 1,
    markers: false,
    onToggle: () => {
      $("#container3D img").toggleClass("position-fixed");
      $(".main-header").toggleClass("d-none");
    },
  },
});

tl1.to(".scroll-image", { xPercent: -200, x: "100%" });

const stickyDots = document.querySelectorAll(".sticky-dots-animation");

stickyDots.forEach((ele, i) => {
  const dotAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: ele,
      start: "top center",
      end: "bottom center",
      scrub: 1,
      markers: false,
    },
  });

  dotAnimation.to(`.${ele.classList[2]} .sticky-dots-left`, { y: 100 });
  dotAnimation.to(`.${ele.classList[2]} .sticky-dots-right`, { y: -100 });
});

const farmToBottle = gsap.timeline({
  scrollTrigger: {
    trigger: ".content",
    start: "top 25%",
    end: "bottom center",
    scrub: 1,
    markers: false,
  },
});

farmToBottle.to(".circle-bottle ", { rotate: 200 });

if (window.innerWidth >= 768) {
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".section--3",
      start: "top center",
      end: "bottom bottom",
      scrub: 1,
      markers: false,
      onToggle: () => {
        $("#container3D img").toggleClass("go-left");
        $("#container3D img").removeClass("d-fixed");
      },
      onLeave: () => {
        $("#container3D img").addClass("d-fixed");
      },
    },
  });
}

$(".flip-box").tilt({
  maxTilt: 25,
  perspective: 4000,
  easing: "cubic-bezier(.03,.98,.52,.99)",
  speed: 1200,
  glare: true,
  reverse: true,
  reset: true,
  scale: 1,
  "reset-to-start": true,
  gyroscope: true,
});
