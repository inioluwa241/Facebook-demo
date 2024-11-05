let db;
const request = indexedDB.open("myDatabase", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  // Create an object store with auto-incrementing IDs
  const objectStore = db.createObjectStore("myStore", {
    keyPath: "id",
    autoIncrement: true,
  });
  objectStore.createIndex("value", "value", { unique: false });
};

request.onsuccess = function (event) {
  db = event.target.result;
  console.log("Database opened successfully");
};

request.onerror = function () {
  console.error("Database failed to open");
};

// Function to add data to IndexedDB
export function addData(value) {
  const transaction = db.transaction(["myStore"], "readwrite");
  const objectStore = transaction.objectStore("myStore");
  const addRequest = objectStore.add({ value: value });

  addRequest.onsuccess = function () {
    console.log("Data added to the database:");
  };

  addRequest.onerror = function () {
    console.error("Failed to add data");
  };
}

let exData;
// Function to retrieve all data from IndexedDB
export function retrieveData(callback) {
  const transaction = db.transaction(["myStore"], "readonly");
  const objectStore = transaction.objectStore("myStore");
  // const getAllRequest = objectStore.getAll();
  const retrievedPosts = [];

  const requestPosts = objectStore.openCursor(null, "prev");

  requestPosts.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      retrievedPosts.push(cursor.value); // collect each post

      cursor.continue(); // Move to the next item in reverse
    } else {
      callback(null, retrievedPosts); // Resolve when all items are collected
    }
  };

  requestPosts.onerror = (event) => {
    reject(`Error retrieving posts: ${event.target.errorCode}`);
  };
}

// Function to render posts in users acount
export function renderPosts(posts, postsArticle, main, profilePage) {
  posts.forEach((post, i) => {
    console.log(`well it worked ${i}`);
    // console.log(post.value);
    const userPost = postsArticle.cloneNode(true);
    userPost.innerHTML = post.value;
    [main.querySelector(".after_nav"), profilePage].forEach((each) =>
      each.appendChild(userPost.cloneNode(true))
    );
  });
}
// Display data in the HTML
export function displayData(data) {
  const dataList = document.getElementById("dataList");
  dataList.innerHTML = ""; // Clear existing list
  data.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.value;
    dataList.appendChild(li);
  });
}

export function clearData() {
  const transaction = db.transaction(["myStore"], "readwrite");
  const objectStore = transaction.objectStore("myStore");
  const clearRequest = objectStore.clear();

  clearRequest.onsuccess = function () {
    console.log("All data cleared from the database");
    displayData([]);
  };

  clearRequest.onerror = function () {
    console.error("Failed to clear data");
  };
}

export function deleteDatabase() {
  indexedDB
    .deleteDatabase("postsDB")
    .then(() => {
      console.log("Database deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting database:", error);
    });
}
