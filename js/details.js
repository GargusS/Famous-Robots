const loader = document.querySelector(".loader");
const cardContainer = document.getElementById("details");
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");
const url = "https://cms.sonnesyn.no/wp-json/wp/v2/posts/" + id;

fetchDetails();

async function fetchDetails() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("4-oh-4, Oops something went wrong here");
    }

    const info = await response.json();
    createCard(info);
  } catch (err) {
    handleFetchError(err);
  }
}

function createCard(info) {
  const card = document.createElement("div");
  card.className = "card";

  const img = createImage(info);
  const title = createTitle(info);
  const content = createContent(info);

  card.onclick = function () {
    window.location.href = `details.html?id=${info.id}`;
  };

  card.appendChild(title);
  card.appendChild(img);
  card.appendChild(content);

  document.title = `${title.innerHTML}`;

  cardContainer.appendChild(card);
}

function createImage(info) {
  const img = document.createElement("img");
  img.setAttribute("src", info.jetpack_featured_media_url);
  img.setAttribute("alt", info.altText || "Default Alt Text");
  img.className = "card-image";

  img.addEventListener("load", handleImageLoad);

  return img;
}

function createTitle(info) {
  const title = document.createElement("h2");
  title.innerHTML = info.title.rendered;
  return title;
}

function createContent(info) {
  const content = document.createElement("p");
  content.innerHTML = info.content.rendered;
  return content;
}

function handleImageLoad() {
  const imagesToLoad = cardContainer.querySelectorAll("img");
  const imagesLoaded = Array.from(imagesToLoad).filter((img) => img.complete).length;

  if (imagesLoaded === imagesToLoad.length) {
    loader.classList.add("hidden");
  }
}

function handleFetchError(err) {
  const errorContainer = document.querySelectorAll("details");
  errorContainer.innerHTML = `<h2>${err.message}</h2>`;
}

function goBack() {
  window.history.back();
}
