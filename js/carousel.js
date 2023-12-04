if (document.getElementById("carousel")) {
  async function fetchData() {
    try {
      const apiUrl = "https://cms.sonnesyn.no/wp-json/wp/v2/posts?per_page=50";
      const resp = await fetch(apiUrl);
      if (!resp.ok) {
        throw new Error("4-oh-4, Oops something went wrong here");
      }

      const dataArray = await resp.json();

      const postsContainer = document.getElementById("dataArray");
      const loader = document.querySelector(".loader");

      // Iterate through each object in the dataArray
      dataArray.forEach(async (item) => {
        // Access wp:featuredmedia array
        const featuredMediaArray = item._links["wp:featuredmedia"];

        // Iterate through wp:featuredmedia array
        for (const media of featuredMediaArray) {
          await fetchDataFromMediaURL(media.href, item);
        }
      });

      async function fetchDataFromMediaURL(url, post) {
        try {
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`Failed to fetch media data. Status: ${response.status}`);
          }

          const mediaData = await response.json();
          // Extract alt_text from mediaData
          const altText = mediaData.alt_text || "Picture of a robot from the article";

          // Call createPostContainer with altText
          createPostContainer(post, "post-container", altText);
        } catch (error) {
          console.error("Error fetching media data:", error.message);
        }
      }

      // Function to create a post container
      function createPostContainer(post, className, altText) {
        const { title, jetpack_featured_media_url, excerpt } = post;
        const postContainer = document.createElement("div");
        postContainer.className = className;

        const h2 = document.createElement("h2");
        h2.innerHTML = title.rendered;
        const img = document.createElement("img");
        img.setAttribute("src", jetpack_featured_media_url);
        img.setAttribute("alt", altText);

        const postExcerpt = document.createElement("div");
        postExcerpt.innerHTML = excerpt.rendered;

        // Add onclick event to open details.html
        postContainer.onclick = function () {
          window.location.href = `html/details.html?id=${post.id}`;
        };

        postContainer.append(h2, img, postExcerpt);

        return postContainer;
      }

      dataArray.forEach((post) => {
        const postContainer = createPostContainer(post, "blog-item");
        postsContainer.appendChild(postContainer);
      });

      const imagesToLoad = postsContainer.querySelectorAll("img");
      let imagesLoaded = 0;
      const totalImages = imagesToLoad.length;

      imagesToLoad.forEach((img) => {
        img.addEventListener("load", () => {
          imagesLoaded++;

          if (imagesLoaded === totalImages) {
            loader.classList.add("hidden");

            const width = window.innerWidth;

            if (width <= 600) {
              // Clear out the container before appending new items
              postsContainer.innerHTML = "";
              dataArray.forEach((post) => {
                const mobileItemContainer = createPostContainer(post, "mobile-item");
                postsContainer.appendChild(mobileItemContainer);
              });
            } else {
              // Call the function if the screen size is over 600px
              initializeSlider();
            }
          }
        });
      });
    } catch (err) {
      const error = document.getElementById("main");
      error.innerText = err;
    }
  }

  // Wrap the subsequent code in a function to call after data is loaded
  function initializeSlider() {
    const blogItems = Array.from(document.querySelectorAll(".blog-item"));

    let currentSlide = 0;
    let itemsToShow;

    // Function to update itemsToShow based on screen width
    function updateItemsToShow() {
      if (window.innerWidth < 800) {
        itemsToShow = 1; // Show 1 slide for screens below 960px
      } else if (window.innerWidth < 1120) {
        itemsToShow = 2; // Show 2 slides for screens between 960px and 1119px
      } else if (window.innerWidth < 1440) {
        itemsToShow = 3; // Show 3 slides for screens between 1120px and 1439px
      } else {
        itemsToShow = 4; // Show 4 slides for screens 1440px and above
      }

      // Call function to update the slider here
      showPost();
    }

    // Initial calculation
    updateItemsToShow();

    // Event listener for window resize
    window.addEventListener("resize", updateItemsToShow);

    const sliderNav = document.getElementById("dataArray");
    const navLeft = document.createElement("div");
    const navRight = document.createElement("div");

    sliderNav.prepend(navLeft);
    navLeft.className = "nav nav-left";

    sliderNav.append(navRight);
    navRight.className = "nav nav-right";

    const iconLeft = document.createElement("img");
    iconLeft.src = "../assets/arrow-left.png";

    const iconRight = document.createElement("img");
    iconRight.src = "../assets/arrow-right.png";

    document.getElementsByClassName("nav-left")[0].appendChild(iconLeft);
    iconLeft.className = "carousel-arrow-icon-left";

    document.getElementsByClassName("nav-right")[0].appendChild(iconRight);
    iconRight.className = "carousel-arrow-icon-right";

    function showPost() {
      const startIndex = currentSlide * itemsToShow;
      const endIndex = startIndex + itemsToShow;

      blogItems.forEach((post, index) => {
        if (index >= startIndex && index < endIndex) {
          post.style.display = "block";
          post.classList.add("active");
        } else {
          post.style.display = "none";
          post.classList.remove("active");
        }
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % Math.ceil(blogItems.length / itemsToShow);
      showPost();
    }

    function prevSlide() {
      currentSlide =
        (currentSlide - 1 + Math.ceil(blogItems.length / itemsToShow)) %
        Math.ceil(blogItems.length / itemsToShow);
      showPost();
    }

    document.querySelector(".nav-left").addEventListener("click", prevSlide);
    document.querySelector(".nav-right").addEventListener("click", nextSlide);

    showPost();
  }

  // Call the fetchData function to start the process
  fetchData();
}
