
const accordainDiv = document.querySelector("#accordian");
magazines = [
  "https://flipboard.com/@thenewsdesk/the-latest-on-coronavirus-covid-19-t82no8kmz.rss",
  "https://flipboard.com/@dfletcher/india-tech-b2meqpd6z.rss",
  "https://flipboard.com/@thehindu/sportstarlive-rj3ttinvz.rss"
]

accordainDiv.innerHTML=`
<div class="accordion" id="accordionExample">
  ${magazines
    .map(
      (rssUrl, index) => `
    <div class="accordion-item border-0">
      <h2 class="accordion-header p-2">
        <button class="accordion-button bg-transparent ${
          index === 0 ? "" : "collapsed"
        }" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="${
        index === 0 ? "true" : "false"
      }" aria-controls="collapse${index}">
          ${index === 0 ? "Politics" : index === 1 ? "Space" : "Sports"}
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



// fetch("https://api.rss2json.com/v1/api.json?rss_url=https://flipboard.com/@thenewsdesk/the-latest-on-coronavirus-covid-19-t82no8kmz.rss")
//     .then(response => response.json())
//     .then(data => {
//         console.log(data.items);
//         // You can perform further operations with the fetched data here
//     })
//     .catch(error => {
//         console.error("An error occurred:", error);
//     });

// const cards = document.createElement('div');
// cards.innerHTML=`
// <div class="card" style="width: 18rem;">
//   <img src="${item.enclosure.link}" class="card-img-top" alt="News Image">
//   <div class="card-body">
//     <h5 class="card-title">${item.title}</h5>
//     <p class="card-text">${item.description}</p>
//     <a href="#" class="btn btn-primary">Go somewhere</a>
//   </div>
// </div>`

magazines.forEach((rssUrl, index) => {
  const carouselInner = accordainDiv.querySelector(`#carousel-${index} .carousel-inner`);

  fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`)
    .then(response => response.json())
    .then(data => {
      data.items.forEach((item, itemIndex) => {
        const activeClass = itemIndex === 0 ? "active" : "";
        carouselInner.innerHTML += `
          <div class="carousel-item ${activeClass}">
            <img src="${item.enclosure.link}" class="card-img-top" alt="News Image">
            <div class="card-body">
            <a href="${item.link}">
              <h5 class="card-title m-3 font-weight-bold">${item.title}</h5>
            </a>
              <p class="card-text m-3">${item.description}</p>
          </div>
        `;
      });
    })
    .catch(error => {
      console.error("An error occurred:", error);
    });
});