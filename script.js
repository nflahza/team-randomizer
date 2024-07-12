document.addEventListener("DOMContentLoaded", function () {
  // Load saved data from localStorage
  if (localStorage.getItem("hasLeaders") === "true") {
    document.getElementById("hasLeaders").checked = true;
    document.getElementById("leadersField").style.display = "block";
  }
  document.getElementById("leadersInput").value =
    localStorage.getItem("leadersInput") || "";
  document.getElementById("namesInput").value =
    localStorage.getItem("namesInput") || "";
  document.getElementById("numTeams").value =
    localStorage.getItem("numTeams") || "";

  // Display previous teams if any
  const teams = JSON.parse(localStorage.getItem("teams") || "[]");
  const hasLeaders = localStorage.getItem("hasLeaders") === "true";
  if (teams.length > 0) {
    displayTeams(teams, hasLeaders);
  }

  // Add event listeners to save inputs
  document
    .getElementById("leadersInput")
    .addEventListener("input", function () {
      localStorage.setItem("leadersInput", this.value);
    });

  document.getElementById("namesInput").addEventListener("input", function () {
    localStorage.setItem("namesInput", this.value);
  });

  document.getElementById("numTeams").addEventListener("input", function () {
    localStorage.setItem("numTeams", this.value);
  });
});

function toggleLeadersInput() {
  const leadersField = document.getElementById("leadersField");
  leadersField.style.display =
    leadersField.style.display === "none" ? "block" : "none";
  localStorage.setItem(
    "hasLeaders",
    document.getElementById("hasLeaders").checked
  );
}

function randomizeTeams() {
  const hasLeaders = document.getElementById("hasLeaders").checked;
  const leadersInput = document.getElementById("leadersInput").value;
  const namesInput = document.getElementById("namesInput").value;
  const numTeams = parseInt(document.getElementById("numTeams").value);

  if (!namesInput || !numTeams || numTeams < 1) {
    alert("Please enter valid names and number of teams.");
    return;
  }

  let leaders = [];
  if (hasLeaders) {
    leaders = leadersInput
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name);
    if (leaders.length !== numTeams) {
      alert("The number of leaders must match the number of teams.");
      return;
    }
  }

  let names = namesInput
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name);

  let teams = hasLeaders
    ? leaders.map((leader) => [leader])
    : Array.from({ length: numTeams }, () => []);

  while (names.length > 0) {
    for (let i = 0; i < numTeams; i++) {
      if (names.length > 0) {
        const randomIndex = Math.floor(Math.random() * names.length);
        const name = names.splice(randomIndex, 1)[0];
        teams[i].push(name);
      }
    }
  }

  // Save data to localStorage
  localStorage.setItem("teams", JSON.stringify(teams));
  localStorage.setItem("hasLeaders", hasLeaders);

  displayTeams(teams, hasLeaders);
}

function displayTeams(teams, hasLeaders) {
  const teamsOutput = document.getElementById("teamsOutput");
  teamsOutput.innerHTML = "";

  teams.forEach((team, index) => {
    const teamDiv = document.createElement("div");
    teamDiv.className = "team column is-one-third";
    teamDiv.innerHTML = `
            <h2 class="title is-4">Team ${index + 1}</h2>
            ${
              hasLeaders
                ? `<p><strong>Leader:</strong> ${
                    team[0]
                  }</p><p><strong>Members:</strong> ${team
                    .slice(1)
                    .join(", ")}</p>`
                : `<p><strong>Members:</strong> ${team.join(", ")}</p>`
            }
        `;
    teamsOutput.appendChild(teamDiv);
  });
}

function resetForm() {
  // Clear localStorage
  localStorage.removeItem("leadersInput");
  localStorage.removeItem("namesInput");
  localStorage.removeItem("numTeams");
  localStorage.removeItem("teams");
  localStorage.removeItem("hasLeaders");

  // Reset form fields
  document.getElementById("hasLeaders").checked = false;
  document.getElementById("leadersField").style.display = "none";
  document.getElementById("leadersInput").value = "";
  document.getElementById("namesInput").value = "";
  document.getElementById("numTeams").value = "";
  document.getElementById("teamsOutput").innerHTML = "";
}
