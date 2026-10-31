// =====================================
// LEVEL UP - PERSONAL GOAL TRACKER
// =====================================

// YOUR SEVEN DAILY GOALS

const goals = [
    "Wake up at 5:00 AM",
    "Drink water",
    "Read Quran",
    "Study a new skill",
    "Go to the gym",
    "Go to sleep at 9:00 PM",
    "No pornography"
];

// =====================================
// STORAGE
// =====================================

const DAILY_STORAGE = "levelup-daily-data";
const MONTHLY_STORAGE = "levelup-monthly-reviews";

function getDailyData() {
    return JSON.parse(localStorage.getItem(DAILY_STORAGE)) || {};
}

function saveDailyData(data) {
    localStorage.setItem(DAILY_STORAGE, JSON.stringify(data));
}

function getMonthlyData() {
    return JSON.parse(localStorage.getItem(MONTHLY_STORAGE)) || {};
}

function saveMonthlyData(data) {
    localStorage.setItem(MONTHLY_STORAGE, JSON.stringify(data));
}

// =====================================
// DATE HELPERS
// =====================================

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getMonthKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
}

function getSelectedDateObject() {
    return new Date(selectedDate.value + "T00:00:00");
}

// =====================================
// ELEMENTS
// =====================================

const selectedDate = document.getElementById("selected-date");
const goalsList = document.getElementById("goals-list");

const progressNumber = document.getElementById("progress-number");
const progressFill = document.getElementById("progress-fill");
const completedCount = document.getElementById("completed-count");
const scoreMessage = document.getElementById("score-message");

const calendarDays = document.getElementById("calendar-days");
const monthYear = document.getElementById("month-year");
const calendarMessage = document.getElementById("calendar-message");

const reviewMonth = document.getElementById("review-month");
const monthlyRating = document.getElementById("monthly-rating");
const ratingValue = document.getElementById("rating-value");
const monthlyReflection = document.getElementById("monthly-reflection");

const historyList = document.getElementById("history-list");

// =====================================
// INITIAL DATE
// =====================================

const today = new Date();

selectedDate.value = formatDate(today);
document.getElementById("today-date").textContent =
    today.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

document.getElementById("footer-year").textContent =
    today.getFullYear();

let calendarDate = new Date(today.getFullYear(), today.getMonth(), 1);

reviewMonth.value = getMonthKey(today);

// =====================================
// DAILY GOALS
// =====================================

function loadProgress() {
    const allData = getDailyData();
    const dayData = allData[selectedDate.value] || [];

    goalsList.innerHTML = "";

    goals.forEach(function(goal, index) {

        const isChecked = dayData[index] === true;

        const goalItem = document.createElement("div");
        goalItem.classList.add("goal-item");

        if (isChecked) {
            goalItem.classList.add("done");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `goal-${index}`;
        checkbox.checked = isChecked;

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = goal;

        checkbox.addEventListener("change", function() {

            const currentData = getDailyData();

            if (!currentData[selectedDate.value]) {
                currentData[selectedDate.value] = [];
            }

            currentData[selectedDate.value][index] = checkbox.checked;

            saveDailyData(currentData);

            goalItem.classList.toggle("done", checkbox.checked);

            updateProgress();
            renderCalendar();
            updateMonthlyStats();
            renderHistory();
        });

        goalItem.appendChild(checkbox);
        goalItem.appendChild(label);

        goalsList.appendChild(goalItem);
    });

    updateProgress();
}

// =====================================
// DAILY SCORE
// =====================================

function updateProgress() {

    const allData = getDailyData();
    const dayData = allData[selectedDate.value] || [];

    const completed = goals.filter(function(goal, index) {
        return dayData[index] === true;
    }).length;

    const percentage = Math.round((completed / goals.length) * 100);

    progressNumber.textContent = percentage + "%";
    progressFill.style.width = percentage + "%";

    completedCount.textContent =
        `${completed} of ${goals.length} goals completed`;

    if (percentage === 100) {
        scoreMessage.textContent = "Excellent! You completed every goal today.";
    } else if (percentage >= 50) {
        scoreMessage.textContent = "Good progress. Keep pushing forward.";
    } else if (percentage > 0) {
        scoreMessage.textContent = "You're making progress. Keep going.";
    } else {
        scoreMessage.textContent = "A new day is a new opportunity.";
    }
}

// =====================================
// CHANGE SELECTED DAY
// =====================================

selectedDate.addEventListener("change", function() {

    if (!selectedDate.value) {
        return;
    }

    calendarDate = new Date(
        getSelectedDateObject().getFullYear(),
        getSelectedDateObject().getMonth(),
        1
    );

    loadProgress();
    renderCalendar();
});

// =====================================
// CALENDAR
// =====================================

function renderCalendar() {

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthYear.textContent = calendarDate.toLocaleDateString(
        "en-US",
        {
            month: "long",
            year: "numeric"
        }
    );

    calendarDays.innerHTML = "";

    const allData = getDailyData();

    // EMPTY SPACES BEFORE THE FIRST DAY

    for (let i = 0; i < firstDay; i++) {

        const emptyDay = document.createElement("div");

        calendarDays.appendChild(emptyDay);
    }

    // CREATE EVERY DATE

    for (let day = 1; day <= daysInMonth; day++) {

        const dateButton = document.createElement("button");

        dateButton.type = "button";
        dateButton.textContent = day;
        dateButton.classList.add("calendar-date");

        const monthNumber = String(month + 1).padStart(2, "0");
        const dayNumber = String(day).padStart(2, "0");

        const dateKey = `${year}-${monthNumber}-${dayNumber}`;

        const dayData = allData[dateKey] || [];

        const completed = goals.filter(function(goal, index) {
            return dayData[index] === true;
        }).length;

        // SHOW SELECTED DATE

        if (selectedDate.value === dateKey) {
            dateButton.classList.add("selected");
        }

        // SHOW DAILY PROGRESS

        if (completed === goals.length) {
            dateButton.classList.add("completed");
        } else if (completed > 0) {
            dateButton.classList.add("partial");
        }

        // CLICK A DATE

        dateButton.addEventListener("click", function() {

            selectedDate.value = dateKey;

            loadProgress();
            renderCalendar();

            calendarMessage.textContent =
                `Viewing progress for ${new Date(dateKey + "T00:00:00").toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })}.`;

        });

        calendarDays.appendChild(dateButton);
    }

    // CALENDAR MESSAGE

    if (!calendarMessage.textContent) {
        calendarMessage.textContent =
            "Select a date to review your progress.";
    }
}

// PREVIOUS MONTH

document.getElementById("prev-month").addEventListener("click", function() {

    calendarDate.setMonth(calendarDate.getMonth() - 1);

    renderCalendar();
});

// NEXT MONTH

document.getElementById("next-month").addEventListener("click", function() {

    calendarDate.setMonth(calendarDate.getMonth() + 1);

    renderCalendar();
});

// =====================================
// MONTHLY REVIEW
// =====================================

function loadMonthlyReview() {

    const monthKey = reviewMonth.value;

    if (!monthKey) {
        return;
    }

    const allReviews = getMonthlyData();
    const review = allReviews[monthKey];

    if (review) {
        monthlyRating.value = review.rating;
        monthlyReflection.value = review.reflection;
    } else {
        monthlyRating.value = 5;
        monthlyReflection.value = "";
    }

    ratingValue.textContent = monthlyRating.value;

    updateMonthlyStats();
}

// UPDATE RATING NUMBER

monthlyRating.addEventListener("input", function() {
    ratingValue.textContent = monthlyRating.value;
});

// SAVE MONTHLY REVIEW

document.getElementById("save-review").addEventListener("click", function() {

    const monthKey = reviewMonth.value;

    if (!monthKey) {
        return;
    }

    const allReviews = getMonthlyData();

    allReviews[monthKey] = {
        rating: Number(monthlyRating.value),
        reflection: monthlyReflection.value
    };

    saveMonthlyData(allReviews);

    document.getElementById("review-message").textContent =
        "Your monthly review has been saved.";

    updateMonthlyStats();
    renderHistory();
});

// LOAD A DIFFERENT MONTH

reviewMonth.addEventListener("change", function() {

    loadMonthlyReview();
});

// =====================================
// MONTHLY STATISTICS
// =====================================

function updateMonthlyStats() {

    const monthKey = reviewMonth.value;

    if (!monthKey) {
        return;
    }

    const allData = getDailyData();

    const trackedDays = Object.keys(allData).filter(function(date) {
        return date.startsWith(monthKey);
    });

    let totalCompleted = 0;
    let totalPossible = 0;

    trackedDays.forEach(function(date) {

        const dayData = allData[date] || [];

        const completed = goals.filter(function(goal, index) {
            return dayData[index] === true;
        }).length;

        totalCompleted += completed;
        totalPossible += goals.length;
    });

    const average = totalPossible > 0
        ? Math.round((totalCompleted / totalPossible) * 100)
        : 0;

    document.getElementById("days-tracked").textContent =
        trackedDays.length;

    document.getElementById("monthly-completed").textContent =
        totalCompleted;

    document.getElementById("monthly-average").textContent =
        average + "%";
}

// =====================================
// PROGRESS HISTORY
// =====================================

function renderHistory() {

    const allData = getDailyData();

    const dates = Object.keys(allData).sort().reverse();

    historyList.innerHTML = "";

    if (dates.length === 0) {

        historyList.innerHTML =
            '<p class="empty-message">Your tracked days will appear here.</p>';

        return;
    }

    dates.slice(0, 15).forEach(function(date) {

        const dayData = allData[date] || [];

        const completed = goals.filter(function(goal, index) {
            return dayData[index] === true;
        }).length;

        const percentage = Math.round((completed / goals.length) * 100);

        const historyItem = document.createElement("div");
        historyItem.classList.add("history-item");

        const dateText = document.createElement("span");

        dateText.textContent = new Date(date + "T00:00:00")
            .toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

        const progressText = document.createElement("strong");

        progressText.textContent =
            `${completed}/7 goals · ${percentage}%`;

        historyItem.appendChild(dateText);
        historyItem.appendChild(progressText);

        historyList.appendChild(historyItem);
    });
}

// =====================================
// START THE WEBSITE
// =====================================

loadProgress();
renderCalendar();
loadMonthlyReview();
renderHistory();