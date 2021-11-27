/*
 * GLOBAL
 */

//MARK THE CURRENT PAGE NAVEBAR AS SELECTED
window.onload = function get_body() {
  //Get the page id of the current page
  const currentPage = document.body.id.replace("-", "");
  //Get the menu links
  var aTags = document.getElementsByClassName("nav-link");
  for (var i = 0; i < aTags.length; i++) {
    if (
      aTags[i].textContent.trim().toUpperCase().replace(" ", "") ==
      currentPage.toUpperCase()
    ) {
      aTags[i].classList.add("active"); //Add active to the current page menu link
      break;
    }
  }
};

//Validation to forms (all form-check)
window.addEventListener("load", function () {
  // Starter JavaScript for disabling form submissions if there are invalid fields
  (function () {
    "use strict";
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll(".needs-validation");
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener(
        "submit",
        function (event) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add("was-validated");
        },
        false
      );
    });
  })();
});

/*
 * BOOK ONLINE PAGE <--------------------------------------------------------
 */

// Run only on Book Online page
if (document.getElementById("book-online")) {
  //(OPTION 1) CREATE CARDS WITH HOURS TO BE BOOCKED IN THE BOOK NOW PAGE
  let fullDate = new Date(); //get the full date
  let TodayDate = fullDate.getDay(); //get the day of the week
  //(OPTION 1 & 2 ) Options to be used to transform the numeral date to a string date.
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  for (weekDay = 1; weekDay <= 7; weekDay++) {
    //create a card for each day
    let mainContainer = document.getElementById("weekHours");
    let card = document.createElement("div");
    card.classList.add("card", "mb-1", "text-center", "bg-light", "shadow");
    let divCardHeader = document.createElement("div");
    divCardHeader.classList.add("card-header", "custonbgp");
    let textNode = document.createTextNode(
      fullDate.toLocaleString("en-US", options)
    );
    divCardHeader.appendChild(textNode);
    card.appendChild(divCardHeader);
    let divCardBody = document.createElement("div");
    divCardBody.classList.add("card-body");
    if (TodayDate !== 0) {
      for (hour = 9; hour < 17; hour += 0.5) {
        let aElement = document.createElement("a");
        aElement.classList.add("btn", "btn-outline-secondary");
        aElement.href = "#";
        aElement.setAttribute("data-bs-toggle", "modal");
        aElement.setAttribute("data-bs-target", "#fullScreenWeekModal");
        aElement.setAttribute("onclick", "transferTitle($(this))");
        if (hour % 1 === 0) {
          //Verify if it is interger to print hours properly
          let textNode = document.createTextNode(`${hour}:00 - ${hour}:30`);
          aElement.appendChild(textNode);
        } else {
          let textNode = document.createTextNode(
            `${Math.trunc(hour)}:30 - ${hour + 0.5}:00`
          );
          aElement.appendChild(textNode);
        }
        divCardBody.appendChild(aElement);
      }
    } else {
      //Sunday - Not a working day
      let h5Element = document.createElement("h5");
      h5Element.innerText = "Sorry! We are close.";
      divCardBody.appendChild(h5Element);
    }
    card.appendChild(divCardBody);
    mainContainer.appendChild(card);
    fullDate.setDate(fullDate.getDate() + 1); //add 1 day to the current date
    TodayDate < 6 ? TodayDate++ : (TodayDate = 0);
  }

  //(OPTION 1) GET DATE TITLE FROM OPTION 1 AND ADD IT TO MODAL TITLE
  function transferTitle(elmnt) {
    let bookHour = elmnt.text(); //Get hour selected by user
    //To get the day title -> go up 2 levels in the tree and get first child text.
    let secondParent = elmnt.parentsUntil("col-12", ".card");
    let bookDate = secondParent.children(".card-header").text();
    //transfre the date and hour text to the modal title.
    document.getElementById(
      "modal-card-header"
    ).innerText = `${bookDate} - ${bookHour}`;
  }

  // (OPTION 2) START DATE PICKER - ATTACH IT ON LOAD
  window.addEventListener("load", () => {
    picker.attach({
      target: "input-pop",
      disableday: [7], // DISABLE SUN (DEFAULT NONE)
      yrange: 2, // ALLOW +/- 2 YEARS FROM NOW (DEFAULT 10)
      onpick: () => {
        markClickDate(event), //
          $("#fullScreenModal").modal("show"), //SHOW MODAL WITH FORM (BOOK ONLINE PAGE)
          getClickedDate(" ");
      },
    });
  });
}

//(OPTION 2) ADD CLASS NAME ON CLICKED DATE AND MARK IT AS SELECTED USING CSS
function markClickDate(e) {
  e.target.classList.add("picker-d-td");
}

// (OPTION 2) GET DATE FROM DATE PICKER, TRANSFER IT TO MODAL TITLE
function getClickedDate(anyString) {
  let inputValue = anyString; //If call came from (ADMIN AREA)
  //get date and as number and convert it to string
  if (document.getElementById("input-pop")) {
    //If call came from (BOOK ONLINE)
    inputValue = document.getElementById("input-pop").value;
  }
  let inputValueArray = inputValue.split("-");
  let theYear = Number(inputValueArray[0]);
  let theMonth = Number(inputValueArray[1]) - 1;
  let theDay = Number(inputValueArray[2]);
  let dateTitle = document.getElementById("dateTitle");
  //(OPTION 1 & 2 ) Options to be used to transform the numeral date to a string date.
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  dateTitle.innerText = new Date(theYear, theMonth, theDay).toLocaleString(
    "en-US",
    options
  );
  populateHours();
}

//(OPTION 2) POPULATE HOURS TO BE BOOKED IN THE FORM INSIDE MODAL.
function populateHours() {
  //populate hours to book as a inputs radio
  let formCheck = document.getElementById("form-check-hours");
  formCheck.innerHTML = ""; //Clear element to build everything new
  let hours = "";
  //Business open 9 to 17, create book option in every half hour
  for (let hour = 9; hour < 17; hour += 0.5) {
    hours =
      hour % 1 === 0
        ? `${hour}:00 - ${hour}:30`
        : `${Math.trunc(hour)}:30 - ${hour + 0.5}:00`;
    let inputRadio = document.createElement("input");
    inputRadio.setAttribute("type", "radio");
    inputRadio.classList.add("btn-check");
    inputRadio.setAttribute("name", "hours");
    inputRadio.setAttribute("id", hours.replace(/\s/g, ""));
    inputRadio.setAttribute("autocomplete", "off");
    inputRadio.required = true;
    formCheck.appendChild(inputRadio);
    let labelRadio = document.createElement("label");
    labelRadio.classList.add("btn", "btn-outline-secondary");
    labelRadio.setAttribute("for", hours.replace(/\s/g, ""));
    let labelRadioTextNode = document.createTextNode(hours);
    labelRadio.appendChild(labelRadioTextNode);
    formCheck.appendChild(labelRadio);
    hours = "";
  }
  //Create invalid message feedback to show when needed
  let divInvalidFeedback = document.createElement("div");
  divInvalidFeedback.classList.add("invalid-feedback");
  let iFTextNode = document.createTextNode("Please, chose a time.");
  divInvalidFeedback.appendChild(iFTextNode);
  formCheck.appendChild(divInvalidFeedback);
}

/*
 * ADMIN AREA PAGE <--------------------------------------------------------
 */

//RECEIVE DATE FROM CALENDAR, CONVERT TO STRING, ADD TO MODAL TITLE AND CALL POPULATE HOURS
function DateValue(value) {
  let DateValue = value.substring(1); //take out the # from the href string
  getClickedDate(DateValue); //call functions to put date as title and populate book hours
}

/*
 * ADMIN AREA > CHANGE PASSWORD FORM <--------------------------------------------------------
 */

function checkPass() {
  //Store the passwords
  var pass1 = document.getElementById("pass1");
  var pass2 = document.getElementById("pass2");
  //Store the Confimation Message
  var message = document.getElementById("confirmMessage");
  //Set the colors
  var okColor = "#66cc66";
  var notOkColor = "#ff6666";
  //Compare the values in the password field
  //and the confirmation field
  if (pass1.value == pass2.value) {
    //The passwords match.
    //Set color and inform user.
    pass2.style.backgroundColor = okColor;
    message.style.color = okColor;
    message.innerHTML = "Passwords Match!";
    $("#cp").prop("disabled", false);
  } else {
    //The passwords do not match.
    //Set the color and notify user.
    pass2.style.backgroundColor = notOkColor;
    message.style.color = notOkColor;
    message.innerHTML = "Passwords Do Not Match!";
    $("#cp").prop("disabled", true);
  }
}
