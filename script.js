
const menuToggle = document.querySelector('.menu-toggle');
const siteMenu = document.querySelector('#site-menu');
const filterButtons = document.querySelectorAll('.filter');
const jobCards = document.querySelectorAll('.job-card');

if (menuToggle && siteMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = siteMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const selected = button.dataset.filter;
        filterButtons.forEach((item) => item.classList.toggle('active', item === button));
        jobCards.forEach((card) => {
            const categories = card.dataset.category.split(' ');
            card.hidden = selected !== 'all' && !categories.includes(selected);
        });
    });
});

const form = document.querySelector('#cv-form');
const preview = document.querySelector('#cv-preview');

const fallback = {
    name: 'Your Name',
    role: 'Target Role',
    contact: 'email@example.com · +1 555 000 0000 · City, Country',
    summary: 'Write a short professional summary that introduces your strengths, experience, and career goals.',
    experience: 'Add recent roles, achievements, and measurable results.',
    education: 'Add your degree, school, training, or relevant coursework.',
    projects: 'Add certificates, portfolio projects, or volunteer experience.',
};

const sample = {
    name: 'Jordan Taylor',
    role: 'Administrative Assistant',
    email: 'jordan.taylor@email.com',
    phone: '+1 555 248 0198',
    location: 'Atlanta, GA',
    summary: 'Organized administrative professional with 4+ years of experience coordinating schedules, supporting teams, and improving office workflows.',
    skills: 'Calendar management, Microsoft Office, Customer service, Data entry, Travel booking, Reporting',
    experience: 'BrightPath Services — Administrative Assistant (2022–Present)\n• Coordinate calendars and meetings for a 12-person operations team\n• Reduced document retrieval time by creating a shared digital filing system\n• Prepare weekly reports, purchase orders, and client communications\n\nNorthside Clinic — Front Desk Associate (2020–2022)\n• Welcomed 60+ visitors daily and handled phone, email, and appointment requests\n• Maintained accurate patient records while following privacy procedures',
    education: 'Associate Degree in Business Administration — Atlanta Technical College',
    projects: 'Certified Administrative Professional preparation course\nVolunteer resume reviewer for local career fair',
};

function getValue(id) {
    return form.elements[id].value.trim();
}

function setText(selector, value, defaultText) {
    preview.querySelector(selector).textContent = value || defaultText;
}

function updatePreview() {
    const contact = [getValue('email'), getValue('phone'), getValue('location')].filter(Boolean).join(' · ');
    const skills = getValue('skills').split(',').map((skill) => skill.trim()).filter(Boolean);
    const skillList = preview.querySelector('[data-preview="skills"]');

    setText('[data-preview="name"]', getValue('name'), fallback.name);
    setText('[data-preview="role"]', getValue('role'), fallback.role);
    setText('[data-preview="contact"]', contact, fallback.contact);
    setText('[data-preview="summary"]', getValue('summary'), fallback.summary);
    setText('[data-preview="experience"]', getValue('experience'), fallback.experience);
    setText('[data-preview="education"]', getValue('education'), fallback.education);
    setText('[data-preview="projects"]', getValue('projects'), fallback.projects);

    skillList.replaceChildren(...(skills.length ? skills : ['Communication', 'Problem solving', 'Teamwork']).map((skill) => {
        const item = document.createElement('li');
        item.textContent = skill;
        return item;
    }));
}

function fillForm(values) {
    Object.entries(values).forEach(([key, value]) => {
        if (form.elements[key]) {
            form.elements[key].value = value;
        }
    });
    updatePreview();
}

form.addEventListener('input', updatePreview);

document.querySelector('#load-sample').addEventListener('click', () => fillForm(sample));

document.querySelector('#clear-form').addEventListener('click', () => {
    form.reset();
    updatePreview();
});

document.querySelector('#print-cv').addEventListener('click', () => {
    document.body.classList.add('printing');
    window.print();
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

updatePreview();
