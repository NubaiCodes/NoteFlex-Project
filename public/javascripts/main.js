$(document).ready(function () {

    window.addEventListener('scroll', reveal);

    function reveal() {
        var reveals = document.querySelectorAll('.reveal');

        for (var i = 0; i < reveals.length; i++) {

            var windowheight = window.innerHeight;
            var revealtop = reveals[i].getBoundingClientRect().top;
            var revealpoint = 150;

            if (revealtop < windowheight - revealpoint) {
                reveals[i].classList.add('active');
            }
            else {
                reveals[i].classList.remove('active');
            }
        }
    }

    document.getElementById("new").addEventListener("keyup", passequal);
    document.getElementById("confirm").addEventListener("keyup", passequal);

    function passequal() {
        var text1 = document.getElementById("new");
        var text2 = document.getElementById("confirm");
        if (text1.value == text2.value)
            text2.style.borderColor = "#2EFE2E";
        else
            text2.style.borderColor = "red";
    }
});