/**
 * ─────────────────────────────────────────────────────────────────
 *  Smart Event Portal — Database Seed Script
 *  Usage:  node seed.js           → inserts data
 *          node seed.js --destroy → wipes all data cleanly
 * ─────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── Models ────────────────────────────────────────────────────────
const User = require('./src/models/User');
const Event = require('./src/models/Event');
const Registration = require('./src/models/Registration');

// ─────────────────────────────────────────────────────────────────
//  UNSPLASH SOURCE URLS
//  format: https://source.unsplash.com/{width}x{height}/?{keyword}
//  No API key needed. Each URL resolves to a real, relevant photo.
// ─────────────────────────────────────────────────────────────────
const img = (keyword) =>
  `https://source.unsplash.com/800x400/?${encodeURIComponent(keyword)}`;

// ─────────────────────────────────────────────────────────────────
//  USERS SEED DATA
// ─────────────────────────────────────────────────────────────────
const usersData = [
  // ── Admin ──────────────────────────────────────────────────────
  {
    name: 'Arjun Sharma',
    email: 'admin@eventportal.com',
    password: 'Admin@123',
    role: 'admin',
  },
  // ── Regular Users ─────────────────────────────────────────────
  {
    name: 'Priya Nair',
    email: 'priya@example.com',
    password: 'User@123',
    role: 'user',
  },
  {
    name: 'Rahul Mehta',
    email: 'rahul@example.com',
    password: 'User@123',
    role: 'user',
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha@example.com',
    password: 'User@123',
    role: 'user',
  },
  {
    name: 'Vikram Patel',
    email: 'vikram@example.com',
    password: 'User@123',
    role: 'user',
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya@example.com',
    password: 'User@123',
    role: 'user',
  },
];

// ─────────────────────────────────────────────────────────────────
//  EVENTS SEED DATA  (imageUrl uses Unsplash source URLs)
// ─────────────────────────────────────────────────────────────────
const getEventsData = (adminId) => [
  {
    title: 'India Tech Summit 2025',
    description:
      'The biggest annual technology conference in India bringing together 2000+ developers, designers, and startup founders. Sessions cover AI/ML, cloud-native architecture, open-source, and the future of work. Keynotes from leading CTOs across Asia.',
    location: 'Bangalore International Exhibition Centre, Bangalore',
    date: new Date('2025-08-15T09:00:00.000Z'),
    capacity: 2000,
    imageUrl: img('technology conference india'),
    createdBy: adminId,
  },
  {
    title: 'Design Thinking Workshop',
    description:
      'A full-day hands-on workshop led by award-winning UX practitioners. Learn human-centred design, rapid prototyping, and how to run effective design sprints. Participants will solve a real product challenge. Limited to 60 seats for maximum engagement.',
    location: 'The Design Hub, Koramangala, Bangalore',
    date: new Date('2025-07-20T10:00:00.000Z'),
    capacity: 60,
    imageUrl: img('design workshop creative'),
    createdBy: adminId,
  },
  {
    title: 'Startup Pitch Night — Season 4',
    description:
      'Ten early-stage startups pitch live to a panel of top VCs and angel investors. Open to the public — come watch, network, and maybe even meet your next co-founder. Networking drinks and snacks provided. Previous seasons funded 14 companies.',
    location: 'WeWork Galaxy, MG Road, Bangalore',
    date: new Date('2025-07-05T18:00:00.000Z'),
    capacity: 300,
    imageUrl: img('startup pitch night investors'),
    createdBy: adminId,
  },
  {
    title: 'Full-Stack Hackathon 48hrs',
    description:
      'Build something real in 48 hours. Solo or teams of up to 4. Themes announced at kickoff. Prizes worth ₹5,00,000 across 5 categories including Best UI, Most Innovative API, and Best Social Impact. Meals, WiFi, and cloud credits included.',
    location: 'T-Hub Innovation Campus, Hyderabad',
    date: new Date('2025-09-06T09:00:00.000Z'),
    capacity: 400,
    imageUrl: img('hackathon coding laptops'),
    createdBy: adminId,
  },
  {
    title: 'Women in Tech Leadership Forum',
    description:
      'A curated forum celebrating and empowering women in technology and leadership. Panel discussions, mentorship circles, and 1:1 speed networking with senior leaders from Microsoft, Google, Infosys, and Flipkart. All genders welcome to attend and support.',
    location: 'ITC Grand Chola, Chennai',
    date: new Date('2025-08-02T09:30:00.000Z'),
    capacity: 250,
    imageUrl: img('women leadership technology'),
    createdBy: adminId,
  },
  {
    title: 'Cloud & DevOps Bootcamp',
    description:
      'Intensive 2-day bootcamp covering AWS, Kubernetes, CI/CD pipelines, Infrastructure-as-Code with Terraform, and SRE best practices. Hands-on labs on real cloud environments included. Certification prep material provided. Bring your laptop.',
    location: 'NSIC STP Complex, New Delhi',
    date: new Date('2025-10-10T08:00:00.000Z'),
    capacity: 120,
    imageUrl: img('cloud computing devops servers'),
    createdBy: adminId,
  },
  {
    title: 'AI & Machine Learning Conference',
    description:
      'Two days of deep-dive sessions on applied ML, LLMs, Generative AI, MLOps, and responsible AI. Workshops include fine-tuning open-source models, building RAG pipelines, and deploying ML at scale. Academic and industry speakers from IIT, IISC, and top product companies.',
    location: 'Bombay Exhibition Centre, Mumbai',
    date: new Date('2025-11-22T09:00:00.000Z'),
    capacity: 1500,
    imageUrl: img('artificial intelligence machine learning'),
    createdBy: adminId,
  },
  {
    title: 'Open Source India 2025',
    description:
      'Annual gathering of India\'s open-source community. Talks from maintainers of major OSS projects, contribution sprints, FOSS philosophy sessions, and a career track for developers wanting to build in public. Free to attend — contribute and collaborate.',
    location: 'NIMHANS Convention Centre, Bangalore',
    date: new Date('2025-12-06T10:00:00.000Z'),
    capacity: 800,
    imageUrl: img('open source software community'),
    createdBy: adminId,
  },
  {
    title: 'Product Management Masterclass',
    description:
      'A one-day masterclass with senior PMs from Razorpay, Zepto, and CRED. Topics include discovery frameworks, writing killer PRDs, working with engineers, OKR setting, and navigating growth-stage chaos. Includes a live product critique session with real apps.',
    location: 'Taj Lands End, Bandra, Mumbai',
    date: new Date('2025-07-26T09:00:00.000Z'),
    capacity: 100,
    imageUrl: img('product management workshop team'),
    createdBy: adminId,
  },
  {
    title: 'Cybersecurity & Ethical Hacking Summit',
    description:
      'India\'s premier cybersecurity event — capture-the-flag competitions, zero-day vulnerability discussions, live hacking demos, and policy panels on digital privacy. Students, professionals, and researchers all welcome. Organised with CERT-In collaboration.',
    location: 'Hitex Exhibition Centre, Hyderabad',
    date: new Date('2025-09-19T10:00:00.000Z'),
    capacity: 600,
    imageUrl: img('cybersecurity hacking digital'),
    createdBy: adminId,
  },
];

// ─────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────
const log = {
  info: (msg) => console.log(`  ℹ️  ${msg}`),
  success: (msg) => console.log(`  ✅ ${msg}`),
  warn: (msg) => console.log(`  ⚠️  ${msg}`),
  error: (msg) => console.error(`  ❌ ${msg}`),
  divider: () => console.log('  ' + '─'.repeat(55)),
};

// ─────────────────────────────────────────────────────────────────
//  SEED FUNCTION
// ─────────────────────────────────────────────────────────────────
const seed = async () => {
  console.log('\n🌱  Smart Event Portal — Seed Script\n');
  log.divider();

  // ── Connect ───────────────────────────────────────────────────
  log.info('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  log.success(`Connected: ${mongoose.connection.host}`);
  log.divider();

  // ── Destroy mode ──────────────────────────────────────────────
  if (process.argv.includes('--destroy')) {
    log.warn('--destroy flag detected. Wiping all collections...');
    await Promise.all([
      User.deleteMany({}),
      Event.deleteMany({}),
      Registration.deleteMany({}),
    ]);
    log.success('All data cleared. Database is now empty.');
    await mongoose.disconnect();
    console.log('\n👋  Done.\n');
    process.exit(0);
  }

  // ── Clear existing data before re-seeding ─────────────────────
  log.info('Clearing existing seed data...');
  await Promise.all([
    User.deleteMany({}),
    Event.deleteMany({}),
    Registration.deleteMany({}),
  ]);
  log.success('Existing data cleared.');
  log.divider();

  // ── Seed Users ────────────────────────────────────────────────
  log.info(`Seeding ${usersData.length} users...`);

  // Hash passwords manually (pre-save hook only runs on .save(), not insertMany)
  const hashedUsers = await Promise.all(
    usersData.map(async (u) => {
      const salt = await bcrypt.genSalt(12);
      return { ...u, password: await bcrypt.hash(u.password, salt) };
    })
  );

  const createdUsers = await User.insertMany(hashedUsers);
  const admin = createdUsers.find((u) => u.role === 'admin');
  const regularUsers = createdUsers.filter((u) => u.role === 'user');

  log.success(`Created ${createdUsers.length} users:`);
  createdUsers.forEach((u) =>
    console.log(`       ${u.role === 'admin' ? '👑' : '👤'} ${u.name} <${u.email}>  [${u.role}]`)
  );
  log.divider();

  // ── Seed Events ───────────────────────────────────────────────
  const eventsData = getEventsData(admin._id);
  log.info(`Seeding ${eventsData.length} events with Unsplash images...`);

  const createdEvents = await Event.insertMany(eventsData);

  log.success(`Created ${createdEvents.length} events:`);
  createdEvents.forEach((e, i) =>
    console.log(`       📅 [${i + 1}] ${e.title}`)
  );
  log.divider();

  // ── Seed Registrations (realistic spread) ─────────────────────
  log.info('Seeding sample registrations...');

  const registrationPairs = [
    // Priya registers for 3 events
    { user: regularUsers[0], event: createdEvents[0] },
    { user: regularUsers[0], event: createdEvents[1] },
    { user: regularUsers[0], event: createdEvents[6] },
    // Rahul registers for 2 events
    { user: regularUsers[1], event: createdEvents[0] },
    { user: regularUsers[1], event: createdEvents[3] },
    // Sneha registers for 4 events
    { user: regularUsers[2], event: createdEvents[1] },
    { user: regularUsers[2], event: createdEvents[4] },
    { user: regularUsers[2], event: createdEvents[8] },
    { user: regularUsers[2], event: createdEvents[9] },
    // Vikram registers for 2 events
    { user: regularUsers[3], event: createdEvents[2] },
    { user: regularUsers[3], event: createdEvents[5] },
    // Ananya registers for 3 events
    { user: regularUsers[4], event: createdEvents[4] },
    { user: regularUsers[4], event: createdEvents[6] },
    { user: regularUsers[4], event: createdEvents[7] },
  ];

  const registrations = registrationPairs.map(({ user, event }) => ({
    user: user._id,
    event: event._id,
    registeredAt: new Date(),
  }));

  await Registration.insertMany(registrations);
  log.success(`Created ${registrations.length} registrations across ${regularUsers.length} users.`);
  log.divider();

  // ── Summary ───────────────────────────────────────────────────
  console.log('\n🎉  Seed complete! Here\'s your quick-access cheatsheet:\n');
  console.log('  ┌─────────────────────────────────────────────────────┐');
  console.log('  │                   LOGIN CREDENTIALS                  │');
  console.log('  ├──────────────────────┬──────────────┬───────────────┤');
  console.log('  │ Email                │ Password     │ Role          │');
  console.log('  ├──────────────────────┼──────────────┼───────────────┤');
  console.log('  │ admin@eventportal.com│ Admin@123    │ 👑 admin      │');
  console.log('  │ priya@example.com    │ User@123     │ 👤 user       │');
  console.log('  │ rahul@example.com    │ User@123     │ 👤 user       │');
  console.log('  │ sneha@example.com    │ User@123     │ 👤 user       │');
  console.log('  │ vikram@example.com   │ User@123     │ 👤 user       │');
  console.log('  │ ananya@example.com   │ User@123     │ 👤 user       │');
  console.log('  └──────────────────────┴──────────────┴───────────────┘');
  console.log('\n  📸  Event images: Unsplash source URLs (no API key needed)');
  console.log('  🔗  Each imageUrl auto-resolves to a relevant real photo');
  console.log('\n  Run your server:  npm run dev');
  console.log('  Health check:     GET http://localhost:5000/api/health\n');

  await mongoose.disconnect();
  process.exit(0);
};

// ─────────────────────────────────────────────────────────────────
seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
