const form = document.forms[0];
const urlInput = document.querySelector(".shortening form input");
const dataHolder = document.querySelector(".shortened-links");

let localArr = [];
if (localStorage.getItem("links")) {
  localArr = JSON.parse(localStorage.getItem("links"));
}

displayFromLocal();

function validateInput(e) {
  e.preventDefault();

  let userInput = urlInput.value;
  userInput == "" ? throwError() : "";

  let replacing = ["www.", "https://"];

  for (let i = 0; i < replacing.length; i++) {
    userInput = userInput.replace(replacing[i], "");
  }

  getURL(userInput);
  urlInput.value = "";
}

function throwError() {
  form.classList.add("notValid");
  console.log("not found");
}

async function getURL(url) {
  let response = await fetch(
    `https://api.shrtco.de/v2/shorten?url=${url}/home`
  );

  let data = await response.json();
  displayHTML(data);
  updateLocal(data);
}

function displayHTML({
  result: { full_short_link: short, original_link },
} = data) {
  let linkHolder = document.createElement("div");
  linkHolder.className = "link";

  let enteredLink = document.createElement("span");
  enteredLink.className = "entered-link";
  enteredLink.appendChild(document.createTextNode(original_link));
  linkHolder.appendChild(enteredLink);

  createResults(linkHolder, short);

  function createResults(linkHolder, short) {
    let results = document.createElement("div");
    results.className = "results";

    let shortLink = document.createElement("span");
    shortLink.className = "shortened";
    shortLink.appendChild(document.createTextNode(short));
    results.appendChild(shortLink);

    let copyBtn = document.createElement("button");
    copyBtn.className = "copy";
    copyBtn.append(document.createTextNode("Copy"));
    copyBtn.addEventListener("click", copyURL);
    results.appendChild(copyBtn);

    function copyURL() {
      navigator.clipboard.writeText(short);
      copyBtn.innerHTML = "Copied!";
      copyBtn.classList.add("copied");

      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.innerHTML = "Copy";
      }, 5000);
    }
    linkHolder.appendChild(results);
  }

  dataHolder.appendChild(linkHolder);
}

function updateLocal({ result: { full_short_link, original_link } } = data) {
  let link = {
    originalLink: original_link,
    shortLink: full_short_link,
  };

  localArr.push(link);
  localStorage.setItem("links", JSON.stringify(localArr));
}

function displayFromLocal() {
  localArr.forEach((link) => {
    let linkObj = {
      result: {
        original_link: link.originalLink,
        full_short_link: link.shortLink,
      },
    };
    displayHTML(linkObj);
  });
}

form.addEventListener("submit", validateInput);
