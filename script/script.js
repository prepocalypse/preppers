/**************************  TEXT REVEAL  **************************/

function startAnimation(t) {
  sects[t].classList.remove("active");
  sects[t].classList.add("old");
  setTimeout(function () {
    sects[t + 1].classList.remove("invisible");
    sects[t + 1].classList.add("active");
  }, 1000);
}

async function scroll(e) {
  e.preventDefault();
  scrolled += e.deltaY;
  console.log(scrolled);
  if (scrolled > 2000) {
    scrolled = 0;
    for (i = 0; i < sects.length; i++) {
      console.log(sects[i].classList);
      if (sects[i].classList.contains("active")) {
        revealed = i;
        if (i == sects.length - 1) {
          document.querySelector(".bottom").style.opacity = "0";
        }
      }
    }
    if (revealed < sects.length - 1) {
      setTimeout(await startAnimation(revealed), 500);
    }
  }
}

let scrolled = 0;
let revealed = 0;
const el = document.querySelector(".text-wrapper");
const sects = document.querySelectorAll("section");

el.onwheel = scroll;

/****************************************************/

/**************************  ABOUT  **************************/

const about = document.getElementById("about");
const aboutPage = document.getElementById("aboutPage");
let showAbout = false;

about.addEventListener("click", function () {
  if (showAbout) {
    aboutPage.classList.add("hide");
    showAbout = false;
  } else {
    aboutPage.classList.remove("hide");
    showAbout = true;
  }
});
