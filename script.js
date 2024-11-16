// Navigation history stack
const historyStack = [];

// Fetch departments 
function show(contentTitle) {
  document.getElementById('header1').innerHTML = `<p> ${contentTitle}</p>`;
}

function fetchDepartments(context) {
  // Add current context to history
  historyStack.push(() => fetchDepartments(context));
  
  hideAllLists();
  show(context);
  document.getElementById('departments-list').classList.remove('hidden');
  fetch('http://localhost:3000/api/departments')
    .then(response => response.json())
    .then(departments => {
      const list = document.getElementById('departments-list');
      list.innerHTML = '';
      departments.forEach(department => {
        const item = document.createElement('li');
        item.textContent = department.name;
        item.onclick = () => fetchIntakes(department.id);
        list.appendChild(item);
      });
    });
}

// Fetch intakes for a specific department
function fetchIntakes(departmentId) {
  // Add current context to history
  historyStack.push(() => fetchIntakes(departmentId));
  
  hideAllLists();
  document.getElementById('intakes-list').classList.remove('hidden');
  fetch(`http://localhost:3000/api/intakes/${departmentId}`)
    .then(response => response.json())
    .then(intakes => {
      const list = document.getElementById('intakes-list');
      list.innerHTML = '';
      intakes.forEach(intake => {
        const item = document.createElement('li');
        item.textContent = intake.name;
        item.onclick = () => fetchSections(intake.id);
        list.appendChild(item);
      });
    });
}

// Fetch sections for a specific intake
function fetchSections(intakeId) {
  // Add current context to history
  historyStack.push(() => fetchSections(intakeId));
  
  hideAllLists();
  document.getElementById('sections-list').classList.remove('hidden');
  fetch(`http://localhost:3000/api/sections/${intakeId}`)
    .then(response => response.json())
    .then(sections => {
      const list = document.getElementById('sections-list');
      list.innerHTML = '';
      sections.forEach(section => {
        const item = document.createElement('li');
        item.textContent = section.name;
        item.onclick = () => fetchCourses(section.id);
        list.appendChild(item);
      });
    });
}

// Fetch courses for a specific section
function fetchCourses(sectionId) {
  // Add current context to history
  historyStack.push(() => fetchCourses(sectionId));
  
  hideAllLists();
  document.getElementById('courses-list').classList.remove('hidden');
  fetch(`http://localhost:3000/api/courses/${sectionId}`)
    .then(response => response.json())
    .then(courses => {
      const list = document.getElementById('courses-list');
      list.innerHTML = '';
      courses.forEach(course => {
        const item = document.createElement('li');
        item.textContent = course.name;
        item.onclick = () => fetchResources(course.id);
        list.appendChild(item);
      });
    });
}

// Fetch resources for a specific course
function fetchResources(courseId) {
  hideAllLists();
  document.getElementById('resources-section').classList.remove('hidden');

  fetch(`http://localhost:3000/api/resources/${courseId}`)
      .then(response => response.json())
      .then(resources => {
          const list = document.getElementById('courses');
          list.innerHTML = ''; // Clear previous content

          if (resources.length === 0) {
              list.innerHTML = '<p>No resources available for this course.</p>';
          } else {
              resources.forEach(resource => {
                  const item = document.createElement('div');
                  item.classList.add('resource-item'); // Optional: Add a class for styling

                  // Check if the resource is an image
                  if (resource.file_path && isImageFile(resource.file_path)) {
                      const fileUrl = `http://localhost:3000${resource.file_path}`;
                      
                      // Create a link to open the image in a new tab
                      const fileLink = document.createElement('a');
                      fileLink.href = fileUrl; // Set the link to the image file
                      fileLink.target = '_blank'; // Open the link in a new tab

                      // Create the image element
                      const img = document.createElement('img');
                      img.src = fileUrl; // Set image source
                      img.alt = resource.title;
                      img.classList.add('thumbnail'); // Optional: Add a class for styling
                      
                      // Append the image to the link
                      fileLink.appendChild(img);
                      
                      // Append the link (containing the image) to the item
                      item.appendChild(fileLink);
                  } else if (resource.file_path) {
                      // For non-image files (e.g., PDFs, Text)
                      const fileLink = document.createElement('a');
                      fileLink.href = `http://localhost:3000${resource.file_path}`;
                      fileLink.textContent = `${resource.title} (${resource.type})`;
                      fileLink.target = '_blank';
                      item.appendChild(fileLink);
                  }

                  list.appendChild(item);
              });
          }

          // Show upload form
          document.getElementById('upload-section').classList.remove('hidden');
          document.getElementById('upload-form').onsubmit = (e) => {
              e.preventDefault();
              uploadResource(courseId);
          };
      })
      .catch(error => console.error("Error fetching resources:", error)); // Log any errors
}

// Function to check if the file is an image
function isImageFile(filePath) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const fileExtension = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
  return imageExtensions.includes(fileExtension);
}





// Upload a resource
function uploadResource(courseId) {
  // Prevent the default form submission behavior
  const title = document.getElementById('resource-title').value;
  const type = document.getElementById('resource-type').value;
  const file = document.getElementById('file-upload').files[0];

  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('type', type);

  fetch(`http://localhost:3000/api/resources/${courseId}/upload`, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(() => {
    fetchResources(courseId); // Refresh the resources after upload
  })
  .catch(error => console.error('Error uploading resource:', error));

  // Prevent the form from refreshing the page
  return false; // Ensure the form does not reload the page
}

// Back button function with multi-step navigation
function goBack(steps = 1) {
  while (steps > 0 && historyStack.length > 1) {
    // Remove the current view from history
    historyStack.pop();
    steps--;
  }
  // Navigate to the last saved view
  const previousView = historyStack[historyStack.length - 1];
  previousView();
}

// Hide all lists
function hideAllLists() {
  const lists = document.querySelectorAll('.item-list');
  lists.forEach(list => list.classList.add('hidden'));
}
