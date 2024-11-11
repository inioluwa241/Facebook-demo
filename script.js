"use strict";

const main = document.querySelector(".login_create_account");
const loginSection = document.querySelector("#login_page");
const loginInputNumber = loginSection.querySelector("#input_num_email");
const loginInputPassword = loginSection.querySelector("#input_password_login");
const logInBtn = loginSection.querySelector(".btn_submit");
const getStartedSection = document.querySelector("#create_account_section_1");
const findYourAccountSection = document.querySelector(
  "#create_account_section_2"
);
const inputNameSection = document.querySelector("#create_account_section_3");
const inputBirthdaySection = document.querySelector(
  "#create_account_section_4"
);
const genderSection = document.querySelector("#create_account_section_5");
const numberSection = document.querySelector("#create_account_section_6");
const emailSection = document.querySelector("#create_account_section_7");
const passwordSection = document.querySelector("#create_account_section_8");
let saveLoginInfoSection = document.querySelector("#create_account_section_9");
const termsPolicySection = document.querySelector("#create_account_section_10");
const getStarted = document.querySelector("#create_account_section_11");

const btnGetStarted = document.querySelector(".btn_get_started");
const btnc = document.querySelectorAll(".btnc");

const forgotPassword = document.querySelector(".forgot_password");
const createAccountBtn = document.querySelector(".create_account");

const error = document.createElement("p");

loginSection.classList.add("hide");
// localStorage.clear();

const createAccArray = [
  getStartedSection,
  inputNameSection,
  inputBirthdaySection,
  genderSection,
  numberSection,
  emailSection,
  passwordSection,
  // saveLoginInfoSection,
  termsPolicySection,
  getStarted,
];

findYourAccountSection.classList.add("hide");

createAccArray.forEach((each) => each.classList.add("hide"));

// localStorage.clear();

console.log(Object.values(localStorage));

/********************************
IMPLEMENT LOGIN
********************************/

// console.log(usersInfo);
if (localStorage.length > 0) {
  loginSection.classList.remove("hide");

  logInBtn.addEventListener("click", function (e) {
    // alert("well");
    const numVal = loginInputNumber.value;
    const passwordVal = loginInputPassword.value;
    localStorage.setItem("logedin", JSON.stringify(numVal));

    const usersInfoObj = JSON.parse(localStorage.getItem(numVal));
    console.log(usersInfoObj);
    console.log(passwordVal == usersInfoObj.userPassword);
    console.log(numVal == usersInfoObj.userPhoneNumber);

    console.log(logInBtn);
    console.log("noooo");
    e.preventDefault();

    if (
      numVal == usersInfoObj.userPhoneNumber &&
      passwordVal == usersInfoObj.userPassword
    ) {
      console.log(numVal);
      window.location.replace("./main.html");
    } else {
      loginInputPassword.style.borderColor = "red";
      loginSection.querySelector("span").style.display = "none";
      error.textContent = `Incorrect number or password, please check and try again
`;
      error.classList.add("yes");
      logInBtn.before(error);
    }
  });

  forgotPassword.addEventListener("click", function (e) {
    e.preventDefault();
    const numVal = loginInputNumber.value;
    console.log(numVal);
    // localStorage.setItem("logedin", JSON.stringify(numVal));
    const usersInfoObj = JSON.parse(localStorage.getItem(numVal));
    if (loginInputNumber.value && usersInfoObj) {
      loginInputPassword.value = usersInfoObj.userPassword;
    }
    if (!loginInputNumber.value) {
      alert("Please input your phone number");
    }
    if (!usersInfoObj) {
      alert("Account not found, please ensure you put in a valid phone number");
    }
  });

  createAccountBtn.addEventListener("click", function (e) {
    e.preventDefault();
    loginSection.classList.add("hide");
    let userinfoNew = {};
    createAccountFunction(userinfoNew);
  });
}

const createAccountFunction = function (usersInfo = {}) {
  createAccArray[0].classList.remove("hide");

  let currentPage;
  let nextPage;
  let prevPage;

  const yam = function () {
    currentPage = createAccArray.find((el) => !el.classList.contains("hide"));

    nextPage = createAccArray.find(function (el, i, arr) {
      const nxti = createAccArray.indexOf(currentPage);

      return el === arr[nxti + 1];
    });

    prevPage = createAccArray.find(function (el, i, arr) {
      const nxti = createAccArray.indexOf(currentPage);

      return el === arr[nxti - 1];
    });
  };
  yam();

  const stopNextPage = function () {
    prevPage.classList.remove("hide");
    currentPage.classList.add("hide");
    currentPage = console.log(currentPage);
    yam();
  };

  const toPrevPage = function () {
    prevPage.classList.remove("hide");
    currentPage.classList.add("hide");
    yam();
  };
  const toNextPage = function () {
    nextPage.classList.remove("hide");

    currentPage.classList.add("hide");
    yam();
  };

  const btncarr = Array.from(btnc);

  btncarr.forEach(function (each) {
    each.addEventListener("click", function (e) {
      e.preventDefault();
      toNextPage();
    });
  });

  const arrowLeftArr = Array.from(document.querySelectorAll(".arrow_left"));
  arrowLeftArr.forEach(function (each) {
    each.addEventListener("click", function (e) {
      e.preventDefault();
      toPrevPage();
    });
  });

  // let usersInfoObj = {};
  usersInfo = {};

  btncarr[1].addEventListener("click", function (e) {
    e.preventDefault();
    console.log(usersInfo);
    const userNames = Array.from(
      btncarr[1].parentElement.querySelectorAll("input")
    );
    const [inputFirstName, inputLastName] = userNames;
    usersInfo.userFirstName = inputFirstName.value;
    usersInfo.userLastName = inputLastName.value;

    if (!usersInfo.userFirstName || !usersInfo.userLastName) {
      userNames.forEach((each) => (each.style.borderColor = "red"));
      stopNextPage();
    }

    stuff();
  });

  btncarr[2].addEventListener("click", function (e) {
    e.preventDefault();

    const input = btncarr[2].parentElement.children[0];

    usersInfo.userDateOfBirth = input.value;
    console.log(usersInfo);

    if (!usersInfo.userDateOfBirth) {
      input.style.borderColor = "red";

      stopNextPage();
    }
    console.log(usersInfo.userDateOfBirth);
  });

  btncarr[4].addEventListener("click", function (e) {
    e.preventDefault();
    const input = btncarr[4].parentElement.children[0];
    usersInfo.userPhoneNumber = input.value;
    console.log(usersInfo);

    if (
      !usersInfo.userPhoneNumber ||
      isNaN(usersInfo.userPhoneNumber) ||
      usersInfo.userPhoneNumber.length < 11
    ) {
      input.style.borderColor = "red";

      stopNextPage();
    }
    console.log(usersInfo.userPhoneNumber);
  });

  btncarr[5].addEventListener("click", function (e) {
    e.preventDefault();
    const input = btncarr[5].parentElement.children[0];
    usersInfo.userEmail = input.value;

    if (!usersInfo.userEmail) {
      input.style.borderColor = "red";

      stopNextPage();
    }
    console.log(usersInfo.userEmail);
  });

  const arr = [];
  btncarr[6].addEventListener("click", function (e) {
    e.preventDefault();
    const input = btncarr[6].parentElement.children[0];
    usersInfo.userPassword = input.value;

    if (!usersInfo.userPassword) {
      input.style.borderColor = "red";

      stopNextPage();
    }
    arr.push(usersInfo.userFirstName, usersInfo.userLastName);
    console.log(usersInfo.userPassword);
    console.log(usersInfo.userFirstName);
  });

  const thing = function (firstName, lastName) {
    saveLoginInfoSection.innerHTML = `<section class="save_login_info_section section_center" id="create_account_section_9">
      <i class="fas fa-arrow-left arrow_left"></i>

      <h2>Save your login info?</h2>

      <p>
        We'll save the login for ${firstName} ${lastName}, so you wont need to enter it next
        time you log in.
      </p>

      <button type="submit" class="btn_submit btn_save btnc">Save</button>

      <div class="btn_trans Sign_up_with"><p>Not now</p></div>
    </div>

      <a href="" class="already_have_account">I already have an account</a>
    </section>`;
    return saveLoginInfoSection;
  };

  const stuff = function () {
    createAccArray.splice(
      7,
      0,
      thing(usersInfo.userFirstName, usersInfo.userLastName)
    );

    saveLoginInfoSection.classList.add("hide");

    const saveButton = thing(
      usersInfo.userFirstName,
      usersInfo.userLastName
    ).querySelector("button");

    saveButton.addEventListener("click", function (e) {
      e.preventDefault();

      toNextPage();
    });
  };

  const cNABtn = getStarted.querySelector("div");
  const goFindAccBtn = getStarted.querySelector("button");

  cNABtn.addEventListener("click", function (e) {
    e.preventDefault();

    window.location.replace("./main.html");
    console.log(usersInfo);
    const acName = usersInfo.userPhoneNumber;
    // const toRetrieve = acName.name.toUpperCase();
    const toRetrieve = `${acName.name}1`;
    console.log(acName);
    localStorage.setItem("logedin", JSON.stringify(acName));
    // localStorage.setItem(`${toRetrieve}`, JSON.stringify(acName));
    localStorage.setItem(`${acName}`, JSON.stringify(usersInfo));

    console.log(
      `My name is ${usersInfo.userFirstName} ${usersInfo.inputLastName}, i was born on ${usersInfo.userDateOfBirth}, my phone number is ${usersInfo.userPhoneNumber} and my email is ${usersInfo.userEmail}, also having a password ${usersInfo.userPassword}`
    );
  });

  goFindAccBtn.addEventListener("click", function (e) {
    e.preventDefault();

    getStarted.classList.add("hide");
    findYourAccountSection.classList.remove("hide");
  });
};

// const userInfoObj = {};
if (localStorage.length === 0) {
  let usersInfoOb = {};
  createAccountFunction(usersInfoOb);
}

// window.addEventListener("load", function (e) {
//   console.log(e);
//   window.postMessage("Hello, Receiver!", "*");
// });

// console.log(window.location.origin);
setTimeout(() => {
  // const data = { action: "sendMethod", payload: "Hello, Receiver!" };
  const data = { message: "Hello, Receiver!" };
  window.postMessage("Hello from sender", window.location.origin);
});

// window.addEventListener("message", function (e) {
//   console.log(e);
//   console.log(e.timeStamp);
//   if (e.origin === window.location.origin && e.source !== window) {
//     console.log("Received message:", e.data);
//   }
// });

// let newWindow = window.open("index.html", "_blank");
// if (!newWindow) {
//   alert("Popup blocked! Please allow popups for this site.");
// }

// SENDER FILE
// setTimeout(() => {
//   newWindow.postMessage("Hello from sender", window.location.origin);
//   console.log("done");
// }, 5000);
