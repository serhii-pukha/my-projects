window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.getElementById("header").classList.add("header--light");
  } else {
    document.getElementById("header").classList.remove("header--light");
  }
}

function toggleMenu() {
    var x = document.getElementById("nav");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
}