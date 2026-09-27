// missionContent/responseGuide.js
//
// "What to do if..." response guidance for each hazard Dominica faces. The
// Respond tab in the Resource Hub shows this (components/ResponseGuide.js).
//
// The missions cover the "respond" stage for hurricanes only. This file
// covers the other hazards the app monitors on Hazard Watch (floods,
// earthquakes, volcanic activity) and the two linked hazards Dominica is
// most exposed to (landslides and tsunamis).
//
// Wording is paraphrased from official Dominican and regional sources. The
// source for each hazard is in its `source` field and shown under its steps:
//   - Office of Disaster Management (ODM): odm.gov.dm hazard pages for
//     hurricanes, landslides, earthquakes and volcanoes
//   - Dominica Meteorological Service: weather warning vigilance level guide
//   - UWI Seismic Research Centre (SRC): volcano and tsunami preparedness
//     pages, and the Dominica volcanic alert level brochure
//
// Every hazard has the same shape so the screen can render any of them:
//   keyAction - the single most important instruction, shown as a banner
//   phases    - ordered sections ("warning", "during", "after"), each with
//               numbered steps
//   alertLevels (optional) - an official alert scale, e.g. volcano levels

export const RESPONSE_PHASE_STYLES = {
  warning: { label: 'Warning / signs', emoji: '⚠️' },
  during: { label: 'During', emoji: '🔴' },
  after: { label: 'After', emoji: '✅' },
};

export const RESPONSE_GUIDE = [
  {
    id: 'hurricane',
    name: 'Hurricane',
    emoji: '🌀',
    keyAction:
      'If your home is safe and on high ground, stay indoors. If it is not, go to a designated shelter early and stay there until the storm has passed.',
    phases: [
      {
        type: 'warning',
        title: 'When a watch or warning is issued',
        steps: [
          'Listen to local radio and follow official ODM advisories and evacuation orders.',
          'Board up or shutter windows, and bring in or tie down outdoor objects such as bins, furniture and tools.',
          'Store drinking water in clean containers and check your radio, flashlight and batteries.',
          'Fuel your vehicle, because service stations may be closed for several days after the storm.',
          'Give livestock plenty of food and water, and secure or move boats to a safe area.',
          'Keep your go-bag, documents and medication by the door.',
          'If you live in a flood- or landslide-prone area, or your house is not strong, move to a shelter before the weather gets worse.',
        ],
      },
      {
        type: 'during',
        title: 'During the storm',
        steps: [
          'Stay in an interior room away from windows and doors.',
          'If an evacuation order is issued, leave immediately by your planned route. Do not stop for extra belongings.',
          'Do not go outside to check on damage. Deal with it once it is officially safe.',
          'If the wind suddenly drops, it is probably the eye. The winds will return fast from the other direction, so stay where you are.',
          'Use flashlights, not candles.',
          'Never walk or drive through floodwater.',
        ],
      },
      {
        type: 'after',
        title: 'After the storm passes',
        steps: [
          'Wait for the official all-clear before going outside or travelling.',
          'Stay out of danger zones declared by the authorities, and keep away from fallen power lines and damaged buildings.',
          'Check on your neighbours and help search and rescue teams by sharing what you saw.',
          'Boil or treat drinking water until the authorities say the supply is safe.',
          'Run generators outdoors only, never inside the house.',
        ],
      },
    ],
    source: 'ODM hurricane guidance; Hurricane Ready mission content',
  },

  {
    id: 'flood',
    name: 'Flood',
    emoji: '🌧️',
    keyAction:
      'TURN AROUND, DON’T DROWN. Never try to cross a flooded road, river or ravine.',
    phases: [
      {
        type: 'warning',
        title: 'When heavy rain is forecast',
        steps: [
          'Know the Met Service vigilance levels: Yellow means be aware, Amber means be prepared, and Red means take action now.',
          'If you live near a riverbank or ravine, be ready to move to higher ground at short notice.',
          'Clear the drains around your home, and move valuables and electrical items off the floor.',
          'Know your nearest shelter and the safest route to it, and avoid travel you do not need to make.',
        ],
      },
      {
        type: 'during',
        title: 'During flooding',
        steps: [
          'Move to higher ground straight away. Flash floods can rise in minutes.',
          'Do not walk, drive or swim through moving water. About 15 cm (6 in) can knock you over and 30 cm (1 ft) can sweep away a car.',
          'Keep away from rivers and ravines, where flood water carries rocks, trees and debris.',
          'If water is coming into your home and it is safe to reach the main switch, turn off the electricity.',
          'Listen to local radio for official instructions.',
        ],
      },
      {
        type: 'after',
        title: 'After the water goes down',
        steps: [
          'Return home only when the authorities say it is safe.',
          'Avoid floodwater and mud. They can be contaminated and can hide debris or live wires.',
          'Boil or treat drinking water, and throw away any food that touched floodwater.',
          'Watch for landslides. Slopes stay unstable for days after heavy rain.',
        ],
      },
    ],
    source: 'Dominica Meteorological Service vigilance guide; ODM guidance',
  },

  {
    id: 'landslide',
    name: 'Landslide',
    emoji: '⛰️',
    keyAction:
      'If you are on or below a steep slope in heavy rain, get to safe ground early. Never try to cross or clear landslide debris.',
    phases: [
      {
        type: 'warning',
        title: 'Warning signs',
        steps: [
          'Be most alert during heavy rain, and after an earthquake or bush fire near steep slopes.',
          'Look for new cracks in the ground, walls or roads, and trees, poles or fences starting to lean.',
          'Watch for a stream that suddenly turns muddy or stops flowing, and listen for rumbling or falling rocks.',
          'Report any slope that looks likely to slide to ODM or the police.',
        ],
      },
      {
        type: 'during',
        title: 'During a landslide',
        steps: [
          'Move out of the path straight away, to the side rather than downhill.',
          'If you cannot get away, curl into a tight ball and protect your head.',
          'Do not enter, cross or try to clear the debris while it is moving.',
          'Follow official instructions and stay away from the affected area.',
        ],
      },
      {
        type: 'after',
        title: 'After a landslide',
        steps: [
          'Stay away from the slide area, because more slides can follow.',
          'Do not go into the debris to look for people. Tell search and rescue teams where they may be.',
          'Report broken power lines, water mains and blocked roads.',
          'Get medical care for anyone injured at a health centre or hospital.',
          'Listen to local radio and stay out of declared danger zones.',
        ],
      },
    ],
    source: 'ODM landslide guidance; Dominica Meteorological Service',
  },

  {
    id: 'earthquake',
    name: 'Earthquake',
    emoji: '🏚️',
    keyAction: 'DROP, COVER and HOLD ON until the shaking stops.',
    phases: [
      {
        type: 'during',
        title: 'During the shaking',
        steps: [
          'Drop to the ground, get under a sturdy table, desk, bench or bed, and hold on.',
          'If there is nothing to get under, crouch in an inside corner and cover your head and face with your arms.',
          'If you are inside, stay inside. If you are outside, stay outside, away from buildings, poles, trees and power lines.',
          'If you are driving, pull over away from bridges, poles and buildings, and stay in the vehicle.',
          'Do not use lifts.',
        ],
      },
      {
        type: 'after',
        title: 'After the shaking stops',
        steps: [
          'Expect aftershocks. Drop, cover and hold on again each time.',
          'If you are on the coast and the shaking was strong or long, go to high ground now. A tsunami may follow.',
          'Check yourself and the people around you for injuries.',
          'Leave the building if it is badly damaged or there is a risk of fire or collapse.',
          'Turn off the gas cylinder, electricity and water if they are damaged.',
          'Keep away from fallen power lines and declared danger zones, and boil drinking water until it is declared safe.',
        ],
      },
    ],
    source: 'ODM earthquake guidance; UWI Seismic Research Centre',
  },

  {
    id: 'tsunami',
    name: 'Tsunami',
    emoji: '🌊',
    keyAction:
      'If you FEEL strong shaking, SEE the sea suddenly pull back, or HEAR a roar from the sea, run to high ground. Do not wait for an official warning.',
    phases: [
      {
        type: 'warning',
        title: 'Natural warning signs',
        steps: [
          'FEEL: strong or long shaking while you are near the coast.',
          'SEE: the sea suddenly drawing back from the shore.',
          'HEAR: a loud roar from the sea, like a train or plane.',
          'Any one of these signs, or an official tsunami warning, means move now.',
        ],
      },
      {
        type: 'during',
        title: 'During a tsunami',
        steps: [
          'Go inland or uphill straight away, on foot if you can. Roads may be blocked.',
          'If you cannot reach high ground, go to the third floor or higher of a strong concrete building. Climb a sturdy tree only as a last resort.',
          'Never go down to the shore to watch the waves.',
          'If you are swept into the water, grab something that floats.',
          'Tsunamis come in several waves over hours, and the first wave may not be the largest.',
        ],
      },
      {
        type: 'after',
        title: 'After the waves',
        steps: [
          'Stay away from the coast until the official all-clear, even if the sea looks calm.',
          'Keep out of damaged buildings and avoid standing water.',
          'Throw away any food that touched sea or flood water.',
          'Help injured people and listen to local news for instructions.',
        ],
      },
    ],
    source: 'UWI Seismic Research Centre tsunami guidance',
  },

  {
    id: 'volcano',
    name: 'Volcano',
    emoji: '🌋',
    keyAction:
      'Follow ODM and UWI Seismic Research Centre instructions. If you are told to evacuate, leave early. Do not wait until it is too late.',
    alertLevels: [
      { level: 'Green', meaning: 'Volcano is quiet. Activity is at or below normal levels.' },
      { level: 'Yellow', meaning: 'Volcano is restless. Activity is above normal levels.' },
      { level: 'Orange', meaning: 'Activity is highly elevated. An eruption may happen with less than 24 hours’ notice.' },
      { level: 'Red', meaning: 'An eruption is happening or may happen without further warning.' },
    ],
    phases: [
      {
        type: 'warning',
        title: 'When the alert level rises',
        steps: [
          'Dominica has nine live volcanic centres. Check the hazard map to see whether you live in a hazard zone.',
          'Pack your go-bag with N95 masks and goggles, and plan your evacuation route.',
          'Listen to local radio for ODM and Seismic Research Centre updates.',
          'At Orange, be ready to leave at short notice.',
        ],
      },
      {
        type: 'during',
        title: 'During an eruption',
        steps: [
          'If an evacuation order is issued, leave immediately and do not enter the danger zone.',
          'If you are not told to evacuate, stay indoors with the windows and doors shut, and bring animals inside.',
          'Wear an N95 mask (or a damp cloth over your nose and mouth) and goggles.',
          'Keep away from low-lying areas where volcanic gases collect, and from areas downwind of the volcano.',
          'Do not drive through heavy ashfall. Ash damages engines and cuts visibility.',
        ],
      },
      {
        type: 'after',
        title: 'After an eruption',
        steps: [
          'Outdoors, wear a mask, goggles, a long-sleeved shirt and trousers.',
          'Clear ash from roofs carefully. Wet ash is very heavy and can make a roof collapse.',
          'Keep water tanks and containers covered.',
          'Stay away from river valleys, where mudflows can happen, and out of danger zones until the authorities allow it.',
        ],
      },
    ],
    source: 'ODM volcano guidance; UWI Seismic Research Centre (alert levels and preparedness)',
  },
];