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
//Used on OPTION 1 to convert index in schedule time
function populateSchedule(index) {
  let _index = 0;
  for (let hour = 9; hour < 17; hour += 0.5) {
    hours =
      hour % 1 === 0
        ? `${hour}:00 - ${hour}:30`
        : `${Math.trunc(hour)}:30 - ${hour + 0.5}:00`;
    if (index == _index) {
      document.getElementById("schedule").value = hours;
      document.getElementById("dateTitle").innerText += `, from: ${hours}`;
      return;
    }
    hours = "";
    _index++;
  }
}

// Run only on Book Online page (OPTION 1)
if (document.getElementById("book-online")) {
  //(OPTION 1) CREATE CARDS WITH HOURS TO BE BOOCKED IN THE BOOK NOW PAGE
  let fullDate = new Date(); //get the full date
  let TodayDate = fullDate.getDay(); //get the day of the week
  //(OPTION 1 ) Options to be used to transform the numeral date to a string date.
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
      fullDate.toLocaleString("en-CA", options)
    );
    divCardHeader.appendChild(textNode);
    card.appendChild(divCardHeader);
    let divCardBody = document.createElement("div");
    divCardBody.classList.add("card-body");
    if (TodayDate !== 0) {
      let index = 0;
      for (hour = 9; hour < 17; hour += 0.5) {
        let aElement = document.createElement("a");
        aElement.classList.add("btn", "btn-outline-secondary", "book-link");
        aElement.href = `/books/create/${new Date(fullDate).toLocaleDateString(
          "en-CA"
        )}/${index}`;
        aElement.setAttribute(
          "id",
          `${new Date(fullDate).toLocaleDateString("en-CA")}_${index}`
        );
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
        index++;
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

  //(OPTION 1) CHECK FOR BOOKED EVENTS AND MARK THEM AS NOT AVAILABLE TO BOOK BY DISABLE THE ANCHOR LINK
  function disableLink(events) {
    const arrayBookLink = document.getElementsByClassName("book-link");
    //Iterate through all events from DB
    events.forEach((event) => {
      //Get array with dates from the Cards
      let bookLink = document
        .getElementsByClassName("book-link")
        .namedItem(`${event.date.slice(0, 10)}_${event.index}`);
      bookLink.classList.add("disableLink");
      bookLink.href = "javascript:void(0)";
    });
  }

  // (OPTION 2) START DATE PICKER - ATTACH IT ON LOAD
  window.addEventListener("load", () => {
    picker.attach({
      target: "input-pop",
      disableday: [7], // DISABLE SUN (DEFAULT NONE)
      yrange: 2, // ALLOW +/- 2 YEARS FROM NOW (DEFAULT 10)
      onpick: () => {
        markClickDate(event),
          (window.location.href = `/books/create/${
            document.getElementById("input-pop").value
          }/16?option=2`);
      },
    });
  });
}

//(OPTION 2) ON DATE PICKER, ADD CLASS NAME ON CLICKED DATE AND MARK IT AS SELECTED USING CSS
function markClickDate(e) {
  e.target.classList.add("picker-d-td");
}

// (OPTION 2) GET DATE FROM DATE PICKER, TRANSFER IT TO MODAL TITLE
//function getClickedDate(anyString) {
function getClickedDate(inputValue) {
  let inputValueArray = inputValue.split("-");
  let theYear = Number(inputValueArray[0]);
  let theMonth = Number(inputValueArray[1]) - 1;
  let theDay = Number(inputValueArray[2]);
  let dateTitle = document.getElementById("dateTitle");
  //(OPTION 2 ) Options to be used to transform the numeral date to a string date.
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

/*
 * ADMIN AREA > CRUD <--------------------------------------------------------
 */

//Take clicked radio buton and transfer it's id as an index
function replyId(clicked_id) {
  document.getElementById("index").value = clicked_id;
}

//If schedule exist, desable radio buton making it not available to be selected.
function disableRadio(events) {
  events.forEach((event) => {
    document.getElementById(`${event.index}`).disabled = true;
  });
}

//(Admin-Area /create) POPULATE HOURS TO BE BOOKED IN THE FORM: CREATE AN APPOINTMENT.
function populateRadioHours() {
  //populate hours to book as a inputs radio
  let formCheck = document.getElementById("form-check-hours");
  formCheck.innerHTML = ""; //Clear element to build everything new
  let hours = "";
  let _index = 0;
  //Business open 9 to 17, create book option in every half hour
  for (let hour = 9; hour < 17; hour += 0.5) {
    hours =
      hour % 1 === 0
        ? `${hour}:00 - ${hour}:30`
        : `${Math.trunc(hour)}:30 - ${hour + 0.5}:00`;
    let inputRadio = document.createElement("input");
    inputRadio.setAttribute("type", "radio");
    inputRadio.classList.add("btn-check");
    inputRadio.setAttribute("name", "schedule");
    inputRadio.setAttribute("id", _index);
    inputRadio.setAttribute("onClick", "replyId(this.id)");
    inputRadio.required = true;
    inputRadio.value = hours;
    formCheck.appendChild(inputRadio);
    let labelRadio = document.createElement("label");
    labelRadio.classList.add("btn", "btn-outline-secondary");
    labelRadio.setAttribute("for", _index);
    let labelRadioTextNode = document.createTextNode(hours);
    labelRadio.appendChild(labelRadioTextNode);
    formCheck.appendChild(labelRadio);
    hours = "";
    _index++;
  }
  //Create invalid message feedback to show when needed
  let divInvalidFeedback = document.createElement("div");
  divInvalidFeedback.classList.add("invalid-feedback");
  let iFTextNode = document.createTextNode("Please, chose a time.");
  divInvalidFeedback.appendChild(iFTextNode);
  formCheck.appendChild(divInvalidFeedback);
}
