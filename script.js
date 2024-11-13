// Fetch departments 
function show(contentTitle) {
  document.getElementById('header1').innerHTML = `<p> ${contentTitle}</p>`;
}
function fetchDepartments(context) {
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
  document.getElementById('resources-list').classList.remove('hidden');
  fetch(`http://localhost:3000/api/resources/${courseId}`)
    .then(response => response.json())
    .then(resources => {
      const list = document.getElementById('resources-list');
      list.innerHTML = '';
      resources.forEach(resource => {
        const item = document.createElement('li');
        item.textContent = `${resource.name} (${resource.type})`;
        list.appendChild(item);
      });
    });
}

// Fetch notices
function fetchNotices() {
  hideAllLists();
  document.getElementById('notices-list').classList.remove('hidden');
  fetch('http://localhost:3000/api/notices')
    .then(response => response.json())
    .then(notices => {
      const list = document.getElementById('notices-list');
      list.innerHTML = '';
      notices.forEach(notice => {
        const item = document.createElement('li');
        item.textContent = `${notice.title}: ${notice.content}`;
        list.appendChild(item);
      });
    });
}

// Fetch Lost & Found items
function fetchLostAndFound() {
  hideAllLists();
  document.getElementById('lost-and-found-list').classList.remove('hidden');
  fetch('http://localhost:3000/api/lost-and-found')
    .then(response => response.json())
    .then(items => {
      const list = document.getElementById('lost-and-found-list');
      list.innerHTML = '';
      items.forEach(item => {
        const itemElement = document.createElement('li');
        itemElement.textContent = `${item.item_name}: ${item.description}`;
        list.appendChild(itemElement);
      });
    });
}

// Hide all lists
function hideAllLists() {
  const lists = document.querySelectorAll('.item-list');
  lists.forEach(list => list.classList.add('hidden'));
}
