// OUR DAILY GOALS
const goals = [
    "Wake up at 5:00 AM",
    "Drink water",
    "Read Quran",
    "Study a new skill",
    "Go to the gym",
    "Go to sleep at 9:00 PM",
    "No pornography"
];

// GET HTML ELEMENTS
const goalsList = document.getElementById("goals-list");
const progressNumber = document.getElementById("progress-number");
const progressMessage = document.getElementById("progress-message");
const selectedDate = document.getElementById("selected-date");
const goalsHeading = document.getElementById("goals-heading");

// GET TODAY'S DATE IN LOCAL TIME
function getToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// SET TODAY AS THE DEFAULT DATE
selectedDate.value = getToday();
selectedDate.max = getToday();

// CREATE THE GOAL CHECKBOXES
goals.forEach(function(goal, index) {
    const goalItem = document.createElement("div");

    goalItem.className = "goal-item";

    goalItem.innerHTML = `
        <label>
            <input type="checkbox" id="goal-${index}">
            <span>${goal}</span>
        </label>
    `;

    goalsList.appendChild(goalItem);
});

// SAVE PROGRESS FOR THE SELECTED DATE
function saveProgress() {
    const checkboxes = document.querySelectorAll(
        "#goals-list input[type='checkbox']"
    );

    const progress = [];

    checkboxes.forEach(function(checkbox) {
        progress.push(checkbox.checked);
    });

    localStorage.setItem(
        "levelUp-" + selectedDate.value,
        JSON.stringify(progress)
    );
}

// LOAD PROGRESS FOR THE SELECTED DATE
function loadProgress() {
    const savedProgress = localStorage.getItem(
        "levelUp-" + selectedDate.value
    );

    const progress = savedProgress
        ? JSON.parse(savedProgress)
        : [];

    const checkboxes = document.querySelectorAll(
        "#goals-list input[type='checkbox']"
    );

    checkboxes.forEach(function(checkbox, index) {
        checkbox.checked = progress[index] === true;
    });

    if (selectedDate.value === getToday()) {
        goalsHeading.textContent = "Today's Goals";
    } else {
        goalsHeading.textContent = "Goals for " + selectedDate.value;
    }

    updateProgress();
}

// CALCULATE DAILY PROGRESS
function updateProgress() {
    const checkboxes = document.querySelectorAll(
        "#goals-list input[type='checkbox']"
    );

    const completed = document.querySelectorAll(
        "#goals-list input[type='checkbox']:checked"
    ).length;

    const percentage = Math.round(
        (completed / goals.length) * 100
    );

    progressNumber.textContent = percentage + "%";

    if (percentage === 100) {
        progressMessage.textContent =
            "Amazing! You completed every goal.";
    } else {
        progressMessage.textContent =
            "Keep going. Every step counts.";
    }
}

// SAVE WHEN A GOAL IS TICKED
document.querySelectorAll("#goals-list input").forEach(
    function(checkbox) {
        checkbox.addEventListener("change", function() {
            saveProgress();
            updateProgress();
        });
    }
);

// LOAD ANOTHER DAY WHEN THE DATE CHANGES
selectedDate.addEventListener("change", function() {
    loadProgress();
});

// LOAD TODAY'S SAVED PROGRESS WHEN THE WEBSITE OPENS
loadProgress();