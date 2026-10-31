// Our daily goals
const goals = [
    "Wake up at 5:00 AM",
    "Drink water",
    "Read Quran",
    "Study a new skill",
    "Go to the gym",
    "Go to sleep at 9:00 PM",
    "No pornography"
];

// Find the goals section in HTML
const goalsList = document.getElementById("goals-list");

// Display each goal on the website
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