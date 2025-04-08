document.addEventListener("DOMContentLoaded", () => {
    fetch("fetch.php")
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById("notifications-list");
        data.forEach(notif => {
          const div = document.createElement("div");
          div.className = "notification";
          div.innerHTML = `
            <div class="date">${notif.date}</div>
            <div class="title">${notif.title}</div>
            <div class="desc">${notif.description}</div>
          `;
          container.appendChild(div);
        });
      })
      .catch(err => {
        console.error("Error loading notifications:", err);
      });
  });
  