let headerMenuButton = document.getElementById('header-menu-button');
let headerMenu = document.getElementById('header-menu');

headerMenuButton.onclick = function () {
  headerMenu.classList.toggle('opened');
};