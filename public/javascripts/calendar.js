//Calendar ----------------------
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

let monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);

function next() {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}

function previous() {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {
  let firstDay = new Date(year, month).getDay();
  let daysInMonth = 32 - new Date(year, month, 32).getDate();
  // filing data about month and in the page via DOM.
  monthAndYear.innerHTML = months[month] + " " + year;

  let tblHead = document.getElementById("calendar-head"); // head of the calendar
  // clearing all previous cells
  tblHead.innerHTML = "";
  let thr = document.createElement("tr");
  days.forEach((day) => {
    let th = document.createElement("th");
    th.style.width = "14.25%";

    th.appendChild(document.createTextNode(day));
    thr.appendChild(th);
  });
  tblHead.appendChild(thr);

  let tblBody = document.getElementById("calendar-body"); // body of the calendar

  // clearing all previous cells
  tblBody.innerHTML = "";

  // creating all cells
  let date = 1;
  for (let i = 0; i < 6; i++) {
    // creates a table row
    let row = document.createElement("tr");

    //creating individual cells, filing them up with data.
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        let cell = document.createElement("td");
        let cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
      } else if (date > daysInMonth) {
        break;
      } else {
        let cell = document.createElement("td");
        //Create link to call a modal to book a new schedule
        let acell = document.createElement("a");
        acell.setAttribute("data-bs-toggle", "modal");
        acell.setAttribute("data-bs-target", "#fullScreenModal");
        //Call function passing date string to add in modal title and populate book hours
        acell.setAttribute("onclick", 'DateValue($(this).attr("href"))');
        acell.href = `#${year}-${month + 1}-${date}`;
        acell.className = "btn btn-outline-secondary";
        let cellText = document.createTextNode(date);
        if (
          //If today add a class to hilight the date
          date === today.getDate() &&
          year === today.getFullYear() &&
          month === today.getMonth()
        ) {
          cell.classList.add("bg-info");
        }
        acell.appendChild(cellText);
        cell.appendChild(acell);
        row.appendChild(cell);
        date++;
      }
    }
    tblBody.appendChild(row); // appending each row into calendar body.
  }
}
