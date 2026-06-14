// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// Fade-up on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Clinic data
const clinicsData = {
  'Western Area': [
    { name: 'Connaught Hospital', addr: 'Wallace Johnson Street, Freetown', tag: 'Referral Hospital' },
    { name: 'Rokupa Government Hospital', addr: 'Rokupa, East Freetown', tag: 'Government Hospital' },
    { name: 'Lumley Government Hospital', addr: 'Lumley, West Freetown', tag: 'Government Hospital' },
    { name: 'Waterloo Community Health Centre', addr: 'Waterloo, Rural Western', tag: 'CHC' },
  ],
  'Bo': [
    { name: 'Bo Government Hospital', addr: 'Hospital Road, Bo Town', tag: 'Government Hospital' },
    { name: 'Serabu Hospital', addr: 'Serabu, Bo District', tag: 'Mission Hospital' },
    { name: 'Bo District PHU Network', addr: 'Multiple locations, Bo District', tag: 'PHU' },
  ],
  'Kenema': [
    { name: 'Kenema Government Hospital', addr: 'Combema Road, Kenema', tag: 'Government Hospital' },
    { name: 'Nixon Memorial Hospital', addr: 'Segbwema, Kenema District', tag: 'Mission Hospital' },
  ],
  'Kono': [
    { name: 'Koidu Government Hospital', addr: 'Koidu Town, Kono', tag: 'Government Hospital' },
    { name: 'Kono District Health Management', addr: 'Koidu, Kono District', tag: 'DHMT Office' },
  ],
  'Bombali': [
    { name: 'Makeni Government Hospital', addr: 'Makeni, Bombali District', tag: 'Government Hospital' },
    { name: 'Holy Spirit Hospital', addr: 'Makeni, Bombali', tag: 'Mission Hospital' },
  ],
  'Tonkolili': [
    { name: 'Magburaka Government Hospital', addr: 'Magburaka Town, Tonkolili', tag: 'Government Hospital' },
  ],
  'Koinadugu': [
    { name: 'Kabala Government Hospital', addr: 'Kabala Town, Koinadugu', tag: 'Government Hospital' },
  ],
  'Kailahun': [
    { name: 'Kailahun Government Hospital', addr: 'Kailahun Town', tag: 'Government Hospital' },
  ],
  'Pujehun': [
    { name: 'Pujehun Government Hospital', addr: 'Pujehun Town', tag: 'Government Hospital' },
  ],
  'Moyamba': [
    { name: 'Moyamba Government Hospital', addr: 'Moyamba Town', tag: 'Government Hospital' },
    { name: 'Hatfield Archer Memorial Hospital', addr: 'Rotifunk, Moyamba', tag: 'Mission Hospital' },
  ],
};

function showClinics(district) {
  document.querySelectorAll('.district-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.trim().includes(district));
  });
  const results = document.getElementById('clinicResults');
  const list = document.getElementById('clinicList');
  const title = document.getElementById('clinicResultTitle');
  const sub = document.getElementById('clinicResultSub');
  const facilities = clinicsData[district] || [];
  title.textContent = 'Health Facilities in ' + district;
  sub.textContent = facilities.length + ' verified facilities found';
  list.innerHTML = facilities.map(f =>
    '<div class="clinic-item"><h4><i class="fa-solid fa-hospital"></i> ' + f.name + '</h4><p><i class="fa-solid fa-location-dot"></i> ' + f.addr + '</p><span class="tag">' + f.tag + '</span></div>'
  ).join('');
  results.classList.add('show');
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function submitForm() {
  const fname = document.getElementById('fname').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const district = document.getElementById('district').value;
  const service = document.getElementById('service').value;
  if (!fname || !phone || !district || !service) {
    alert('Please fill in all required fields marked with *');
    return;
  }
  document.getElementById('form-success').style.display = 'block';
  const btn = document.querySelector('.form-submit');
  btn.disabled = true;
  btn.textContent = 'Submitted \u2713';
  btn.style.background = 'var(--green2)';
}
