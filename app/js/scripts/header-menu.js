let headerMenuToggle = document.getElementById('header-menu-toggle');
let headerMenu = document.getElementById('header-menu');

headerMenuToggle.onclick = async function () {
  headerMenu.classList.toggle('header-menu--opened');
};