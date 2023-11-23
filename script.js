document.addEventListener('DOMContentLoaded', function () {
  // Load notes from local storage when the page is loaded
  loadNotes();
// Initial background change
  fetchUnsplashImage();
});

function addNote() {
  var noteInput = document.getElementById('noteInput');
  var tagInput = document.getElementById('tagInput');
  var noteList = document.getElementById('noteList');
  var notes = getNotes();

  var noteText = noteInput.value.trim();
  var tagText = tagInput.value.trim();

  if (noteText !== '') {
    // Create a card element
    var card = document.createElement('div');
    card.className = 'card mb-3';

    var cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // Create a delete button
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger';
    deleteButton.onclick = function () {
      noteList.removeChild(card);
      updateLocalStorage();
    };

    // Create an update button
    var updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.className = 'btn btn-primary ml-2';
    updateButton.onclick = function () {
      // Enable the card to be updated directly within the box
      noteTextElement.contentEditable = true;
      noteTextElement.focus();
    };

    // Create a note text element
    var noteTextElement = document.createElement('p');
    noteTextElement.textContent = noteText;
    noteTextElement.className = 'card-text';
    noteTextElement.contentEditable = false;
    noteTextElement.addEventListener('blur', function () {
      updateNoteText();
    });

    // Create a tag element
    var tagElement = document.createElement('p');
    tagElement.textContent = 'Tag: ' + tagText;
    tagElement.className = 'card-text';

    cardBody.appendChild(noteTextElement);
    cardBody.appendChild(tagElement);
    cardBody.appendChild(deleteButton);
    cardBody.appendChild(updateButton);

    card.appendChild(cardBody);

    // Append the card to the note list
    noteList.appendChild(card);

    // Clear the input fields
    noteInput.value = '';
    tagInput.value = '';

    // Add the new note to the notes array and update local storage
    notes.push({
      text: noteText,
      tag: tagText,
      created: new Date(),
      updated: new Date()
    });
    updateLocalStorage();
  }
}

function updateNoteText() {
  var noteText = noteTextElement.textContent.trim();
  if (noteText !== '') {
    // Update the note text in the notes array
    var index = Array.from(noteList.children).indexOf(card);
    if (index !== -1) {
      notes[index].text = noteText;
      notes[index].updated = new Date();
      updateLocalStorage();
    }
  } else {
    // If the updated text is empty, revert to the original text
    noteTextElement.textContent = notes[index].text;
  }
}

function loadNotes() {
  var noteList = document.getElementById('noteList');
  var notes = getNotes();

  // Create card elements from the notes array
  notes.forEach(function (note) {
    var card = document.createElement('div');
    card.className = 'card mb-3';

    var cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // Create a delete button
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger';
    deleteButton.onclick = function () {
      noteList.removeChild(card);
      updateLocalStorage();
    };

    // Create an update button
    var updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.className = 'btn btn-primary ml-2';
    updateButton.onclick = function () {
      // Enable the card to be updated directly within the box
      noteTextElement.contentEditable = true;
      noteTextElement.focus();
    };

    // Create a note text element
    var noteTextElement = document.createElement('p');
    noteTextElement.textContent = note.text;
    noteTextElement.className = 'card-text';
    noteTextElement.contentEditable = false;
    noteTextElement.addEventListener('blur', function () {
      updateNoteText();
    });

    // Create a tag element
    var tagElement = document.createElement('p');
    tagElement.textContent = 'Tag: ' + note.tag;
    tagElement.className = 'card-text';

    cardBody.appendChild(noteTextElement);
    cardBody.appendChild(tagElement);
    cardBody.appendChild(deleteButton);
    cardBody.appendChild(updateButton);

    card.appendChild(cardBody);

    // Append the card to the note list
    noteList.appendChild(card);
  });
}

function getNotes() {
  var notes = JSON.parse(localStorage.getItem('notes')) || [];
  return notes;
}

function updateLocalStorage() {
  var noteList = document.getElementById('noteList');
  var notes = [];

  // Extract note details from each card element and add to the notes array
  noteList.childNodes.forEach(function (card) {
    if (card.nodeType === 1) {
      var noteTextElement = card.querySelector('.card-body .card-text');
      var tagElement = card.querySelector('.card-body p.card-text:last-child');

      var noteText = noteTextElement.textContent;
      var tagText = tagElement.textContent.replace('Tag: ', '');

      notes.push({
        text: noteText,
        tag: tagText,
        created: new Date(),
        updated: new Date()
      });
    }
  });

  // Save notes array to local storage
  localStorage.setItem('notes', JSON.stringify(notes));
}

function createNoteCard(note) {
  var card = document.createElement('div');
  card.className = 'card mb-3';

  var cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  var deleteButton = createButton('Delete', 'btn btn-danger', function () {
    noteList.removeChild(card);
    updateLocalStorage();
  });

  var updateButton = createButton('Update', 'btn btn-primary ml-2', function () {
    noteTextElement.contentEditable = true;
    noteTextElement.focus();
    okButton.style.display = 'inline'; // Display the "Ok" button during update
    updateButton.style.display = 'none'; // Hide the "Update" button during update
  });

  var okButton = createButton('Ok', 'btn btn-success ml-2', function () {
    noteTextElement.contentEditable = false;
    okButton.style.display = 'none'; // Hide the "Ok" button after saving changes
    updateButton.style.display = 'inline'; // Display the "Update" button after saving changes
    updateNoteText();
  });
  okButton.style.display = 'none'; // Initially hide the "Ok" button

  var noteTextElement = document.createElement('p');
  noteTextElement.textContent = note.text;
  noteTextElement.className = 'card-text';
  noteTextElement.contentEditable = false;
  noteTextElement.addEventListener('blur', function () {
    updateNoteText();
  });

  var tagElement = document.createElement('p');
  tagElement.textContent = 'Tag: ' + note.tag;
  tagElement.className = 'card-text';

  cardBody.appendChild(noteTextElement);
  cardBody.appendChild(tagElement);
  cardBody.appendChild(deleteButton);
  cardBody.appendChild(updateButton);
  cardBody.appendChild(okButton);

  card.appendChild(cardBody);

  return card;
}

function createButton(text, className, onclick) {
  var button = document.createElement('button');
  button.textContent = text;
  button.className = className;
  button.onclick = onclick;
  return button;
}

// Array of background URLs
function fetchUnsplashImage() {
  var accessKey = '0T2uMNqSE-G_FsZVaW939Dj0SQ8PoG5TOSkOdy700D4'; // Replace with your Unsplash Access Key
  var apiUrl = 'https://api.unsplash.com/photos/random';

  // You can customize the query parameters as needed
  var queryParams = {
    query: 'sky',
    client_id: accessKey,
  };

  // Construct the URL with query parameters
  var urlWithParams = `${apiUrl}?${new URLSearchParams(queryParams)}`;

  fetch(urlWithParams)
      .then(response => response.json())
      .then(data => {
        // Log or use the data as needed
        console.log('Unsplash Image Data:', data);

        // Here, you can handle the data, such as updating the background image
        updateBackgroundImage(data.urls.regular);
      })
      .catch(error => console.error('Error fetching Unsplash image:', error));
}

function updateBackgroundImage(imageUrl) {
  // Example: Set the background image of a container with ID 'background-container'
  var backgroundImageContainer = document.getElementById('background-container');

  // Apply smooth transition
  backgroundImageContainer.style.transition = 'background-image 0.5s ease-in-out';

  // Set the new background image
  backgroundImageContainer.style.backgroundImage = `url(${imageUrl})`;
  backgroundImageContainer.style.backgroundSize = 'cover';
  backgroundImageContainer.style.backgroundPosition = 'center';
  // backgroundImageContainer.style.backgroundRepeat = 'no-repeat';
}

// Change the background every hour
setInterval(fetchUnsplashImage, 3600000); // 3600000 milliseconds = 1 hour