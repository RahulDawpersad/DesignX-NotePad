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
  } else {
    console.error('Note content is empty');
  }
}

function createNewNote() {
  noteText.value = '';
  noteText.focus();
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
  } else {
    notesList.innerHTML = '<p>No notes found.</p>';
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