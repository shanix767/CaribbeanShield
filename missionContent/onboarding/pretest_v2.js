// missionContent/onboarding/pretest_v2.js
//
// Pretest/Posttest instrument v2 - 50 items across all six Hurricane Ready
// levels, with NO verbatim overlap with any in-app quiz, checklist, or
// scenario content (across level1.js-level6.js) or with the original
// 16-question pretest.js. Every item here is freshly written to test the
// same underlying knowledge as its source level, using different specific
// facts, numbers, framings, or scenarios than the corresponding in-app
// activity - so a participant who plays through all six levels will not
// encounter these exact items again. This directly addresses the
// practice-effect limitation documented in the evaluation report (the
// original pretest reused 10 of its 16 questions verbatim from Level 1
// gameplay).
//
// Distribution: 8 items each for Levels 1-5, 10 for Level 6 (the
// integrative capstone level, which per its own design note tests
// everything from Levels 1-5 at once rather than introducing new
// material - so it gets slightly more test weight here).
//
// Formats included, per the brief: multiple choice, true/false, checklist
// (select-all-that-apply), and scenario (single best choice) - mirroring
// the four activity types already used in-app (Quiz, Checklist, Scenario),
// so this can be rendered by the same activity-type components in an
// "assessment mode" that suppresses feedback.
//
// IMPORTANT - assessment-mode behaviour (not a data-shape difference):
// unlike normal gameplay, where Quiz/Checklist/Scenario show correctness
// and an explanation immediately, this instrument must NOT reveal
// correctness, the right answer, or `explanation`/`consequenceText` at any
// point during the test. On submitting an answer, route straight to the
// next item. `correctOptionIndex` / `isCorrect` / `isBestChoice` /
// `explanation` / `consequenceText` fields exist here only for scoring
// after the fact (and for your own answer key), not for display. Total
// score = number of items answered correctly, out of 50 - each item is
// worth exactly 1 point. For checklist items, scoring is exact-match only
// (every correct item selected, no incorrect ones selected) = 1 point;
// anything else = 0. This keeps scoring uniform across formats rather than
// giving partial credit on some items and not others.
//
// levelSource / topic fields are metadata for your own analysis (e.g. a
// by-level or by-topic breakdown in Chapter 5) - the test-taker never sees
// them.

export const PRETEST_V2_ITEMS = [

  // ============================== LEVEL 1 ==============================
  // "Know the Storm" - hurricane basics, categories, Watch/Warning, hazards, myths
  {
    id: 'pt2-l1-01',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 1,
    topic: 'Hurricane basics',
    prompt: 'Which of these best describes how a hurricane forms?',
    options: [
      'Cold air sinking rapidly over land',
      'Warm, moist air rising over warm ocean water and releasing heat as it cools',
      'A sudden drop in atmospheric pressure over a mountain range',
      'Cold ocean currents colliding with warm air masses',
    ],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l1-02',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 1,
    topic: 'Wind classification',
    prompt: 'On the Saffir-Simpson scale, what determines a hurricane’s category?',
    options: ['Rainfall total', 'Sustained wind speed', 'Storm diameter', 'Distance travelled'],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l1-03',
    type: 'quiz',
    format: 'true_false',
    levelSource: 1,
    topic: 'Seasonal timing',
    prompt: 'The Atlantic hurricane season runs from June through November.',
    options: ['True', 'False'],
    correctOptionIndex: 0,
  },
  {
    id: 'pt2-l1-04',
    type: 'checklist',
    format: 'select_all',
    levelSource: 1,
    topic: 'Hazard identification',
    prompt: 'Select every hazard that is directly caused by a hurricane.',
    items: [
      { id: 'i1', label: 'Storm surge', isCorrect: true },
      { id: 'i2', label: 'Landslides', isCorrect: true },
      { id: 'i3', label: 'Flying debris', isCorrect: true },
      { id: 'i4', label: 'Volcanic ashfall', isCorrect: false },
      { id: 'i5', label: 'Extended drought', isCorrect: false },
    ],
  },
  {
    id: 'pt2-l1-05',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 1,
    topic: 'Watch vs Warning',
    prompt: 'A Hurricane Warning means hurricane conditions are expected within roughly how long?',
    options: ['12 hours', '24 hours', '36 hours', '60 hours'],
    correctOptionIndex: 2,
  },
  {
    id: 'pt2-l1-06',
    type: 'quiz',
    format: 'true_false',
    levelSource: 1,
    topic: 'Myths',
    prompt: 'Putting tape across a window in an X shape will keep it from shattering in high winds.',
    options: ['True', 'False'],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l1-07',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 1,
    topic: 'Reliable information sources',
    prompt: 'Which of these is the most reliable source for an active hurricane update?',
    options: [
      'A voice note forwarded by a friend',
      'A screenshot circulating on social media',
      'An official Office of Disaster Management (ODM) bulletin',
      'A neighbour’s guess based on the sky outside',
    ],
    correctOptionIndex: 2,
  },
  {
    id: 'pt2-l1-08',
    type: 'scenario',
    format: 'best_choice',
    levelSource: 1,
    topic: 'Category 1 risk perception',
    situationText:
      'A storm has been downgraded to a Category 1 hurricane just before making landfall near your community. A neighbour says there’s nothing to worry about now. What is the most accurate response?',
    choices: [
      { id: 'c1', text: 'Agree - Category 1 storms are not dangerous', isBestChoice: false },
      { id: 'c2', text: 'Point out that even a Category 1 hurricane can still damage roofs, snap branches, and cause power outages, so preparation still matters', isBestChoice: true },
      { id: 'c3', text: 'Say that only Category 4 and 5 storms cause any real damage', isBestChoice: false },
    ],
  },

  // ============================== LEVEL 2 ==============================
  // "Personal Preparedness" - go bag vs home kit, documents, medication, route
  {
    id: 'pt2-l2-01',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 2,
    topic: 'Go bag vs home kit',
    prompt: 'What is the main practical difference between a go bag and a home emergency kit?',
    options: [
      'There is no real difference between them',
      'A go bag is meant to be light and portable for quick departure; a home kit can be bulkier since it stays in place',
      'A home kit is for water only, while a go bag is for food only',
      'A go bag is only needed if you own a vehicle',
    ],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l2-02',
    type: 'quiz',
    format: 'true_false',
    levelSource: 2,
    topic: 'Medication planning',
    prompt: 'Prescription medication should be kept in its original, labelled container when packed for an emergency.',
    options: ['True', 'False'],
    correctOptionIndex: 0,
  },
  {
    id: 'pt2-l2-03',
    type: 'checklist',
    format: 'select_all',
    levelSource: 2,
    topic: 'Protected documents',
    prompt: 'Select the documents that should be kept in a waterproof container before a hurricane.',
    items: [
      { id: 'i1', label: 'Insurance and property records', isCorrect: true },
      { id: 'i2', label: 'Birth certificates and identification', isCorrect: true },
      { id: 'i3', label: 'Banking information needed to access accounts', isCorrect: true },
      { id: 'i4', label: 'This week’s grocery receipts', isCorrect: false },
    ],
  },
  {
    id: 'pt2-l2-04',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 2,
    topic: 'Evacuation route planning',
    prompt: 'Why should a personal evacuation route include a backup option?',
    options: [
      'Backup routes are only relevant to families with children',
      'In case the primary route becomes flooded or blocked',
      'Backup routes are required by law',
      'It has no practical purpose, only administrative value',
    ],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l2-05',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 2,
    topic: 'Go bag placement',
    prompt: 'Where should a packed go bag ideally be kept?',
    options: [
      'In a location only one household member knows about, for security',
      'Somewhere every household member knows and can reach quickly',
      'In storage, to be found and assembled once a Watch is issued',
      'It does not matter, as long as it exists somewhere in the house',
    ],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l2-06',
    type: 'checklist',
    format: 'select_all',
    levelSource: 2,
    topic: 'Personal emergency needs',
    prompt: 'Select the items that count as a genuine personal emergency need, worth planning for specifically.',
    items: [
      { id: 'i1', label: 'Spare glasses or contact lens solution', isCorrect: true },
      { id: 'i2', label: 'A current list of medications and dosages', isCorrect: true },
      { id: 'i3', label: 'A mobility aid the person relies on daily', isCorrect: true },
      { id: 'i4', label: 'A bulky non-essential comfort item taking up most of the bag', isCorrect: false },
    ],
  },
  {
    id: 'pt2-l2-07',
    type: 'quiz',
    format: 'true_false',
    levelSource: 2,
    topic: 'Device charging',
    prompt: 'Phones and power banks should be fully charged as soon as a Hurricane Watch is issued, not after the power goes out.',
    options: ['True', 'False'],
    correctOptionIndex: 0,
  },
  {
    id: 'pt2-l2-08',
    type: 'scenario',
    format: 'best_choice',
    levelSource: 2,
    topic: 'Evacuation order response',
    situationText:
      'An evacuation order has just been issued for your area. Your go bag is packed. A friend suggests quickly grabbing a few extra personal belongings first. What is the safest response?',
    choices: [
      { id: 'c1', text: 'Take a few extra minutes to gather more items, since the go bag alone might not be enough', isBestChoice: false },
      { id: 'c2', text: 'Take the prepared go bag and essential documents, and leave for the shelter without delay', isBestChoice: true },
      { id: 'c3', text: 'Wait until multiple neighbours confirm the order before leaving', isBestChoice: false },
    ],
  },

  // ============================== LEVEL 3 ==============================
  // "Family Preparedness" - communication plan, meeting places, roles, vulnerable members, pets
  {
    id: 'pt2-l3-01',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 3,
    topic: 'Family communication plan purpose',
    prompt: 'What is the main purpose of a written family communication plan?',
    options: [
      'To decide who contacts whom, where to meet, and who is responsible for what, before a crisis forces those decisions',
      'To replace the need for a go bag',
      'To satisfy an ODM requirement with no practical use',
      'To assign blame if something goes wrong',
    ],
    correctOptionIndex: 0,
  },
  {
    id: 'pt2-l3-02',
    type: 'checklist',
    format: 'select_all',
    levelSource: 3,
    topic: 'Communication plan contents',
    prompt: 'Select what belongs in a complete family communication plan.',
    items: [
      { id: 'i1', label: 'An out-of-community or off-island contact', isCorrect: true },
      { id: 'i2', label: 'Official emergency numbers (ODM, Police, Fire & Ambulance)', isCorrect: true },
      { id: 'i3', label: 'A physical, written copy - not only saved on a phone', isCorrect: true },
      { id: 'i4', label: 'Only the numbers for adults, since children don’t need contacts listed', isCorrect: false },
    ],
  },
  {
    id: 'pt2-l3-03',
    type: 'quiz',
    format: 'true_false',
    levelSource: 3,
    topic: 'Meeting places',
    prompt: 'A family plan should include two meeting points: one near home and one further away, in case the neighbourhood itself is unsafe.',
    options: ['True', 'False'],
    correctOptionIndex: 0,
  },
  {
    id: 'pt2-l3-04',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 3,
    topic: 'Family evacuation timing',
    prompt: 'When estimating how long a family evacuation will take, what should the plan account for?',
    options: [
      'Only the fastest household member',
      'The slowest-moving household member, including anyone needing assistance',
      'The average adult’s walking speed only',
      'It doesn’t need a time estimate at all',
    ],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l3-05',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 3,
    topic: 'Vulnerable household members',
    prompt: 'What should a family plan confirm specifically for a household member who takes regular medication?',
    options: [
      'That the medication supply covers at least a month, with dosages written down',
      'Nothing extra - the general go bag already covers this',
      'That they carry the medication themselves at all times with no backup plan',
      'That the medication is discarded before evacuating',
    ],
    correctOptionIndex: 0,
  },
  {
    id: 'pt2-l3-06',
    type: 'quiz',
    format: 'true_false',
    levelSource: 3,
    topic: 'Pets and shelters',
    prompt: 'Most emergency shelters allow pets inside the main shelter area alongside their owners.',
    options: ['True', 'False'],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l3-07',
    type: 'checklist',
    format: 'select_all',
    levelSource: 3,
    topic: 'Children and emergencies',
    prompt: 'Select what a child should be able to do or know as part of family preparedness.',
    items: [
      { id: 'i1', label: 'Recite the home address from memory', isCorrect: true },
      { id: 'i2', label: 'Know a parent’s phone number by memory', isCorrect: true },
      { id: 'i3', label: 'Know what to do if separated from an adult during an evacuation', isCorrect: true },
      { id: 'i4', label: 'Carry the family’s full document folder unsupervised', isCorrect: false },
    ],
  },
  {
    id: 'pt2-l3-08',
    type: 'scenario',
    format: 'best_choice',
    levelSource: 3,
    topic: 'Family separation during evacuation',
    situationText:
      'A hurricane warning is issued while your household is split between work, school, and home, with patchy phone service. What best reflects good family-plan practice?',
    choices: [
      { id: 'c1', text: 'Everyone tries repeatedly to call each other until someone answers', isBestChoice: false },
      { id: 'c2', text: 'Each person follows their pre-agreed role and heads to the agreed meeting point', isBestChoice: true },
      { id: 'c3', text: 'Everyone stays exactly where they are until the storm passes', isBestChoice: false },
    ],
  },

  // ============================== LEVEL 4 ==============================
  // "Home & Community Protection" - roof/window, drainage, trees, electrical, landslide
  {
    id: 'pt2-l4-01',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 4,
    topic: 'Roof failure mechanism',
    prompt: 'Why is sealing the gap between a roof and its supporting structure important before a hurricane?',
    options: [
      'It has no structural effect, only cosmetic value',
      'Wind entering that gap can build enough pressure to lift the roof off entirely',
      'It only matters for reducing noise during the storm',
      'It prevents insects, not wind damage',
    ],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l4-02',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 4,
    topic: 'Window protection',
    prompt: 'Roof sheeting should be fixed to its supports using which method for hurricane resistance?',
    options: ['Ordinary nails only', 'Long screws rather than nails alone', 'Adhesive tape', 'No fixing is needed if the roof is new'],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l4-03',
    type: 'quiz',
    format: 'true_false',
    levelSource: 4,
    topic: 'Drainage timing',
    prompt: 'Clearing drains and gutters should be done well before hurricane season starts, not during an active Warning.',
    options: ['True', 'False'],
    correctOptionIndex: 0,
  },
  {
    id: 'pt2-l4-04',
    type: 'checklist',
    format: 'select_all',
    levelSource: 4,
    topic: 'Yard hazards',
    prompt: 'Select everything that should be secured or stored indoors before a hurricane.',
    items: [
      { id: 'i1', label: 'Loose garden tools', isCorrect: true },
      { id: 'i2', label: 'Outdoor furniture', isCorrect: true },
      { id: 'i3', label: 'Garbage bins', isCorrect: true },
      { id: 'i4', label: 'A permanently fixed concrete structure', isCorrect: false },
    ],
  },
  {
    id: 'pt2-l4-05',
    type: 'quiz',
    format: 'true_false',
    levelSource: 4,
    topic: 'Electrical hazards',
    prompt: 'A downed power line that looks inactive can be assumed safe to approach.',
    options: ['True', 'False'],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l4-06',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 4,
    topic: 'Landslide risk',
    prompt: 'Why is landslide risk a particular concern in Dominica during heavy hurricane rainfall?',
    options: [
      'Landslides are unrelated to rainfall in Dominica',
      'Dominica’s steep, volcanic terrain makes slopes especially prone to landslides during heavy rain',
      'Landslides only occur during earthquakes, not hurricanes',
      'Only coastal areas can experience landslides',
    ],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l4-07',
    type: 'checklist',
    format: 'select_all',
    levelSource: 4,
    topic: 'Warning signs of landslide risk',
    prompt: 'Select the warning signs that a property may be at elevated landslide risk during heavy rain.',
    items: [
      { id: 'i1', label: 'New cracks appearing in the ground or walls', isCorrect: true },
      { id: 'i2', label: 'Doors or windows that suddenly start sticking', isCorrect: true },
      { id: 'i3', label: 'A slightly overgrown lawn', isCorrect: false },
      { id: 'i4', label: 'Freshly painted exterior walls', isCorrect: false },
    ],
  },
  {
    id: 'pt2-l4-08',
    type: 'scenario',
    format: 'best_choice',
    levelSource: 4,
    topic: 'Post-storm hazard judgement',
    situationText:
      'Just after a storm passes, you notice a fallen power line near your driveway that appears still and quiet. What is the safest assumption?',
    choices: [
      { id: 'c1', text: 'It is safe, since it isn’t sparking or moving', isBestChoice: false },
      { id: 'c2', text: 'Treat it as live regardless of appearance, and keep well away from it', isBestChoice: true },
      { id: 'c3', text: 'Move it carefully out of the way using a dry stick', isBestChoice: false },
    ],
  },

  // ============================== LEVEL 5 ==============================
  // "Hurricane Response" - during-storm safety, eye, evacuation decisions, comms/power failure
  {
    id: 'pt2-l5-01',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 5,
    topic: 'During-storm behaviour',
    prompt: 'While a hurricane is actively passing over your area, what is the safest general behaviour?',
    options: [
      'Move between rooms periodically to check for damage',
      'Stay in your designated safe interior room and avoid unnecessary movement',
      'Step outside briefly during any lull to assess conditions',
      'Open a window slightly to monitor the wind',
    ],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l5-02',
    type: 'quiz',
    format: 'true_false',
    levelSource: 5,
    topic: 'Eye of the storm',
    prompt: 'A sudden calm period during a hurricane always means the storm has finished passing.',
    options: ['True', 'False'],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l5-03',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 5,
    topic: 'Evacuation order timing',
    prompt: 'Why does evacuating early, as soon as an order is given, matter?',
    options: [
      'It has no real benefit over waiting',
      'It reduces road risk and supports better shelter management for everyone',
      'It is only relevant for coastal households',
      'Early evacuation is discouraged by ODM',
    ],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l5-04',
    type: 'checklist',
    format: 'select_all',
    levelSource: 5,
    topic: 'Flood and electrical safety',
    prompt: 'Select the correct safety practices around floodwater and electricity.',
    items: [
      { id: 'i1', label: 'Never enter floodwater that could be near electrical equipment', isCorrect: true },
      { id: 'i2', label: 'Treat any floodwater as potentially contaminated', isCorrect: true },
      { id: 'i3', label: 'Boil drinking water until authorities confirm it is safe', isCorrect: true },
      { id: 'i4', label: 'Floodwater is only a concern if it is visibly dirty', isCorrect: false },
    ],
  },
  {
    id: 'pt2-l5-05',
    type: 'quiz',
    format: 'true_false',
    levelSource: 5,
    topic: 'Emergency communication',
    prompt: 'A battery or hand-crank radio can still receive official updates even when cell networks are down.',
    options: ['True', 'False'],
    correctOptionIndex: 0,
  },
  {
    id: 'pt2-l5-06',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 5,
    topic: 'Pre-decided decision triggers',
    prompt: 'What is the main advantage of deciding in advance what would trigger you to evacuate, even without an official order?',
    options: [
      'It removes the need for any official evacuation order ever',
      'It means you act on a pre-decided plan rather than improvising a high-stakes decision under pressure',
      'It guarantees your home will not be damaged',
      'It has no real advantage over waiting for an order',
    ],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l5-07',
    type: 'quiz',
    format: 'true_false',
    levelSource: 5,
    topic: 'Power outage planning',
    prompt: 'It is reasonable to plan for a power outage lasting several days rather than assuming it will be brief.',
    options: ['True', 'False'],
    correctOptionIndex: 0,
  },
  {
    id: 'pt2-l5-08',
    type: 'scenario',
    format: 'best_choice',
    levelSource: 5,
    topic: 'Water entering the home',
    situationText:
      'No official evacuation order has been issued yet, but water has started entering your home through a damaged window during worsening conditions. What is the best response?',
    choices: [
      { id: 'c1', text: 'Wait for an official evacuation order before doing anything', isBestChoice: false },
      { id: 'c2', text: 'Evacuate using your planned route, treating the water entering your home as your own trigger to leave', isBestChoice: true },
      { id: 'c3', text: 'Try to seal the window and stay put regardless of how conditions develop', isBestChoice: false },
    ],
  },

  // ============================== LEVEL 6 ==============================
  // "Hurricane Mastery" - integrative capstone, combining facts and multi-step scenarios
  // across all previous levels (per the level's own no-new-material design).
  {
    id: 'pt2-l6-01',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 6,
    topic: 'Integrated: wind threshold',
    prompt: 'At what sustained wind speed does a tropical storm officially become a hurricane?',
    options: ['50 mph', '65 mph', '74 mph', '90 mph'],
    correctOptionIndex: 2,
  },
  {
    id: 'pt2-l6-02',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 6,
    topic: 'Integrated: major hurricane threshold',
    prompt: 'A storm is classified a "Major Hurricane" once it reaches which category or higher?',
    options: ['Category 1', 'Category 2', 'Category 3', 'Category 5'],
    correctOptionIndex: 2,
  },
  {
    id: 'pt2-l6-03',
    type: 'checklist',
    format: 'select_all',
    levelSource: 6,
    topic: 'Integrated: complete kit review',
    prompt: 'Select everything a fully complete household emergency kit should include.',
    items: [
      { id: 'i1', label: 'At least one gallon of water per person, per day', isCorrect: true },
      { id: 'i2', label: 'A month’s supply of essential medication', isCorrect: true },
      { id: 'i3', label: 'A battery or hand-crank radio', isCorrect: true },
      { id: 'i4', label: 'Scented candles as the primary lighting source', isCorrect: false },
    ],
  },
  {
    id: 'pt2-l6-04',
    type: 'quiz',
    format: 'true_false',
    levelSource: 6,
    topic: 'Integrated: myths',
    prompt: 'Cracking a garage door open during high winds relieves pressure and helps protect the roof.',
    options: ['True', 'False'],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l6-05',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 6,
    topic: 'Integrated: window protection spec',
    prompt: 'What plywood thickness does ODM recommend for boarding up windows?',
    options: ['1/4 inch', '1/2 inch', '1 inch', '2 inches'],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l6-06',
    type: 'checklist',
    format: 'select_all',
    levelSource: 6,
    topic: 'Integrated: complete family plan',
    prompt: 'A genuinely complete family plan covers which of these elements?',
    items: [
      { id: 'i1', label: 'A written communication plan with every household member’s contacts', isCorrect: true },
      { id: 'i2', label: 'Assigned roles for evacuation (documents, kit, pets, etc.)', isCorrect: true },
      { id: 'i3', label: 'Plans specific to any vulnerable household members', isCorrect: true },
      { id: 'i4', label: 'A plan known only to the household’s adults', isCorrect: false },
    ],
  },
  {
    id: 'pt2-l6-07',
    type: 'quiz',
    format: 'multiple_choice',
    levelSource: 6,
    topic: 'Integrated: recommended water storage',
    prompt: 'How much water should be stored per person, per day, according to ODM guidance?',
    options: ['Half a gallon', 'One gallon', 'Three gallons', 'None, if a river is nearby'],
    correctOptionIndex: 1,
  },
  {
    id: 'pt2-l6-08',
    type: 'scenario',
    format: 'best_choice',
    levelSource: 6,
    topic: 'Integrated: preparation under time pressure',
    situationText:
      'A hurricane intensifies far faster than forecast, turning a Watch into a Warning within a few hours. You still have final preparations left to finish. What is the best approach?',
    choices: [
      { id: 'c1', text: 'Work through a pre-decided priority list - go bags, documents, windows - fastest and most critical first', isBestChoice: true },
      { id: 'c2', text: 'Try to do everything at once with no particular order', isBestChoice: false },
      { id: 'c3', text: 'Focus only on securing the yard and leave the go bags for later', isBestChoice: false },
    ],
  },
  {
    id: 'pt2-l6-09',
    type: 'scenario',
    format: 'best_choice',
    levelSource: 6,
    topic: 'Integrated: eye of the storm response',
    situationText:
      'You are sheltering when the wind suddenly goes calm - likely the eye - and then picks back up violently from a different direction shortly after, as expected. What is the correct response?',
    choices: [
      { id: 'c1', text: 'Stay sheltered, since this was expected, and continue waiting it out safely', isBestChoice: true },
      { id: 'c2', text: 'Move to a different spot that seems safer', isBestChoice: false },
      { id: 'c3', text: 'Step outside briefly to check on the yard', isBestChoice: false },
    ],
  },
  {
    id: 'pt2-l6-10',
    type: 'checklist',
    format: 'select_all',
    levelSource: 6,
    topic: 'Integrated: recovery sequence',
    prompt: 'Select every step that belongs in a proper post-storm recovery process.',
    items: [
      { id: 'i1', label: 'Wait for the official All Clear before travelling', isCorrect: true },
      { id: 'i2', label: 'Check for hazards (power lines, structural damage, floodwater) before entering your home', isCorrect: true },
      { id: 'i3', label: 'Re-establish contact with family and your out-of-community contact', isCorrect: true },
      { id: 'i4', label: 'Immediately resume every normal activity with no checks at all', isCorrect: false },
    ],
  },
];

// Convenience export matching the shape of the current single-activity
// pretest, for any code path that still expects one object rather than an
// array of 50 independent items grouped by level/format.
export const PRETEST_V2_META = {
  totalItems: PRETEST_V2_ITEMS.length,
  pointsPerItem: 1,
  maxScore: PRETEST_V2_ITEMS.length,
  distribution: {
    level1: PRETEST_V2_ITEMS.filter(i => i.levelSource === 1).length,
    level2: PRETEST_V2_ITEMS.filter(i => i.levelSource === 2).length,
    level3: PRETEST_V2_ITEMS.filter(i => i.levelSource === 3).length,
    level4: PRETEST_V2_ITEMS.filter(i => i.levelSource === 4).length,
    level5: PRETEST_V2_ITEMS.filter(i => i.levelSource === 5).length,
    level6: PRETEST_V2_ITEMS.filter(i => i.levelSource === 6).length,
  },
  formatCounts: {
    multiple_choice: PRETEST_V2_ITEMS.filter(i => i.format === 'multiple_choice').length,
    true_false: PRETEST_V2_ITEMS.filter(i => i.format === 'true_false').length,
    select_all: PRETEST_V2_ITEMS.filter(i => i.format === 'select_all').length,
    best_choice: PRETEST_V2_ITEMS.filter(i => i.format === 'best_choice').length,
  },
};