
let openMenu = document.querySelector('#open');
let closeMenu = document.querySelector('#close');
let sideNav = document.querySelector('.side-nav');
openMenu.addEventListener('click',e=>{
    e.preventDefault();
    openMenu.style.display = "none";
    closeMenu.style.display = "flex";
    sideNav.style.display = "flex";
});

closeMenu.addEventListener('click',e=>{
    e.preventDefault();
    closeMenu.style.display = "none";
    openMenu.style.display = "flex";
    sideNav.style.display = "none";
});