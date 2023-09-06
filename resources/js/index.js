//created array to hold fetched data from rss urls
const fetchedDataArray = [];

//Asynchronous function to fetch data from rss urls
async function fetchData(rssUrl) {
  try {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}


//Asynchronous function to fetch data and render the accordion
async function fetchAllData() {
  // create an array of promises ,each representing a fetch operation
  const promises = magazines.map(async (rssUrl) => {
    const data = await fetchData(rssUrl);
    fetchedDataArray.push(data);
  });
  //wait for all promises to resolve using promise.all
  await Promise.all(promises);
  //calling the rendering function
  renderAccordion();
}

//start fetching data and rendering the accordion
fetchAllData();

//function to render the accordion with fetched data
function renderAccordion() {
  const accordainDiv = document.querySelector("#accordian");

  accordainDiv.innerHTML = `
    <div class="accordion" id="accordionExample">
      ${fetchedDataArray
        .map(
          (data, index) => `
            <div class="accordion-item border-0">
              <h2 class="accordion-header p-2">
                <button class="accordion-button bg-transparent ${
                  index === 0 ? "" : "collapsed"
                }" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="${
                  index === 0 ? "true" : "false"
                }" aria-controls="collapse${index}">
                  ${data.feed.title}
                </button>
              </h2>
              <div id="collapse${index}" class="accordion-collapse collapse ${
            index === 0 ? "show" : ""
          }" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  <div id="carousel-${index}" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner"></div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${index}" data-bs-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carousel-${index}" data-bs-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `
        )
        .join("")}
    </div>`;
    
  //populate the carousel with items from fetched data
  fetchedDataArray.forEach((data, index) => {
    const carouselInner = accordainDiv.querySelector(`#carousel-${index} .carousel-inner`);
    data.items.forEach((item, itemIndex) => {
      const activeClass = itemIndex === 0 ? "active" : "";
      carouselInner.innerHTML += `
        <div class="carousel-item ${activeClass}">
          <img src="${item.enclosure.link}" class="card-img-top">
          <div class="card-body">
              <h5 class="card-title m-3 font-weight-bold">${item.title}</h5>
              <div class="d-flex justify-content-between align-items-center">
              <div class="m-3 col">
                <p class="fw-lighter">${item.author} . ${new Date(item.pubDate).toLocaleDateString("en-IN")}</p>
              </div>
              <div class="mb-3 col"><a href="${item.link}"><button style="color:#4072c2;">More!</button></a></div>
              </div>
              <p class="card-text m-3">${item.description}</p>
          </div>
        </div>`;
    });
  });
}