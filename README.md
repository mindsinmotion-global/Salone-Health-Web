# SaloneHealth – Sierra Leone Health Services

SaloneHealth is a responsive, single-page health services website designed to connect Sierra Leonean citizens across all 16 districts to essential healthcare resources, real-time health alerts, and verified medical facilities.

## Purpose

Sierra Leone faces significant health challenges including limited facility access in rural areas and recurring disease outbreaks. SaloneHealth aims to bridge this gap by providing a centralized digital platform where citizens can:

- Discover nearby health facilities by district
- Stay informed with live health alerts and advisories
- Register for free health updates
- Book appointments at verified clinics and hospitals

## Features

- **Service Directory** – Highlights six core health services: Maternal & Child Health, Primary Care & Medication, Disease Testing & Lab, Mental Health Support, Emergency & Ambulance, and Health Education.
- **About Section** – Provides background on SaloneHealth's mission, key achievements (98% patient satisfaction, 50k+ patients helped), and partnership with the Ministry of Health & Sanitation.
- **Health Alerts** – Displays live health advisories with severity indicators (green/gold/red) covering disease outbreaks, vaccination drives, blood donation campaigns, and seasonal health tips.
- **Find a Clinic** – Interactive district selector covering 10 major districts. Clicking a district dynamically displays verified health facilities with names, addresses, and facility type tags.
- **Contact & Registration** – Patient registration form with fields for name, phone, email, district, service needed, and additional information. Includes form validation and success feedback.
- **Emergency Bar** – Persistent top bar with the national health emergency hotline (117).
- **Responsive Design** – Mobile-first layout with a hamburger menu, adaptive grids, and optimized typography for all screen sizes.
- **Scroll Animations** – Fade-up reveal animations triggered by an Intersection Observer as sections enter the viewport.

## Tech Stack

- **HTML5** – Semantic markup and accessible structure
- **CSS3** – Custom properties (CSS variables), Flexbox, CSS Grid, media queries, keyframe animations, and backdrop-filter effects
- **JavaScript (Vanilla)** – DOM manipulation, Intersection Observer API, dynamic content rendering, and form handling
- **Font Awesome 6** – Icon library loaded via CDN for scalable vector icons throughout the UI
- **Google Fonts** – Playfair Display (headings) and DM Sans (body text)

## Project Structure

```
web-design/
├── index.html      # Main HTML page
├── styles.css      # All styles (layout, components, responsive)
├── script.js       # Interactivity (navbar, clinics, form, animations)
└── README.md       # Project documentation
```

## How to Run

1. Open `index.html` in any modern web browser.
2. No build tools or server required – it's a static site.
3. An internet connection is needed to load Google Fonts, Font Awesome icons, and Unsplash images.

## Districts Covered

Western Area, Bo, Kenema, Kono, Bombali, Tonkolili, Koinadugu, Kailahun, Pujehun, and Moyamba.

## Credits

- **University**: Limkokwing University ICT Project
- **Partner**: Ministry of Health & Sanitation, Sierra Leone
- **Icons**: [Font Awesome](https://fontawesome.com/)
- **Fonts**: [Google Fonts](https://fonts.google.com/)
- **Images**: [Unsplash](https://unsplash.com/)
