<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple Note App</title>
  <script src="https://kit.fontawesome.com/655b3b7e45.js" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="style.css">
  <style>
    body {
    font-family: sans-serif;
    background-color: #f4f4f4;
    margin: 40px 0 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.note-container {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    gap: 2em;
}

.sidebar {
    width: 250px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .3);
    padding: 1em;
    box-sizing: border-box;
}

.sidebar h2 {
    margin-top: 0;
}

#notes-list {
    max-height: 600px;
    overflow-y: auto;
    margin-top: 1rem;
}

.note-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
    margin-bottom: 0.5rem;
    cursor: pointer;
}

.note-item h3 {
    margin: 0;
    font-size: 1rem;
    color: #333;
    flex-grow: 1;
}

.button-container {
    display: flex;
    gap: 1em;
    margin-top: 1em;
}

#save-button, #new-note-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

#save-button:hover, #new-note-button:hover {
    background-color: #0056b3;
}

.paper {
    position: relative;
    width: 90%;
    max-width: 800px;
    min-width: 400px;
    height: 480px;
    background: #fafafa;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .3);
    overflow: hidden;
}

.paper:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 60px;
    background: radial-gradient(#575450 6px, transparent 7px) repeat-y;
    background-size: 30px 30px;
    border-right: 3px solid #D44147;
    box-sizing: border-box;
}

.paper-content {
    position: absolute;
    top: 30px;
    right: 0;
    bottom: 30px;
    left: 60px;
    background: linear-gradient(transparent, transparent 28px, #91D1D3 28px);
    background-size: 30px 30px;
}

.paper-content textarea {
    resize: none;
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    line-height: 30px;
    border: 0;
    outline: 0;
    background: transparent;
    color: rgb(0, 0, 0);
    font-family: 'Handlee', cursive;
    font-weight: bold;
    font-size: 0.9em;
    box-sizing: border-box;
    z-index: 1;
    overflow: auto; /* Ensure scrollbar appears */
}

/* Scrollbar styles for WebKit browsers (Chrome, Safari) */
.paper-content textarea::-webkit-scrollbar {
    width: 12px; /* Width of the scrollbar */
}

.paper-content textarea::-webkit-scrollbar-track {
    background: #f4f4f4; /* Background of the scrollbar track */
    border-radius: 10px;
}

.paper-content textarea::-webkit-scrollbar-thumb {
    background-color: #888; /* Color of the scrollbar thumb */
    border-radius: 10px;
    border: 2px solid #f4f4f4; /* Padding around thumb */
}

.paper-content textarea::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* Color when hovering over scrollbar thumb */
}

/* Scrollbar styles for Firefox */
.paper-content textarea {
    scrollbar-width: thin;
    scrollbar-color: #888 #f4f4f4;
}

.paper-content textarea::-webkit-scrollbar-corner {
    background: transparent; /* Background of the scrollbar corner */
}

.copy-button, .delete-button {
    padding: 0.2rem 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.copy-button {
    background-color: #4caf50;
    color: white;
    margin-right: 0.5rem;
}

.delete-button {
    background-color: #dc3545;
    color: white;
}

.copy-message {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    font-size: 14px;
    opacity: 0;
    animation: fadeInOut 2s forwards;
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
        transform: translateY(-10px);
    }
    10% {
        opacity: 1;
        transform: translateY(0);
    }
    90% {
        opacity: 1;
        transform: translateY(0);
    }
    100% {
        opacity: 0;
        transform: translateY(-10px);
    }
}

  </style>
</head>
<body>
  <div class="note-container">
    <div class="sidebar">
      <h2>Saved Notes</h2>
      <div id="notes-list"></div>
    </div>
    <div class="paper">
      <div class="paper-content">
        <textarea id="note-text" autofocus placeholder="Write your note here..."></textarea>
      </div>
    </div>
  </div>
  <div class="button-container">
    <button id="save-button">Save Note</button>
    <button id="new-note-button">New Note</button>
  </div>
  <script>
    const noteText = document.getElementById('note-text');
const saveButton = document.getElementById('save-button');
const newNoteButton = document.getElementById('new-note-button');
const notesList = document.getElementById('notes-list');

saveButton.addEventListener('click', saveNote);
newNoteButton.addEventListener('click', createNewNote);

function saveNote() {
  const note = noteText.value.trim();
  if (note) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
    noteText.value = '';
    displayNotes();
  }
}

function createNewNote() {
  noteText.value = ''; // Clear the textarea for a new note
  noteText.focus(); // Focus on the textarea
}

function displayNotes() {
  notesList.innerHTML = '';
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  if (notes.length > 0) {
    notes.forEach((note, index) => {
      const noteItem = document.createElement('div');
      noteItem.classList.add('note-item');

      const noteHeading = document.createElement('h3');
      noteHeading.textContent = `Note ${index + 1}`;
      noteItem.appendChild(noteHeading);

      noteItem.addEventListener('click', () => {
        noteText.value = note;
      });

      const buttonContainer = document.createElement('div');
      
      const copyButton = document.createElement('button');
      copyButton.classList.add('copy-button');
      copyButton.innerHTML = `<i class="fa-solid fa-copy"></i>`;
      copyButton.addEventListener('click', (event) => {
        event.stopPropagation();
        navigator.clipboard.writeText(note)
          .then(() => {
            showCopyMessage('Note copied successfully!');
          })
          .catch(err => {
            console.error('Failed to copy note:', err);
          });
      });

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-button');
      deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
      deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
      });

      buttonContainer.appendChild(copyButton);
      buttonContainer.appendChild(deleteButton);

      noteItem.appendChild(buttonContainer);
      notesList.appendChild(noteItem);
    });
  }
}

function showCopyMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('copy-message');
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    document.body.removeChild(messageDiv);
  }, 2000);
}

displayNotes();

  </script>
</body>
</html>
