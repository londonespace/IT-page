let headerMenuButton = document.getElementById('header-menu-button');
let headerMenu = document.getElementById('header-menu');

headerMenuButton.onclick = async function () {
  headerMenu.classList.toggle('opened');
};