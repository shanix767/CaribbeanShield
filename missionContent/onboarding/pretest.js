// missionContent/onboarding/pretest.js
//
// The pretest shown once during onboarding, before any mission content is
// played. 50 questions spread across all six Hurricane Ready levels (8 each
// for Levels 1-5, 10 for Level 6, the capstone). Every question is freshly
// written: none is copied from any in-game quiz, checklist, or scenario in
// level1.js-level6.js, so a player never meets these exact questions again
// during gameplay. This replaces the earlier 16-question version, which
// reused Level 1 questions verbatim and so carried a practice-effect risk.
//
// Formats are mixed (multiple choice, true/false, scenario, and checklist
// content rewritten as "which of these does NOT belong"), but all are
// expressed as single-answer questions so Quiz.js can render them unchanged.
//
// No explanation text is included on purpose: the pretest should not
// reveal the correct answer, only record it and move to the next question.
//
// This is shaped as a single quiz "activity" object so it can be rendered
// directly by components/activities/Quiz.js without any changes to that
// component - xpReward is set to 50 (the question count) specifically so
// Quiz's built-in scoring math (xpReward * correct/total, rounded)
// resolves to exactly "number of questions correct," which the Pretest
// screen then reads as the actual score rather than as XP. No
// timeLimitSeconds is set - the pretest is deliberately untimed, since it
// measures baseline knowledge, not performance under time pressure.

export const PRETEST_ACTIVITY = {
  id: 'pretest',
  type: 'quiz',
  title: 'Hurricane Readiness Pretest',
  xpReward: 50,
  content: {
    questions: [
      // --- Level 1: Know the Storm ---
      {
        id: 'pt2-l1-01', // multiple choice
        prompt:
          'Which of these best describes how a hurricane forms?',
        options: [
          'Warm, moist air rising over warm ocean water and releasing heat as it cools',
          'A sudden drop in atmospheric pressure over a mountain range',
          'Cold ocean currents colliding with warm air masses',
          'Cold air sinking rapidly over land',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l1-02', // multiple choice
        prompt:
          'On the Saffir-Simpson scale, what determines a hurricane\u2019s category?',
        options: [
          'Rainfall total',
          'Sustained wind speed',
          'Storm diameter',
          'Distance travelled',
        ],
        correctOptionIndex: 1,
      },
      {
        id: 'pt2-l1-03', // true/false
        prompt:
          'The Atlantic hurricane season runs from June through November.',
        options: ['True', 'False'],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l1-04', // checklist, as odd one out
        prompt:
          'Which of these is NOT a hazard directly caused by a hurricane?',
        options: ['Landslides', 'Flying debris', 'Volcanic ashfall', 'Storm surge'],
        correctOptionIndex: 2,
      },
      {
        id: 'pt2-l1-05', // multiple choice
        prompt:
          'A Hurricane Warning means hurricane conditions are expected within roughly how long?',
        options: ['60 hours', '12 hours', '24 hours', '36 hours'],
        correctOptionIndex: 3,
      },
      {
        id: 'pt2-l1-06', // true/false
        prompt:
          'Putting tape across a window in an X shape will keep it from shattering in high winds.',
        options: ['True', 'False'],
        correctOptionIndex: 1,
      },
      {
        id: 'pt2-l1-07', // multiple choice
        prompt:
          'Which of these is the most reliable source for an active hurricane update?',
        options: [
          'An official Office of Disaster Management (ODM) bulletin',
          'A neighbour\u2019s guess based on the sky outside',
          'A voice note forwarded by a friend',
          'A screenshot circulating on social media',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l1-08', // scenario
        prompt:
          'A storm has been downgraded to a Category 1 hurricane just before making landfall near your community. A neighbour says there\u2019s nothing to worry about now. What is the most accurate response?',
        options: [
          'Say that only Category 4 and 5 storms cause any real damage',
          'Agree - Category 1 storms are not dangerous',
          'Point out that even a Category 1 hurricane can still damage roofs, snap branches, and cause power outages, so preparation still matters',
        ],
        correctOptionIndex: 2,
      },

      // --- Level 2: Personal Preparedness ---
      {
        id: 'pt2-l2-01', // multiple choice
        prompt:
          'What is the main practical difference between a go bag and a home emergency kit?',
        options: [
          'A go bag is only needed if you own a vehicle',
          'There is no real difference between them',
          'A go bag is meant to be light and portable for quick departure; a home kit can be bulkier since it stays in place',
          'A home kit is for water only, while a go bag is for food only',
        ],
        correctOptionIndex: 2,
      },
      {
        id: 'pt2-l2-02', // true/false
        prompt:
          'Prescription medication should be kept in its original, labelled container when packed for an emergency.',
        options: ['True', 'False'],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l2-03', // checklist, as odd one out
        prompt:
          'Which of these does NOT need to go in a waterproof document container before a hurricane?',
        options: [
          'Insurance and property records',
          'Birth certificates and identification',
          'Banking information needed to access accounts',
          'This week\u2019s grocery receipts',
        ],
        correctOptionIndex: 3,
      },
      {
        id: 'pt2-l2-04', // multiple choice
        prompt:
          'Why should a personal evacuation route include a backup option?',
        options: [
          'In case the primary route becomes flooded or blocked',
          'Backup routes are required by law',
          'It has no practical purpose, only administrative value',
          'Backup routes are only relevant to families with children',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l2-05', // multiple choice
        prompt:
          'Where should a packed go bag ideally be kept?',
        options: [
          'In a location only one household member knows about, for security',
          'Somewhere every household member knows and can reach quickly',
          'In storage, to be found and assembled once a Watch is issued',
          'It does not matter, as long as it exists somewhere in the house',
        ],
        correctOptionIndex: 1,
      },
      {
        id: 'pt2-l2-06', // checklist, as odd one out
        prompt:
          'Which of these is NOT a genuine personal emergency need worth planning for specifically?',
        options: [
          'A current list of medications and dosages',
          'A mobility aid the person relies on daily',
          'A bulky non-essential comfort item taking up most of the bag',
          'Spare glasses or contact lens solution',
        ],
        correctOptionIndex: 2,
      },
      {
        id: 'pt2-l2-07', // true/false
        prompt:
          'Phones and power banks should be fully charged as soon as a Hurricane Watch is issued, not after the power goes out.',
        options: ['True', 'False'],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l2-08', // scenario
        prompt:
          'An evacuation order has just been issued for your area. Your go bag is packed. A friend suggests quickly grabbing a few extra personal belongings first. What is the safest response?',
        options: [
          'Wait until multiple neighbours confirm the order before leaving',
          'Take a few extra minutes to gather more items, since the go bag alone might not be enough',
          'Take the prepared go bag and essential documents, and leave for the shelter without delay',
        ],
        correctOptionIndex: 2,
      },

      // --- Level 3: Family Preparedness ---
      {
        id: 'pt2-l3-01', // multiple choice
        prompt:
          'What is the main purpose of a written family communication plan?',
        options: [
          'To decide who contacts whom, where to meet, and who is responsible for what, before a crisis forces those decisions',
          'To replace the need for a go bag',
          'To satisfy an ODM requirement with no practical use',
          'To assign blame if something goes wrong',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l3-02', // checklist, as odd one out
        prompt:
          'Which of these does NOT belong in a complete family communication plan?',
        options: [
          'A physical, written copy - not only saved on a phone',
          'Only the numbers for adults, since children don\u2019t need contacts listed',
          'An out-of-community or off-island contact',
          'Official emergency numbers (ODM, Police, Fire & Ambulance)',
        ],
        correctOptionIndex: 1,
      },
      {
        id: 'pt2-l3-03', // true/false
        prompt:
          'A family plan should include two meeting points: one near home and one further away, in case the neighbourhood itself is unsafe.',
        options: ['True', 'False'],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l3-04', // multiple choice
        prompt:
          'When estimating how long a family evacuation will take, what should the plan account for?',
        options: [
          'It doesn\u2019t need a time estimate at all',
          'Only the fastest household member',
          'The slowest-moving household member, including anyone needing assistance',
          'The average adult\u2019s walking speed only',
        ],
        correctOptionIndex: 2,
      },
      {
        id: 'pt2-l3-05', // multiple choice
        prompt:
          'What should a family plan confirm specifically for a household member who takes regular medication?',
        options: [
          'Nothing extra - the general go bag already covers this',
          'That they carry the medication themselves at all times with no backup plan',
          'That the medication is discarded before evacuating',
          'That the medication supply covers at least a month, with dosages written down',
        ],
        correctOptionIndex: 3,
      },
      {
        id: 'pt2-l3-06', // true/false
        prompt:
          'Most emergency shelters allow pets inside the main shelter area alongside their owners.',
        options: ['True', 'False'],
        correctOptionIndex: 1,
      },
      {
        id: 'pt2-l3-07', // checklist, as odd one out
        prompt:
          'Which of these is NOT something a child should be expected to do or know as part of family preparedness?',
        options: [
          'Carry the family\u2019s full document folder unsupervised',
          'Recite the home address from memory',
          'Know a parent\u2019s phone number by memory',
          'Know what to do if separated from an adult during an evacuation',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l3-08', // scenario
        prompt:
          'A hurricane warning is issued while your household is split between work, school, and home, with patchy phone service. What best reflects good family-plan practice?',
        options: [
          'Everyone stays exactly where they are until the storm passes',
          'Everyone tries repeatedly to call each other until someone answers',
          'Each person follows their pre-agreed role and heads to the agreed meeting point',
        ],
        correctOptionIndex: 2,
      },

      // --- Level 4: Home & Community Protection ---
      {
        id: 'pt2-l4-01', // multiple choice
        prompt:
          'Why is sealing the gap between a roof and its supporting structure important before a hurricane?',
        options: [
          'It prevents insects, not wind damage',
          'It has no structural effect, only cosmetic value',
          'Wind entering that gap can build enough pressure to lift the roof off entirely',
          'It only matters for reducing noise during the storm',
        ],
        correctOptionIndex: 2,
      },
      {
        id: 'pt2-l4-02', // multiple choice
        prompt:
          'Roof sheeting should be fixed to its supports using which method for hurricane resistance?',
        options: [
          'Adhesive tape',
          'No fixing is needed if the roof is new',
          'Ordinary nails only',
          'Long screws rather than nails alone',
        ],
        correctOptionIndex: 3,
      },
      {
        id: 'pt2-l4-03', // true/false
        prompt:
          'Clearing drains and gutters should be done well before hurricane season starts, not during an active Warning.',
        options: ['True', 'False'],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l4-04', // checklist, as odd one out
        prompt:
          'Which of these does NOT need to be secured or brought indoors before a hurricane?',
        options: [
          'A permanently fixed concrete structure',
          'Loose garden tools',
          'Outdoor furniture',
          'Garbage bins',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l4-05', // true/false
        prompt:
          'A downed power line that looks inactive can be assumed safe to approach.',
        options: ['True', 'False'],
        correctOptionIndex: 1,
      },
      {
        id: 'pt2-l4-06', // multiple choice
        prompt:
          'Why is landslide risk a particular concern in Dominica during heavy hurricane rainfall?',
        options: [
          'Landslides are unrelated to rainfall in Dominica',
          'Dominica\u2019s steep, volcanic terrain makes slopes especially prone to landslides during heavy rain',
          'Landslides only occur during earthquakes, not hurricanes',
          'Only coastal areas can experience landslides',
        ],
        correctOptionIndex: 1,
      },
      {
        id: 'pt2-l4-07', // checklist, as odd one out
        prompt:
          'Which of these is NOT a warning sign of elevated landslide risk during heavy rain?',
        options: [
          'Doors or windows that suddenly start sticking',
          'A slightly overgrown lawn',
          'New cracks appearing in the ground or walls',
        ],
        correctOptionIndex: 1,
      },
      {
        id: 'pt2-l4-08', // scenario
        prompt:
          'Just after a storm passes, you notice a fallen power line near your driveway that appears still and quiet. What is the safest assumption?',
        options: [
          'Move it carefully out of the way using a dry stick',
          'It is safe, since it isn\u2019t sparking or moving',
          'Treat it as live regardless of appearance, and keep well away from it',
        ],
        correctOptionIndex: 2,
      },

      // --- Level 5: Hurricane Response ---
      {
        id: 'pt2-l5-01', // multiple choice
        prompt:
          'While a hurricane is actively passing over your area, what is the safest general behaviour?',
        options: [
          'Stay in your designated safe interior room and avoid unnecessary movement',
          'Step outside briefly during any lull to assess conditions',
          'Open a window slightly to monitor the wind',
          'Move between rooms periodically to check for damage',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l5-02', // true/false
        prompt:
          'A sudden calm period during a hurricane always means the storm has finished passing.',
        options: ['True', 'False'],
        correctOptionIndex: 1,
      },
      {
        id: 'pt2-l5-03', // multiple choice
        prompt:
          'Why does evacuating early, as soon as an order is given, matter?',
        options: [
          'It has no real benefit over waiting',
          'It reduces road risk and supports better shelter management for everyone',
          'It is only relevant for coastal households',
          'Early evacuation is discouraged by ODM',
        ],
        correctOptionIndex: 1,
      },
      {
        id: 'pt2-l5-04', // checklist, as odd one out
        prompt:
          'Which of these is NOT a correct safety practice around floodwater and electricity?',
        options: [
          'Treat any floodwater as potentially contaminated',
          'Boil drinking water until authorities confirm it is safe',
          'Floodwater is only a concern if it is visibly dirty',
          'Never enter floodwater that could be near electrical equipment',
        ],
        correctOptionIndex: 2,
      },
      {
        id: 'pt2-l5-05', // true/false
        prompt:
          'A battery or hand-crank radio can still receive official updates even when cell networks are down.',
        options: ['True', 'False'],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l5-06', // multiple choice
        prompt:
          'What is the main advantage of deciding in advance what would trigger you to evacuate, even without an official order?',
        options: [
          'It guarantees your home will not be damaged',
          'It has no real advantage over waiting for an order',
          'It removes the need for any official evacuation order ever',
          'It means you act on a pre-decided plan rather than improvising a high-stakes decision under pressure',
        ],
        correctOptionIndex: 3,
      },
      {
        id: 'pt2-l5-07', // true/false
        prompt:
          'It is reasonable to plan for a power outage lasting several days rather than assuming it will be brief.',
        options: ['True', 'False'],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l5-08', // scenario
        prompt:
          'No official evacuation order has been issued yet, but water has started entering your home through a damaged window during worsening conditions. What is the best response?',
        options: [
          'Wait for an official evacuation order before doing anything',
          'Evacuate using your planned route, treating the water entering your home as your own trigger to leave',
          'Try to seal the window and stay put regardless of how conditions develop',
        ],
        correctOptionIndex: 1,
      },

      // --- Level 6: Hurricane Mastery ---
      {
        id: 'pt2-l6-01', // multiple choice
        prompt:
          'At what sustained wind speed does a tropical storm officially become a hurricane?',
        options: ['65 mph', '74 mph', '90 mph', '50 mph'],
        correctOptionIndex: 1,
      },
      {
        id: 'pt2-l6-02', // multiple choice
        prompt:
          'A storm is classified a "Major Hurricane" once it reaches which category or higher?',
        options: ['Category 1', 'Category 2', 'Category 3', 'Category 5'],
        correctOptionIndex: 2,
      },
      {
        id: 'pt2-l6-03', // checklist, as odd one out
        prompt:
          'Which of these does NOT belong in a fully complete household emergency kit?',
        options: [
          'At least one gallon of water per person, per day',
          'A month\u2019s supply of essential medication',
          'A battery or hand-crank radio',
          'Scented candles as the primary lighting source',
        ],
        correctOptionIndex: 3,
      },
      {
        id: 'pt2-l6-04', // true/false
        prompt:
          'Cracking a garage door open during high winds relieves pressure and helps protect the roof.',
        options: ['True', 'False'],
        correctOptionIndex: 1,
      },
      {
        id: 'pt2-l6-05', // multiple choice
        prompt:
          'What plywood thickness does ODM recommend for boarding up windows?',
        options: ['1/2 inch', '1 inch', '2 inches', '1/4 inch'],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l6-06', // checklist, as odd one out
        prompt:
          'Which of these is NOT part of a genuinely complete family plan?',
        options: [
          'Plans specific to any vulnerable household members',
          'A plan known only to the household\u2019s adults',
          'A written communication plan with every household member\u2019s contacts',
          'Assigned roles for evacuation (documents, kit, pets, etc.)',
        ],
        correctOptionIndex: 1,
      },
      {
        id: 'pt2-l6-07', // multiple choice
        prompt:
          'How much water should be stored per person, per day, according to ODM guidance?',
        options: ['None, if a river is nearby', 'Half a gallon', 'One gallon', 'Three gallons'],
        correctOptionIndex: 2,
      },
      {
        id: 'pt2-l6-08', // scenario
        prompt:
          'A hurricane intensifies far faster than forecast, turning a Watch into a Warning within a few hours. You still have final preparations left to finish. What is the best approach?',
        options: [
          'Try to do everything at once with no particular order',
          'Focus only on securing the yard and leave the go bags for later',
          'Work through a pre-decided priority list - go bags, documents, windows - fastest and most critical first',
        ],
        correctOptionIndex: 2,
      },
      {
        id: 'pt2-l6-09', // scenario
        prompt:
          'You are sheltering when the wind suddenly goes calm - likely the eye - and then picks back up violently from a different direction shortly after, as expected. What is the correct response?',
        options: [
          'Stay sheltered, since this was expected, and continue waiting it out safely',
          'Move to a different spot that seems safer',
          'Step outside briefly to check on the yard',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'pt2-l6-10', // checklist, as odd one out
        prompt:
          'Which of these does NOT belong in a proper post-storm recovery process?',
        options: [
          'Re-establish contact with family and your out-of-community contact',
          'Immediately resume every normal activity with no checks at all',
          'Wait for the official All Clear before travelling',
          'Check for hazards (power lines, structural damage, floodwater) before entering your home',
        ],
        correctOptionIndex: 1,
      },
    ],
  },
};