"use strict";

import * as indexdb from "./indexdb.js";

// window.addEventListener("sharedFunctionReady", function () {
//   console.log("welll");
//   const sharedFunction = window.sharedFunction;
//   sharedFunction();
//   console.log("welll");
// });

const main = document.querySelector(".facebook_page");

const header = document.querySelector("header");

const nav = document.querySelector("nav");
const navHouseIcon = nav.querySelector(".fa-house");
const navPpleIcon = nav.querySelector(".fa-user-group");
const navMessageIcon = nav.querySelector(".fa-facebook-messenger");
const navBellIcon = nav.querySelector(".fa-bell");
const navTvIcon = nav.querySelector(".fa-tv");
const navShopIcon = nav.querySelector(".fa-shop");

const afterNav = document.querySelector(".after_nav");
const profilePicContArr = Array.from(
  document.querySelectorAll(".profile_img_container")
);
const whatsOnYourMind = afterNav.querySelector(".input_post");
const photoToPost = document.querySelector(".input_photo");

const storiesSection = document.querySelector(".stories_section");
const storiesNode = document.querySelectorAll(".story");

const postsArticle = document.querySelector(".post_article");
const postDisplayName = document.querySelectorAll(".post_display_name");
const follow = document.querySelector("article h4");
const iconsNode = document.querySelectorAll("posts_icons");

const postsFooter = document.querySelector(".post_footer");
const postReactions = document.querySelectorAll(".reactions");
const postsFooterLikeIcon = postsFooter.querySelector(".fa-thumbs-up");
const postsFooterCommentIcon = postsFooter.querySelector(".fa-comment");
const postsFooterWhatsappIcon = postsFooter.querySelector(".fa-whatsapp");
const postsFooterforwardIcon = postsFooter.querySelector(".fa-share");

const profilePage = document.querySelector(".profile");
const profilePageSub = document.querySelector(".profile_sub");
const storyInputFile = document.querySelector("#story_file_upload");

const makingPost = document.querySelector(".making_post");
const cancelMakingPost = makingPost.querySelector(".fa-xmark");
const makingPostFirstOne = makingPost.querySelector(".first_one");
const makingPostInputText = makingPost.querySelector("#text_for_post");
const makingPostuploadMedia = makingPost.querySelector(".upload_media");
const makingPostuploadPost = makingPost.querySelector(".upload_post");
const makingPostInputMedia = makingPost.querySelector("#input_media_file");

const overlay = document.querySelector(".overlay");

const storiesArray = Array.from(storiesNode);
const createStory = storiesArray.find((each) =>
  each.classList.contains("create_story")
);
const namee = JSON.parse(localStorage.getItem("logedin"));
const usersInfoObj = JSON.parse(localStorage.getItem(`${namee}`));

console.log(usersInfoObj);

Array.from(profilePage.querySelectorAll("h2")).forEach(
  (each) =>
    (each.innerHTML = `${usersInfoObj.userLastName} ${usersInfoObj.userFirstName}`)
);

Array.from(document.querySelectorAll(".post_display_name")).forEach(
  (e) =>
    (e.innerHTML = `${usersInfoObj.userFirstName} ${usersInfoObj.userLastName}`)
);

postsArticle.querySelector(
  ".post_display_name"
).innerHTML = `${usersInfoObj.userFirstName} ${usersInfoObj.userLastName}`;

/********************************
IMPLEMENT GO TO PROFILE
********************************/

const profileFunc = function () {
  header.classList.add("hide");
  nav.classList.add("padding");
  afterNav.classList.add("hide");
};

document.addEventListener("click", function (event) {
  if (event.target.parentNode.classList.contains("profile_img_container")) {
    profileFunc();
    profilePage.classList.remove("hide");
  }
});

/********************************
IMPLEMENT BACK TO HOMEPAGE
********************************/

navHouseIcon.addEventListener("click", function (e) {
  e.preventDefault();
  header.classList.remove("hide");
  nav.classList.remove("padding");
  afterNav.classList.remove("hide");
  profilePage.classList.add("hide");
});

/****************************************************************
*****************************************************************
EVERYTHING RELATED TO POST
*****************************************************************
****************************************************************/

/********************************
IMPLEMENT MAKE A POST
********************************/

/**********IMPLEMENT MAKE INPUT POST POPUP***********/

[whatsOnYourMind, photoToPost].forEach((each) => {
  each.addEventListener("click", function (e) {
    e.preventDefault();

    makingPost.classList.remove("hidden");

    document.body.classList.add("stop-scrolling");

    overlay.classList.remove("hidden");
  });
});

// photoToPost.addEventListener

/**********IMPLEMENT MAKE INPUT POST MODAL TO CLEAR***********/

const cancelPostPopupFunc = function () {
  makingPost.classList.add("hidden");

  document.body.classList.remove("stop-scrolling");

  overlay.classList.add("hidden");
};

cancelMakingPost.addEventListener("click", cancelPostPopupFunc);

/**********IMPLEMENT SELECTING WHAT TO POST***********/

let mediaToPost;
let fileType;
let url;
makingPostuploadMedia.addEventListener("click", function (e) {
  e.preventDefault();

  makingPostInputMedia.click();

  makingPostInputMedia.onchange = function () {
    const value = makingPostInputMedia.files[0];
    mediaToPost = value;
    console.log(mediaToPost);

    fileType = value.type.split("/")[0] === "image" ? "img" : "video";
    url = URL.createObjectURL(value);

    const postsMedia = document.createElement(`${fileType}`);
    postsMedia.src = url;
    postsMedia.classList.add("fit");
    postsMedia.style.background = "green";
    makingPostFirstOne.append(postsMedia);
  };
});

/**********IMPLEMENT SUBMISSION OF POST***********/

makingPostuploadPost.addEventListener("click", function (e) {
  e.preventDefault();

  const textToPost = makingPostInputText.value;

  if (!textToPost && !mediaToPost) return;

  const userPost = postsArticle.cloneNode(true);

  const [
    userPostHead,
    userPostPostsText,
    userPostMediaContainer,
    userPostFooter,
  ] = Array.from(userPost.children);
  console.log(userPostHead);
  console.log(userPostPostsText);
  console.log(userPostMediaContainer);
  console.log(userPostFooter);

  // Manipulating them
  userPostHead.querySelector(
    ".post_display_name"
  ).innerHTML = `${usersInfoObj.userFirstName} ${usersInfoObj.userLastName}`;

  userPostPostsText.textContent = `${textToPost}`;

  userPostMediaContainer.innerHTML =
    fileType === "img"
      ? `<img src="${url}" alt="" />`
      : `<video src="${url}"></video>`;

  cancelPostPopupFunc();

  // Inserting post into homepage and profile page
  main.querySelector(".after_nav").appendChild(userPost.cloneNode(true));
  profilePage.appendChild(userPost.cloneNode(true));

  /**********STORING POSTS IN INDEXDB***********/

  // CONVERTING IMAGES TO BASE64 FOR STORAGE
  async function convertImagesToBase64(articleContainer) {
    const imgElements = articleContainer.querySelectorAll("img");

    // Process each image element and convert it to base64
    const fileInput = document.getElementById("input_media_file");
    for (let img of imgElements) {
      const file = fileInput.files[0];
      const url = URL.createObjectURL(file);
      const response = await fetch(url);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );

      img.src = `data:${blob.type};base64,${base64String}`; // Set src to Base64 string
    }

    // Return the modified innerHTML with Base64-encoded images
    return articleContainer.innerHTML;
  }
  convertImagesToBase64(userPost);

  async function saveArticleWithBase64Images(articleContainer, articleKey) {
    // Convert all image src attributes in the article to Base64
    const articleHTML = await convertImagesToBase64(articleContainer);
    addData(articleHTML);
  }
  saveArticleWithBase64Images(userPost);
});

/**********IMPLENTING FOLLOW POST***********/

document.addEventListener("click", function (event) {
  if (
    event.target.parentNode.parentNode.tagName === "ARTICLE" &&
    event.target.tagName === "H4"
  ) {
    event.target.innerHTML = "Following";
  }
});

/**********IMPLENTING CANCEL ICON***********/

document.addEventListener("click", function (event) {
  if (
    event.target.parentNode.classList.contains("posts_icons") &&
    event.target.classList.contains("cancel")
  ) {
    event.target.parentNode.parentNode.parentNode.classList.add("hide");
  }
});

/**********IMPLENTING LIKE ICON***********/

document.addEventListener("click", function (event) {
  if (
    event.target.parentNode.parentNode.classList.contains("post_footer") &&
    event.target.tagName === "I" &&
    !event.target.classList.contains("fa-comment")
  ) {
    event.target.classList.add("like_icon");
  }
});

window.addEventListener("DOMContentLoaded", function (e) {
  // e.preventDefault();

  setTimeout(function () {
    // document.getElementById("retrieveDataBtn").click();
    indexdb.retrieveData((error, retrievedPosts) => {
      if (error) {
        console.error(error);
      } else {
        indexdb.renderPosts(retrievedPosts, postsArticle, main, profilePage);
      }
    });
  }, 1000);
});

// Event listener for the Add Data button
document.getElementById("addDataBtn").addEventListener("click", function () {
  const value = document.getElementById("dataInput").value;
  if (value) {
    indexdb.addData(value);
    document.getElementById("dataInput").value = ""; // Clear input
  } else {
    alert("Please enter a value to store");
  }
});

// Event listener for the Retrieve Data button
document
  .getElementById("retrieveDataBtn")
  .addEventListener("click", function () {
    indexdb.retrieveData((error, retrievedPosts) => {
      if (error) {
        console.error(error);
      } else {
        console.log(retrievedPosts);
        indexdb.renderPosts(retrievedPosts, postsArticle, main, profilePage);
      }
    });
  });

// Event listener for the Clear All Data button
document.getElementById("clearDataBtn").addEventListener("click", function () {
  indexdb.clearData();
});

/********************************
IMPLEMENT CREATE STORY
********************************/

createStory.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("rice");
});

const userStoriesArr = [createStory];
let yourStories = document.createElement("div");
yourStories.classList.add("story");

const storyStyles = window.getComputedStyle(createStory);

createStory.addEventListener("click", function () {
  let newStory = document.createElement("div");

  storyInputFile.click();

  let arr = [];
  storyInputFile.onchange = function () {
    let urls;
    if (storyInputFile.files.length > 0) {
      const value = storyInputFile.files.item(0);
      const url = URL.createObjectURL(value);
      urls = url;
      arr.push(value);
      console.log(value);
      if (value.type.includes("image")) {
        const storyMedia = document.createElement("img");
        storyMedia.src = urls;
        storyMedia.classList.add("fit");
        yourStories.append(storyMedia);
      }

      if (value.type.includes("video")) {
        const storyMedia = document.createElement("video");
        storyMedia.src = urls;
        storyMedia.classList.add("fit");
        yourStories.append(storyMedia);
      }
      if (arr.length > 1) {
        const toDisplay = arr.join().slice(0, 30);
        console.log(toDisplay);
      } else {
        // single.previousElementSibling.innerHTML = `${arr
        // .join()
        // .slice(0, 20)}...`;
      }
    }

    console.log(storyInputFile.files);
    // storiesSection.append(image);

    // newStory.innerHTML = `
    //         <img src='${arr[0]}' alt="" />
    //       `;
  };

  storiesSection.append(yourStories);
  userStoriesArr.push(newStory);
  console.log(userStoriesArr);
});
