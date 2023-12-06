const loader = document.querySelector(".loader");
const cardContainer = document.getElementById("card-container");
const loadMoreButton = document.getElementById("load-more");
const cardCountElem = document.getElementById("card-count");
const cardTotalElem = document.getElementById("card-total");

const cardLimit = 16;
const cardIncrease = 10;
const pageCount = Math.ceil(cardLimit / cardIncrease);
let currentPage = 1;

cardTotalElem.innerHTML = cardLimit;

const handleButtonStatus = () => {
  if (pageCount === currentPage) {
    loadMoreButton.classList.add("disabled");
    loadMoreButton.setAttribute("disabled", true);
  }
};

const createCard = (blogData) => {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.setAttribute("src", blogData.jetpack_featured_media_url);
  img.setAttribute("alt", blogData.altText || "Default Alt Text");
  img.className = "card-image";

  const title = document.createElement("h2");
  title.innerHTML = blogData.title.rendered;

  const excerpt = document.createElement("p");
  excerpt.innerHTML = blogData.excerpt.rendered;

  // Add onclick event to open details.html
  card.onclick = function () {
    window.location.href = `details.html?id=${blogData.id}`;
  };

  card.appendChild(title);
  card.appendChild(img);
  card.appendChild(excerpt);

  cardContainer.appendChild(card);
};

const addCards = (pageIndex) => {
  currentPage = pageIndex;

  handleButtonStatus();

  const startRange = (pageIndex - 1) * cardIncrease;
  const endRange = pageIndex * cardIncrease > cardLimit ? cardLimit : pageIndex * cardIncrease;

  cardCountElem.innerHTML = endRange;

  // Show loader here
  loader.classList.remove("hidden");

  // Fetch and display blogs
  fetchBlogs(startRange, endRange);
};

const fetchBlogs = async (startIndex, endIndex) => {
  const blogUrl = "https://cms.sonnesyn.no/wp-json/wp/v2/posts?per_page=50";
  try {
    const response = await fetch(blogUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    displayBlogs(data.slice(startIndex, endIndex));
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
};

const displayBlogs = (blogs) => {
  blogs.forEach((blog) => {
    createCard(blog);
  });

  // Hide loader after displaying blogs
  loader.classList.add("hidden");
};

window.onload = function () {
  addCards(currentPage);
  loadMoreButton.addEventListener("click", () => {
    addCards(currentPage + 1);
  });
};
