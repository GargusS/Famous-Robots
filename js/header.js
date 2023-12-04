function createMenuItem(name, href) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.setAttribute("href", href);
  a.appendChild(document.createTextNode(name));
  li.appendChild(a);
  return li;
}

const headerContainer = document.getElementById("header");

const menuItems = [
  { name: "Home", href: "../index.html" },
  { name: "About", href: "../html/about.html" },
  { name: "Blogs", href: "../html/blog.html" },
  { name: "Contact", href: "../html/contact.html" },
];

const ul = document.createElement("ul");
menuItems.forEach((item) => {
  const menuItem = createMenuItem(item.name, item.href);
  ul.appendChild(menuItem);
});

headerContainer.appendChild(ul);

const menuBtn = document.querySelector(".menu-btn");
const sidebar = document.querySelector(".sidebar");
let menuOpen = false;

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open", !menuOpen);
  sidebar.classList.toggle("open", !menuOpen);
  menuOpen = !menuOpen;
});
