const form = document.getElementById("workout-form");
const activityInput = document.getElementById("activity");
const durationInput = document.getElementById("duration");
const caloriesInput = document.getElementById("calories");
const workoutList = document.getElementById("workout-list");

const totalWorkouts = document.getElementById("total-workouts");
const totalMinutes = document.getElementById("total-minutes");
const totalCalories = document.getElementById("total-calories");

const STORAGE_KEY = "fitness-tracker-workouts";
let workouts = loadWorkouts();

function loadWorkouts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveWorkouts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

function renderSummary() {
  const minutes = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const calories = workouts.reduce((sum, workout) => sum + workout.calories, 0);

  totalWorkouts.textContent = String(workouts.length);
  totalMinutes.textContent = String(minutes);
  totalCalories.textContent = String(calories);
}

function renderList() {
  workoutList.innerHTML = "";

  if (workouts.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty";
    emptyItem.textContent = "No workouts yet. Add your first workout above.";
    workoutList.appendChild(emptyItem);
    return;
  }

  workouts.forEach((workout) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <span><strong>${workout.activity}</strong> - ${workout.duration} min - ${workout.calories} cal</span>
      <button type="button" data-id="${workout.id}">Delete</button>
    `;
    workoutList.appendChild(item);
  });
}

function render() {
  renderSummary();
  renderList();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const activity = activityInput.value.trim();
  const duration = Number(durationInput.value);
  const calories = Number(caloriesInput.value);

  if (!activity || duration <= 0 || calories < 0) {
    return;
  }

  workouts.unshift({
    id: Date.now().toString(),
    activity,
    duration,
    calories,
  });

  saveWorkouts();
  render();
  form.reset();
  activityInput.focus();
});

workoutList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const id = target.dataset.id;
  workouts = workouts.filter((workout) => workout.id !== id);

  saveWorkouts();
  render();
});

render();
