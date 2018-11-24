const apiKey = 'AIzaSyDqU8w6b95qpEPrB2Fx5jj0IJ6gdMIhV0A';
const results = [];
/* Class that keeps information about video */
class Video {
  constructor(id, thumbnail, title, description, author, publicationDate, viewRate) {
    [this._id, this._thumbnail, this._title, this._description, this._author, this._publicationDate, this._viewRate] =
    [id, thumbnail, title, description, author, publicationDate, viewRate];
  }

  set id(value) {
    this._id = value;
  }

  get id() {
    return this._id;
  }

  set thumbnail(value) {
    this._thumbnail = value;
  }

  get thumbnail() {
    return this._thumbnail;
  }

  set title(value) {
    this._title = value.replace(/\u00a0/g, " "); /* Replace npsp with regular spaces */
  }

  get title() {
    return this._title;
  }

  set description(value) {
    this._description = value.slice(0, 120).concat('...');
  }

  get description() {
    return this._description;
  }

  set author(value) {
    this._author = value;
  }

  get author() {
    return this._author;
  }

  set publicationDate(value) {
    this._publicationDate = new Date(value);
  }

  get publicationDate() {
    return this._publicationDate.toLocaleDateString("ru-RU");
  }

  set viewRate(value) {
    this._viewRate = value.replace(/(.)(?=(\d{3})+$)/g,'$1,'); /* Make format for decimals */
  }

  get viewRate() {
    return this._viewRate;
  }
};

/* Container for all elements */
const container = document.createElement('div');
container.classList.add('container');

/* Div with question */
const question = document.createElement('div');
question.classList.add('question');
question.textContent = 'What do you want to find on Youtube?';

/* Div for search bar */
const searchBox = document.createElement('div');
searchBox.classList.add('search-box');
searchBox.dataset.minimized = 'true';

/* Input for text in search bar */
const searchText = document.createElement('input');
searchText.classList.add('search-text');
searchText.type = 'search';
searchText.placeholder = 'Type to search';
searchText.maxLength = '50';

/* Functions to narrow search bar when hovered */
const minimize = () => {
  searchBox.dataset.minimized = 'true';
};

/* Functions to expand search bar when hovered */
const maximize = () => {
  searchBox.dataset.minimized = 'false';
};

searchBox.addEventListener('mouseover', maximize);

searchBox.addEventListener('mouseout', minimize);

/* Image that functions as a search button */
const searchBtn = document.createElement('img');
searchBtn.classList.add('search-btn');
searchBtn.src = './img/search.svg';

/* Div with video cards */
const resultsWrapper = document.createElement('div');
resultsWrapper.classList.add('results-wrapper');

/* Div with page switches */
const sliderWrapper = document.createElement('div');
sliderWrapper.classList.add('slider-wrapper');

/* Function to make more video cards visible on screen expand */
const expand = (width) => {
  let elements = resultsWrapper.childNodes;

  if (width > 1200) {
    elements[3].dataset.hidden = 'false';
  }

  if (width > 900) {
    elements[2].dataset.hidden = 'false';
  }

  if (width > 600) {
    elements[1].dataset.hidden = 'false';
	}
};

/* Function to make less video cards visible on screen narrow */
const narrow = (width) => {
  let elements = resultsWrapper.childNodes;

  if (width < 1200) {
    elements[3].dataset.hidden = 'true';
  }

  if (width < 900) {
    elements[2].dataset.hidden = 'true';
  }

  if (width < 600) {
    elements[1].dataset.hidden = 'true';
	}
};

const windowControl = (width) => {
  width >= windowControl.prevWindowWidth ? expand(width) : narrow (width);
  windowControl.prevWindowWidth = width;
};

windowControl.prevWindowWidth = window.innerWidth;

window.addEventListener('resize', () => windowControl(window.innerWidth));

/* Function to add 4 video cards to the DOM */
const renderResults = () => {
  for (let i = 0; i < 4; ++i) {
    const result = document.createElement('div');
    result.classList.add('result');
    result.dataset.hidden = "false";

    resultsWrapper.appendChild(result);
  }

  narrow(window.innerWidth);
};

/* Function that clears content from all displayed video cards */
const clearContent = () => {
  resultsWrapper.childNodes.forEach((result) => {
    while (result.firstChild) {
      result.removeChild(result.firstChild);
    }
  });
};

/* Function to set content to video cards */
const setContent = (from) => {
  clearContent();
  console.log('Ебошим контент!');
  resultsWrapper.childNodes.forEach((result) => {
    const image = document.createElement('img');
    image.classList.add('vidImage');
    image.src = results[from].thumbnail;

    const title = document.createElement('a');
    title.classList.add('vidTitle');
    title.href = `https://www.youtube.com/watch?v=${results[from].id}`;
    title.textContent = results[from].title;

    const description = document.createElement('p');
    description.classList.add('vidDescription');
    description.textContent = results[from].description;

    const info = document.createElement('div');
    info.classList.add('vidInfo');

    const author = document.createElement('p');
    author.classList.add('vidAuthor');
    author.textContent = results[from].author;
    info.appendChild(author);

    const publDate = document.createElement('p');
    publDate.classList.add('vidPublDate');
    publDate.textContent = results[from].publicationDate;
    info.appendChild(publDate);

    const views = document.createElement('p');
    views.classList.add('vidViews');
    views.textContent = results[from++].viewRate;
    info.appendChild(views);

    result.appendChild(image);
    result.appendChild(title);
    result.appendChild(description);
    result.appendChild(info);
  });
};

/* Function to reset page switches and video cards content */
const toFirstPage = () => {
  let count = 0;

  sliderWrapper.childNodes.forEach((pageSwitch) => {
    pageSwitch.dataset.pageNum = count;
    pageSwitch.textContent = ++count;
  });

  makeChecked(0);
  setContent(0);
};

/* Function to add 4 page switches to the DOM*/
const renderPageSwitches = () => {
  for (let i = 0; i < 4; ++i) {
    const pageSwitch = document.createElement('div');
    pageSwitch.classList.add('pageSwitch');
    if (!i) pageSwitch.classList.add('checked');

    sliderWrapper.appendChild(pageSwitch);
  }
};

/* Function that updates the numbers of page switches */
const updatePageSwithes = (side) => {
  let value = side === 'right' ? 1 : -1;

  sliderWrapper.childNodes.forEach((pageSwitch) => {
    pageSwitch.dataset.pageNum = +pageSwitch.dataset.pageNum + value;
    pageSwitch.textContent = +pageSwitch.textContent + value;
  });
};

/* Function that makes current page switch checked */
const makeChecked = (currentSwitch) => {
  sliderWrapper.childNodes.forEach((pageSwitch) => {
    pageSwitch.classList.remove('checked');
    if (pageSwitch.dataset.pageNum == currentSwitch) {
      pageSwitch.classList.add('checked');
    }
  });
};

/* Once executed function to show video cards on page load */
const renderItems = (() => {
  let executed = false;

  return () => {
    if (!executed) {
      executed = true;
      renderResults();
      container.appendChild(resultsWrapper);
      renderPageSwitches();
      container.appendChild(sliderWrapper);
    }
  };
})();

/* Function to add recieved after request items to the results array */
const getDetailsRequestUrl = (array) => {
  if (!array.length) {
    return Promise.reject("Can't get new url!");
  } else {
    return `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${array.map(video => video.id.videoId).join(',')}&part=snippet,statistics&fields=items(id,%20snippet(title,description,channelTitle,publishedAt,thumbnails(medium(url))),statistics(viewCount))`;
  }
};

/* Function that creates and fills with information Video objects and adds them to results array */
const fillResults = (array) => {
  if (!array.length) {
    return Promise.reject('No results!');
  } else {
    array.forEach((data) => {
      const video = new Video();

      [video.id, video.thumbnail, video.title, video.description, video.author, video.publicationDate, video.viewRate] =
      [data.id, data.snippet.thumbnails.medium.url, data.snippet.title, data.snippet.description, data.snippet.channelTitle, data.snippet.publishedAt, data.statistics.viewCount];

      results.push(video);
    });
    console.log('Результаты готовы!');
    return Promise.resolve();
  }
};

/* Adds animation when video cards appear */
const appearAnim = () => {
  resultsWrapper.style.animation = 'appear 0.5s linear';
  setTimeout(() => resultsWrapper.style.animation = 'none', 500);
};

/* Adds animation when next page is clicked */
const slideLeftAnim = () => {
  resultsWrapper.style.animation = 'slideLeft 0.5s ease-in-out';
  setTimeout(() => resultsWrapper.style.animation = 'none', 500);
};

/* Adds animation when previous page is clicked */
const slideRightAnim = () => {
  resultsWrapper.style.animation = 'slideRight 0.5s ease-in-out';
  setTimeout(() => resultsWrapper.style.animation = 'none', 500);
};

/* Function to control video cards and page switches content depending on page number */
sliderWrapper.addEventListener('mouseup', (e) => sliderControl(e));

/* Function to send http request */
const sendRequest = (url, nextPage) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 5000;

    xhr.addEventListener('timeout', () => {
      alert('Request Timeout!');
    });

    xhr.addEventListener('loadend', () => {
      if (xhr.status != 200) {
        alert(`Request failed. Error ${xhr.status}`);
        return;
      }

      sendRequest.pageToken = JSON.parse(xhr.responseText).nextPageToken || sendRequest.pageToken;

      resolve(JSON.parse(xhr.responseText).items);
    });

    if (nextPage) url += `&pageToken=${sendRequest.pageToken}`;

    xhr.open('GET', url, true);
    xhr.send();
  });
};

sendRequest.pageToken = '';

/* Function to make request and call necessary functions depending on isNew option */
const makeRequest = (isNew) => {
  const idsRequestUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&type=video&part=snippet&maxResults=16&fields=nextPageToken,items(id(videoId))&q=${searchText.value}`;

  if (isNew) {
    results.length = 0;
    sliderControl.prevPage = 0;
    sendRequest(idsRequestUrl, false)
    .then(getDetailsRequestUrl)
    .then(detailsRequestUrl => sendRequest(detailsRequestUrl))
    .then(fillResults)
    .then(renderItems)
    .then(appearAnim)
    .then(toFirstPage)
    .catch(error => alert(`Error occured: ${error}`));
  } else {
    sendRequest(idsRequestUrl, true)
    .then(getDetailsRequestUrl)
    .then(detailsRequestUrl => sendRequest(detailsRequestUrl))
    .then(fillResults)
    .catch(error => alert(`Error occured: ${error}`));

    return Promise.resolve();
  }
};

/* Function to control page switches behaviour */
const sliderControl = (e) => {
  const pageNum = +e.target.dataset.pageNum;

  if (pageNum * 4 + 4 === results.length) {
    makeRequest(false)
    .then(setContent(pageNum));
    sliderControl.prevPage < pageNum ? slideLeftAnim() : slideRightAnim();
  } else {
    setContent(pageNum * 4);
    if (sliderControl.prevPage !== pageNum) {
      sliderControl.prevPage < pageNum ? slideLeftAnim() : slideRightAnim();
    }
  }

  if (e.target === sliderWrapper.lastChild) {
    updatePageSwithes('right');
  }

  if (e.target === sliderWrapper.firstChild && pageNum !== 0) {
    updatePageSwithes('left');
  }

  makeChecked(pageNum);

  sliderControl.prevPage = pageNum;
};

sliderControl.prevPage = 0;

const search = () => {
  if (searchText.value) {
    makeRequest(true);
  } else {
    alert('Nothing was entered!');
  }
};

/* Function to catch Enter key press */
searchText.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    search();
  }
});

/* Function to catch search button click */
searchBtn.addEventListener('mouseup', search);
searchBtn.addEventListener('touchend', search);

/* Function to create page structure */
const renderPage = () => {
  document.body.appendChild(container);
	container.appendChild(question);
	container.appendChild(searchBox);
	searchBox.appendChild(searchText);
	searchBox.appendChild(searchBtn);
};

renderPage();
