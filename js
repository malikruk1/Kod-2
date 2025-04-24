// ==== DOM Elements ====
const modal = document.getElementById("modal");
const createBtn = document.getElementById("create-track-button");
const trackForm = document.getElementById("track-form");
const trackList = document.getElementById("track-list");
const searchInput = document.getElementById("search-input");
const genreFilter = document.getElementById("filter-genre");
const artistFilter = document.getElementById("filter-artist");
const genreInput = document.getElementById("input-genre");
const genreTags = document.getElementById("genre-tags");
const addGenreBtn = document.getElementById("add-genre");
const audioInput = document.getElementById("input-audio");
const audioPreview = document.getElementById("audio-preview");
const audioPreviewContainer = document.getElementById("audio-preview-container");
const removeAudioBtn = document.getElementById("remove-audio");
const sortSelect = document.getElementById("sort-select");
const deleteSelectedButton = document.getElementById("delete-selected-button");
deleteSelectedButton.setAttribute("data-testid", "bulk-delete-button");
const confirmDialog = document.getElementById("confirm-dialog");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");
const toastContainer = document.getElementById("toast-container");
const loadingIndicator = document.getElementById("loading-indicator");
const loadingTracks = document.getElementById("loading-tracks");

// ==== State ====
let tracks = JSON.parse(localStorage.getItem("tracks")) || [];
let editingIndex = null;
let currentGenres = [];
let currentAudioUrl = "";
let currentPage = 1;
const itemsPerPage = 5;
let searchQuery = "";
let lastPlayingAudio = null;
let selectionMode = false;

// ==== Toast ====
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("data-testid", `toast-${type}`);
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ==== Loading ====
function showLoading(state, container) {
  if (!container) return;
  container.setAttribute("data-loading", state ? "true" : "false");
  container.classList.toggle("hidden", !state);
  container.setAttribute("aria-disabled", state.toString());
}

// ==== Confirm Dialog ====
let pendingDeleteIndexes = [];

function openConfirmDialog(indexes) {
  confirmDialog.classList.remove("hidden");
  pendingDeleteIndexes = indexes;
}

function closeConfirmDialog() {
  confirmDialog.classList.add("hidden");
  pendingDeleteIndexes = [];
}

confirmDeleteBtn.addEventListener("click", () => {
  tracks = tracks.filter((_, i) => !pendingDeleteIndexes.includes(i));
  localStorage.setItem("tracks", JSON.stringify(tracks));
  showToast("Tracks deleted", "success");
  renderTracks();
  closeConfirmDialog();
});

cancelDeleteBtn.addEventListener("click", closeConfirmDialog);

// ==== Modal ====
function openModal() {
  modal.classList.remove("hidden");
  if (editingIndex === null) {
    trackForm.reset();
    currentGenres = [];
    currentAudioUrl = "";
    updateGenreTags();
    audioPreview.src = "";
    audioPreviewContainer.classList.add("hidden");
  }
}

function closeModal() {
  modal.classList.add("hidden");
}

// ==== Genre Tags ====
function updateGenreTags() {
  genreTags.innerHTML = "";
  currentGenres.forEach((genre) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.innerHTML = `${genre} <button type="button" onclick="removeGenre('${genre}')">&times;</button>`;
    genreTags.appendChild(span);
  });
}

function removeGenre(name) {
  currentGenres = currentGenres.filter((g) => g !== name);
  updateGenreTags();
}

// ==== Helpers ====
function isValidImageUrl(url) {
  return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
}

function paginate(array, page, size) {
  const start = (page - 1) * size;
  return array.slice(start, start + size);
}

// ==== Render Tracks ====
function renderTracks() {
  showLoading(true, loadingTracks);

  requestAnimationFrame(() => {
    const filtered = getFilteredTracks();
    const sorted = sortTracks(filtered);
    const paginated = paginate(sorted, currentPage, itemsPerPage);
    trackList.innerHTML = "";

    if (selectionMode) {
      const selectAllWrapper = document.createElement("div");
      const selectAllCheckbox = document.createElement("input");
      selectAllCheckbox.type = "checkbox";
      selectAllCheckbox.setAttribute("data-testid", "select-all");
      selectAllCheckbox.addEventListener("change", () => {
        document.querySelectorAll(".delete-checkbox").forEach(cb => {
          cb.checked = selectAllCheckbox.checked;
        });
      });
      selectAllWrapper.textContent = "Select All: ";
      selectAllWrapper.appendChild(selectAllCheckbox);
      trackList.appendChild(selectAllWrapper);
    }

    paginated.forEach((track, index) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "delete-checkbox";
      checkbox.dataset.index = tracks.indexOf(track);
      checkbox.setAttribute("data-testid", `track-checkbox-${tracks.indexOf(track)}`);

      const coverImg = document.createElement("img");
      coverImg.src = isValidImageUrl(track.cover) ? track.cover : "https://via.placeholder.com/100";
      coverImg.alt = "Cover";
      coverImg.className = "track-cover";

      const infoDiv = document.createElement("div");
      infoDiv.innerHTML = `
        <strong>${track.title}</strong> by ${track.artist}<br/>
        <small>Album: ${track.album || "N/A"} | Genres: ${track.genres.join(", ")}</small>
      `;

      if (track.audio) {
        const wrapper = document.createElement("div");
        wrapper.className = "audio-wrapper";
        wrapper.setAttribute("data-testid", `audio-player-${index}`);

        const audio = document.createElement("audio");
        audio.src = track.audio;
        audio.setAttribute("data-testid", `audio-progress-${index}`);
        audio.style.display = "none";

        const playButton = document.createElement("button");
        playButton.textContent = "▶️";
        playButton.setAttribute("data-testid", `play-button-${index}`);

        const pauseButton = document.createElement("button");
        pauseButton.textContent = "⏸️";
        pauseButton.setAttribute("data-testid", `pause-button-${index}`);
        pauseButton.style.display = "none";

        playButton.addEventListener("click", () => {
          if (lastPlayingAudio && lastPlayingAudio !== audio) {
            lastPlayingAudio.pause();
            lastPlayingAudio._playButton.style.display = "inline-block";
            lastPlayingAudio._pauseButton.style.display = "none";
          }
          audio.play();
          lastPlayingAudio = audio;
          playButton.style.display = "none";
          pauseButton.style.display = "inline-block";
        });

        pauseButton.addEventListener("click", () => {
          audio.pause();
          playButton.style.display = "inline-block";
          pauseButton.style.display = "none";
        });

        audio._playButton = playButton;
        audio._pauseButton = pauseButton;

        wrapper.appendChild(playButton);
        wrapper.appendChild(pauseButton);
        wrapper.appendChild(audio);
        infoDiv.appendChild(wrapper);
      }

      const actionsDiv = document.createElement("div");
      actionsDiv.innerHTML = `
        <button onclick="editTrack(${tracks.indexOf(track)})">Edit</button>
        <button onclick="deleteTrack(${tracks.indexOf(track)})">Delete</button>
      `;

      li.appendChild(checkbox);
      li.appendChild(coverImg);
      li.appendChild(infoDiv);
      li.appendChild(actionsDiv);
      trackList.appendChild(li);
    });

    renderPagination(filtered.length);
    showLoading(false, loadingTracks);
  });
}

// ==== Toggle Selection Mode Button ====
const toggleSelectionModeBtn = document.createElement("button");
toggleSelectionModeBtn.textContent = "Toggle Select Mode";
toggleSelectionModeBtn.setAttribute("data-testid", "select-mode-toggle");
toggleSelectionModeBtn.addEventListener("click", () => {
  selectionMode = !selectionMode;
  renderTracks();
});
document.querySelector(".controls").appendChild(toggleSelectionModeBtn);

// ==== Filters ====
function getFilteredTracks() {
  const genre = genreFilter.value.toLowerCase();
  const artist = artistFilter.value.toLowerCase();
  return tracks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery) &&
    t.artist.toLowerCase().includes(artist) &&
    t.genres.some((g) => g.toLowerCase().includes(genre))
  );
}

function sortTracks(list) {
  const criteria = sortSelect.value;
  if (!criteria) return list;
  return [...list].sort((a, b) =>
    a[criteria].toLowerCase().localeCompare(b[criteria].toLowerCase())
  );
}

// ==== Events ====
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase();
  currentPage = 1;
  renderTracks();
});

genreFilter.addEventListener("input", () => {
  currentPage = 1;
  renderTracks();
});

artistFilter.addEventListener("input", () => {
  currentPage = 1;
  renderTracks();
});

sortSelect.addEventListener("change", () => {
  currentPage = 1;
  renderTracks();
});

addGenreBtn.addEventListener("click", () => {
  const genre = genreInput.value.trim();
  if (genre && !currentGenres.includes(genre)) {
    currentGenres.push(genre);
    updateGenreTags();
  }
  genreInput.value = "";
});

removeAudioBtn.addEventListener("click", () => {
  audioPreview.src = "";
  currentAudioUrl = "";
  audioPreviewContainer.classList.add("hidden");
  audioInput.value = "";
});

createBtn.addEventListener("click", () => {
  editingIndex = null;
  openModal();
});

window.removeSelectedTracks = () => {
  const checkboxes = document.querySelectorAll(".delete-checkbox:checked");
  if (checkboxes.length === 0) return showToast("No tracks selected", "error");
  const indexes = Array.from(checkboxes).map((cb) => parseInt(cb.dataset.index));
  openConfirmDialog(indexes);
};

const myComponent = document.getElementById("loading-tracks");
myComponent.style.display = "block";

setTimeout(() => {
  myComponent.style.display = "none";
  myComponent.dispatchEvent(new Event("loaded"));
}, 500);

myComponent.addEventListener("loaded", () => {
  console.log("Компонент завантажено");
});

// ==== Start ====
renderTracks();
