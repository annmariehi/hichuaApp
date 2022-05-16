// Citation for following function:
// Date: 05/16/2022
// Copied from:
// Source URL: https://www.w3schools.com/howto/howto_js_tabs.asp
function openForm(evt, formType) {
    var i, tabContent, tablinks;

    tabContent = document.getElementsByClassName("tabContent");
    for(i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(formType).style.display = "block";
    evt.currentTarget.className += " active";
}

