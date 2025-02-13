Frontend files for VolIoT marketing webpage.
Using React.js and TailWind CSS

Current design structure:
Home Page:

- Brief overview of your company.
- Tagline: _TODO_: "Innovating IoT Solutions Tailored to Your Needs."
- Highlight core services (e.g., PCB design, IoT networks, scalable cloud solutions, UI/UX development).
- A call-to-action (CTA) leading to the "Contact Us" page.

About Page:

- History and mission of the company.
- Expertise in IoT solutions.
- Brief bios of the team or key personnel (optional).

Services Page:

Detailed breakdown of offerings:

- PCB design tailored to any IoT application.
- Scalable IoT network solutions on microprocessor platforms.
- Cloud-based command centers and analytics dashboards.
- Bespoke user interfaces for apps and websites.
- Case studies or project highlights (optional).

Contact Us Page:

A form for clients to provide:

- Name, email, phone number.
- Nature of inquiry (drop-down or text field).
- Details about the service they’re seeking.
- A "Thank You" confirmation message upon submission.

Development in VSCode notes:
Extensions:

ES7+ React/Redux/React-Native snippets
Author: dsznajder
Provides handy code snippets for React, Redux, and React Native.
Speeds up development with shortcuts like rafce for creating a React functional component with export.

Tailwind CSS IntelliSense
Author: Tailwind Labs
Offers autocompletion and linting for Tailwind classes.
Highlights errors in class names and shows documentation for utility classes on hover.

Prettier - Code Formatter
Author: Prettier
Ensures consistent formatting across your JavaScript, React, and CSS files.
Automatically formats files on save.

HTML CSS Support
Author: ecmel
Provides better CSS class autocompletion in JSX files.
Complements Tailwind CSS IntelliSense.

Used terminal to generate react boilerplate.

```
cd company-webpage/front-end
npx create-react-app .  # Create a React app in the current folder
```

Then integrate Tailwind CSS

```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```
