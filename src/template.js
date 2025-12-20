export function renderTemplate(t, config) {
    return `
    <canvas id="bg-canvas"></canvas>
    <header>
        <nav class="container">
            <div class="logo">root@adam:~$ <span class="cursor">_</span></div>
            <ul class="nav-links">
                <li><a href="#about">${t.nav.about}</a></li>
                <li><a href="#skills">${t.nav.skills}</a></li>
                <li><a href="#projects">${t.nav.projects}</a></li>
                <li><a href="#contact">${t.nav.contact}</a></li>
            </ul>
            <div class="mobile-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    </header>

    <main>
        <section id="hero" class="container">
            <div class="hero-content">
                <p class="prompt">${t.hero.prompt}</p>
                <h1 class="glitch" data-text="${config.name}">${config.name}</h1>
                <h2 class="subtitle">${t.hero.subtitle}</h2>
                <div class="cta-group">
                    <a href="#about" class="btn primary">${t.hero.ctaPrimary}</a>
                    <a href="#contact" class="btn secondary">${t.hero.ctaSecondary}</a>
                </div>
            </div>
        </section>

        <section id="about" class="container section">
            <h2 class="section-title">${t.about.title}</h2>
            <div class="content-block">
<div class="rich-text">${t.about.content}</div>
                <div class="about-actions" style="margin-top: 1.5rem;">
                    <a href="${config.cvPath}" class="btn secondary" download>${t.contact.downloadCv}</a>
                </div>
            </div>
        </section>

        <section id="skills" class="container section">
            <h2 class="section-title">${t.skills.title}</h2>
            <div class="skills-grid">
                ${config.skills.map(category => `
                <div class="skill-category">
                    <h3>${category.title_fr}</h3>
                    <ul>
                        ${category.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                `).join('')}
            </div>
        </section>

        <section id="education" class="container section">
            <h2 class="section-title">${t.education.title}</h2>
            <div class="content-block">
                <ul class="education-list">
                    ${config.formations.map(item => `<li><span class="prompt">></span> ${item.text_fr}</li>`).join('')}
                </ul>
            </div>
        </section>

        <section id="projects" class="container section">
            <h2 class="section-title">${t.projects.title}</h2>
            <div class="projects-grid">
                ${config.projects.map(project => `
                <article class="project-card">
                    <div class="card-header">
                        <span class="folder-icon">${project.icon}</span>
                        <h3>${project.title_fr}</h3>
                    </div>
                    <p>${project.description_fr}</p>
                    
                    ${project.details_fr ? `
                    <ul class="project-details">
                        ${project.details_fr.map(detail => `
                            <li><strong>${detail.label}</strong> : ${detail.value}</li>
                        `).join('')}
                    </ul>
                    ` : ''}

                    <div class="tags">
                        ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                </article>
                `).join('')}
            </div>
        </section>

        ${config.futureProjects && config.futureProjects.length > 0 ? `
        <section id="future-projects" class="container section">
            <h2 class="section-title">${t.projects.futureTitle || '> todo --list'}</h2>
            <div class="projects-grid">
                ${config.futureProjects.map(project => `
                <article class="project-card future-card">
                    <div class="card-header">
                        <h3>${project.title_fr}</h3>
                    </div>
                    <p>${project.description_fr}</p>
                </article>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <section id="contact" class="container section">
            <h2 class="section-title">${t.contact.title}</h2>
            <div class="contact-wrapper">
                <p>${t.contact.text}</p>
                <a href="mailto:${config.email}" class="email-link">${config.email}</a>
                <div class="social-links">
                    <a href="${config.social.github}" target="_blank">GitHub</a>
                    <a href="${config.social.linkedin}" target="_blank">LinkedIn</a>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>${t.footer.status} <span class="status-online">${t.footer.statusText}</span></p>
            <p>© ${config.copyrightYear} ${config.name}. ${t.footer.copyright}</p>
        </div>
    </footer>
    <button id="scroll-to-top" aria-label="Retour en haut">↑</button>
    `;
}
