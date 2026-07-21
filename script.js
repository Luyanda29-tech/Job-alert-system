const root = document.documentElement;
const menuToggle = document.querySelector('.menu-toggle');
const siteMenu = document.querySelector('#site-menu');
const themeToggle = document.querySelector('.theme-toggle');
const authModal = document.querySelector('#auth-modal');
const authButtons = document.querySelectorAll('.open-auth');
const form = document.querySelector('#cv-form');
const preview = document.querySelector('#cv-preview');
const cvScore = document.querySelector('#cv-score');
const atsScore = document.querySelector('#ats-score');
const missingKeywords = document.querySelector('#missing-keywords');
const aiOutput = document.querySelector('#ai-output');
const toolCards = document.querySelectorAll('.tool-card');
const templateFilters = document.querySelectorAll('.template-filter');
const templateCards = document.querySelectorAll('.template-card');
const jobSearch = document.querySelector('#job-search');
const jobLocation = document.querySelector('#job-location');
const jobType = document.querySelector('#job-type');
const jobCards = document.querySelectorAll('.job-card');

const fallback = {
    name: 'Your Name',
    role: 'Target Role',
    contact: 'email@example.com · +1 555 000 0000 · City, Country',
    summary: 'Add a short summary to introduce your value.',
    experience: 'Add your most relevant experience and results.',
    education: 'Add education, training, or coursework.',
    projects: 'Add certificates, projects, or volunteer work.',
};

const sample = {
    name: 'Jordan Taylor',
    role: 'Administrative Assistant',
    email: 'jordan.taylor@email.com',
    phone: '+1 555 248 0198',
    location: 'Atlanta, GA',
    'job-keywords': 'calendar management, CRM, reporting, stakeholder communication',
    summary: 'Organized administrative professional with 4+ years of experience coordinating schedules, supporting teams, and improving office workflows.',
    skills: 'Calendar management, Microsoft Office, Customer service, CRM, Data entry, Reporting',
    experience: 'BrightPath Services — Administrative Assistant (2022–Present)\n• Coordinate calendars and meetings for a 12-person operations team\n• Reduced document retrieval time by creating a shared digital filing system\n• Prepare weekly reports, purchase orders, and client communications\n\nNorthside Clinic — Front Desk Associate (2020–2022)\n• Welcomed 60+ visitors daily and handled phone, email, and appointment requests\n• Maintained accurate records while following privacy procedures',
    education: 'Associate Degree in Business Administration — Atlanta Technical College',
    projects: 'Certified Administrative Professional preparation course\nVolunteer resume reviewer for local career fair',
};

const aiResponses = {
    summary: 'AI draft: Detail-oriented operations professional with proven experience coordinating teams, improving workflows, and delivering accurate reporting in fast-paced environments.',
    experience: 'Improved bullet: Streamlined weekly reporting by consolidating data sources, reducing manual preparation time and improving leadership visibility into team performance.',
    skills: 'Suggested skills: Stakeholder communication, CRM administration, workflow optimization, reporting dashboards, calendar management, customer support.',
    interview: 'Interview prep: Prepare STAR stories for conflict resolution, process improvement, handling tight deadlines, and explaining your most measurable achievement.',
};

function getValue(id) {
    return form.elements[id]?.value.trim() || '';
}

function setText(selector, value, defaultText) {
    preview.querySelector(selector).textContent = value || defaultText;
}

function calculateScore() {
    const fields = ['name', 'role', 'email', 'phone', 'location', 'summary', 'skills', 'experience', 'education'];
    const completed = fields.filter((field) => getValue(field).length > 0).length;
    const keywords = getValue('job-keywords').toLowerCase().split(',').map((item) => item.trim()).filter(Boolean);
    const cvText = ['summary', 'skills', 'experience', 'education', 'projects'].map(getValue).join(' ').toLowerCase();
    const matchedKeywords = keywords.filter((keyword) => cvText.includes(keyword));
    const completionScore = Math.round((completed / fields.length) * 70);
    const keywordScore = keywords.length ? Math.round((matchedKeywords.length / keywords.length) * 30) : 10;
    const score = Math.min(100, completionScore + keywordScore);

    cvScore.textContent = `Score ${score}%`;
    atsScore.textContent = `${Math.max(45, score)}%`;
    missingKeywords.textContent = String(Math.max(0, keywords.length - matchedKeywords.length));
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

    calculateScore();
}

function fillForm(values) {
    Object.entries(values).forEach(([key, value]) => {
        if (form.elements[key]) {
            form.elements[key].value = value;
        }
    });
    updatePreview();
}

function filterTemplates(selected) {
    templateFilters.forEach((button) => button.classList.toggle('active', button.dataset.template === selected));
    templateCards.forEach((card) => {
        card.hidden = selected !== 'all' && card.dataset.template !== selected;
    });
}

function filterJobs() {
    const searchTerm = jobSearch.value.trim().toLowerCase();
    const location = jobLocation.value;
    const type = jobType.value;

    jobCards.forEach((card) => {
        const matchesSearch = !searchTerm || card.dataset.text.includes(searchTerm);
        const matchesLocation = location === 'all' || card.dataset.location === location;
        const matchesType = type === 'all' || card.dataset.type === type;
        card.hidden = !(matchesSearch && matchesLocation && matchesType);
    });
}

menuToggle.addEventListener('click', () => {
    const isOpen = siteMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
});

themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    themeToggle.textContent = nextTheme === 'dark' ? '🌙' : '☀️';
});

authButtons.forEach((button) => {
    button.addEventListener('click', () => authModal.showModal());
});

toolCards.forEach((card) => {
    card.addEventListener('click', () => {
        aiOutput.textContent = aiResponses[card.dataset.tool];
    });
});

templateFilters.forEach((button) => {
    button.addEventListener('click', () => filterTemplates(button.dataset.template));
});

[jobSearch, jobLocation, jobType].forEach((control) => {
    control.addEventListener('input', filterJobs);
});

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
