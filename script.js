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
// Calculate daily progress
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

    document.getElementById("progress-number").textContent =
        percentage + "%";

    const message = document.getElementById("progress-message");

    message.textContent =
        percentage === 100
            ? "Amazing! You completed every goal."
            : "Keep going. Every step counts.";
}

// Listen for checkbox changes
document.querySelectorAll("#goals-list input").forEach(function(checkbox) {
    checkbox.addEventListener("change", updateProgress);
});