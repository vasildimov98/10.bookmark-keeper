// DOM ELEMENTS
const showModalH1 = document.getElementById("show-modal");
const bookmarkContainerDiv = document.getElementById("bookmarks-container");
const modalDiv = document.getElementById("modal");
const closeModalAn = document.getElementById("close-modal");
const websiteNameInput = document.getElementById("website-name");
const websiteUrl = document.getElementById("website-url");
const bookmarkForm = document.getElementById("bookmark-form");

let bookmarks = {};

// Function declarations
// Show Modal on click / Focus on First Input
function showModal() {
  modalDiv.classList.add("show-modal");
  websiteNameInput.focus();
}

// Validate Bookmark form values
function validate(name, url) {
  if (!name || !url) {
    alert("Name or url is missing, please provide them");
    return false;
  }

  var expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  var regex = new RegExp(expression);

  if (!url.match(regex)) {
    alert("Url is invalid, please provide a valid url");
    return false;
  }

  return true;
}

// Delete bookmark
function deleteBookmark(id) {
  if (bookmarks[id]) {
    delete bookmarks[id];
  }

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

// Create elements with DOM and append them
function buildBookmarks() {
  // Clear all current bookmarks
  bookmarkContainerDiv.textContent = "";

  // Go trough all bookmarks and create element
  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];

    // Create item container
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    // Create icon for closing
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fa", "fa-times", "delete-bookmarks");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${id}')`);

    // Create content container
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("name");

    // Create Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");

    // Create link for bookmark
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    link.textContent = name;

    // Appends Elements
    contentContainer.append(favicon, link);
    itemDiv.append(closeIcon, contentContainer);

    // Show elements
    bookmarkContainerDiv.appendChild(itemDiv);
  });
}

// Get Bookmarks from localStorage
function fetchBookmarks() {
  // get data if available
  const bookmarksData = JSON.parse(localStorage.getItem("bookmarks"));

  console.log(bookmarksData);

  if (!bookmarksData) {
    // Set a example bookmark first time
    const id = new Date().getUTCMilliseconds();
    bookmarks[id] = { name: "google", url: "https://google.com" };
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  } else {
    // Set bookmarks to be equal to data in local storage
    bookmarks = bookmarksData;
  }

  // Show bookmarks on display
  buildBookmarks();
}

// Submit and validate bookmark
function submitBookmark(e) {
  e.preventDefault();

  const nameValue = websiteNameInput.value;
  let urlValue = websiteUrl.value;

  if (!urlValue.includes("https://") && !urlValue.includes("http://")) {
    urlValue = `https://${urlValue}`;
  }

  //   Validate value
  if (!validate(nameValue, urlValue)) return false;

  //   Create a bookmark object

  const id = new Date().getUTCMilliseconds();
  bookmarks[id] = { name: nameValue, url: urlValue };
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameInput.focus();
}

// Event Listener
showModalH1.addEventListener("click", showModal);
closeModalAn.addEventListener("click", () =>
  modalDiv.classList.remove("show-modal")
);
window.addEventListener("click", (e) =>
  e.target === modalDiv ? e.target.classList.remove("show-modal") : false
);
bookmarkForm.addEventListener("submit", submitBookmark);

// On Load
fetchBookmarks();
