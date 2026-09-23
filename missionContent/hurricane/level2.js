// missionContent/hurricane/level2.js
//
// Hurricane Ready - Level 2: "Personal Preparedness". Kit/go-bag content
// (L2.9, L2.10, L2.14, L2.16) draws from ODM"s own 72-hour Emergency
// Supply Kit Checklist; L2.6"s contact card draws from ODM"s Family
// Communication Plan template structure - both real source documents,
// not generic lists.
//
// XP values match the CaribbeanShield scoring design: Learn 60, Plan 60,
// Prepare 120, Prove 80, Respond 80, Recover 50 = 450 XP for the level,
// +40 completion bonus.

export const HURRICANE_LEVEL_2 = {
  levelNumber: 2,
  title: "Personal Preparedness",
  badgeId: "personalPreparedness",
  badgeName: "Personal Preparedness",
  completionBonusXp: 40,
  stages: {
    learn: {
      activities: [
        {
          id: "L2.1",
          type: "lesson",
          title: "What Belongs in a Go Bag?",
          xpReward: 15,
          content: {
            body:
              "A go bag is a portable kit with everything you need to survive for at least 72 hours " +
              "if you have to leave home quickly. Unlike a home emergency kit, it needs to be light " +
              "enough to carry and ready to grab at a moment's notice.",
            bullets: [
              "Keep it packed year-round during hurricane season, not assembled last-minute",
              "Store it somewhere every household member knows and can reach quickly",
              "Review and refresh it at least once a year - food expires, kids outgrow supplies",
            ],
          },
        },
        {
          id: "L2.2",
          type: "quiz",
          title: "Emergency Food & Water",
          xpReward: 15,
          content: {
            questions: [
              {
                id: "q1",
                prompt:
                  "How much water should a go bag carry per person, at minimum?",
                options: [
                  "Enough for one day, with the rest of your supply kept at home",
                  "At least one gallon per person per day for the emergency supply",
                  "One gallon total, regardless of how many people are travelling",
                  "Enough to reach the shelter, since water will be available there",
                ],
                correctOptionIndex: 1,
                explanation:
                  "ODM recommends at least a gallon per person per day for your overall emergency supply. " +
                  "Your evacuation plan should account for how much water you can realistically carry.",
              },
              {
                id: "q2",
                prompt: "Which food choice is most appropriate for a go bag?",
                options: [
                  "Canned tuna and crackers that can be eaten without preparation",
                  "Bread, cheese, and fresh fruit packed shortly before departure",
                  "Canned soup, dry rice, and a small stove for preparing meals",
                  "Frozen meat and other foods that can be cooked once you reach the shelter",
                ],
                correctOptionIndex: 0,
                explanation:
                  "Go-bag food should be shelf-stable, portable, and require little or no preparation.",
              },
            ],
          },
        },
        {
          id: "L2.3",
          type: "lesson",
          title: "Medication & Personal Needs",
          xpReward: 10,
          content: {
            body:
              "Pharmacies may be closed or damaged for days after a hurricane. Running out of a " +
              "prescription during a disaster is a real, common problem - and an easily preventable one.",
            bullets: [
              "Keep at least a 1-month supply of prescription medication, plus a copy of the prescription itself",
              "Don't forget items that are easy to overlook: glasses, contacts and solution, hearing aid batteries",
              "Include any medical equipment you rely on daily",
            ],
          },
        },
        {
          id: "L2.4",
          type: "checklist",
          title: "Important Documents",
          xpReward: 10,
          content: {
            prompt:
              "Which of these should you protect in a waterproof container before a hurricane?",
            items: [
              {
                id: "i1",
                label: "Insurance and property documents",
                isCorrect: true,
              },
              {
                id: "i2",
                label: "Birth, marriage, and other identity records",
                isCorrect: true,
              },
              {
                id: "i3",
                label: "Passport and other travel documents",
                isCorrect: true,
              },
              {
                id: "i4",
                label:
                  "Banking and financial information needed to access accounts",
                isCorrect: true,
              },
              {
                id: "i5",
                label: "Original household receipts for routine purchases",
                isCorrect: false,
              },
              {
                id: "i6",
                label: "Printed copies of everyday shopping lists",
                isCorrect: false,
              },
            ],
          },
        },
        {
          id: "L2.5",
          type: "lesson",
          title: "Power Outage Essentials",
          xpReward: 10,
          content: {
            body:
              "Power can be out for days to weeks after a major hurricane. Plan for light, " +
              "communication, and keeping devices charged without relying on the grid.",
            bullets: [
              "A battery-powered or hand-crank radio is your most reliable source of official updates",
              "A power bank (charged in advance) keeps your phone usable for days",
              "Flashlights are safer than candles - no open flame risk, especially near a possible gas leak",
            ],
          },
        },
      ],
    },

    plan: {
      activities: [
        {
          id: "L2.6",
          type: "lesson",
          title: "Personal Emergency Contact Card",
          xpReward: 20,
          content: {
            body:
              "ODM's Family Communication Plan template is built around one idea: write your key " +
              "numbers down somewhere that doesn't depend on your phone working. Keep a physical copy.",
            bullets: [
              "Home, cell, and work numbers for every adult in your household",
              "A neighbour's contact, in case you need local help fast",
              "An out-of-community or off-island contact - often easier to reach than local lines during a disaster",
              "Police, Fire & Ambulance, and your nearest health centre",
            ],
          },
        },
        {
          id: "L2.7",
          type: "lesson",
          title: "Personal Evacuation Route",
          xpReward: 20,
          content: {
            body:
              "Knowing where you're going before an evacuation order is issued saves critical time. " +
              "Plan this route now, not while roads are already filling up.",
            bullets: [
              "Identify your home, then your safe location, then your nearest official shelter, in that order",
              "Have a backup route in case your first choice road floods or is blocked",
              "Practice the route once so it's familiar, not just theoretical",
            ],
          },
        },
        {
          id: "L2.8",
          type: "checklist",
          title: "Personal Emergency Needs",
          xpReward: 20,
          content: {
            prompt:
              "Which of these count as personal emergency needs worth planning for specifically?",
            items: [
              {
                id: "i1",
                label: "Prescription medication and a current medication list",
                isCorrect: true,
              },
              {
                id: "i2",
                label: "Mobility aids that the person normally relies on",
                isCorrect: true,
              },
              {
                id: "i3",
                label: "Spare glasses or contact lenses and solution",
                isCorrect: true,
              },
              {
                id: "i4",
                label:
                  "A non-essential comfort item that takes up significant bag space",
                isCorrect: false,
              },
              {
                id: "i5",
                label: "Formal clothing for use after the evacuation",
                isCorrect: false,
              },
            ],
          },
        },
      ],
    },

    prepare: {
      activities: [
        {
          id: "L2.9",
          type: "checklist",
          title: "Pack Your Go Bag",
          xpReward: 40,
          content: {
            prompt:
              "Select every item that belongs in a 72-hour go bag (per ODM's checklist).",
            items: [
              {
                id: "i1",
                label:
                  "Water - enough to support the household during the planned evacuation period",
                isCorrect: true,
              },
              {
                id: "i2",
                label:
                  "Non-perishable food that can be eaten with little or no preparation",
                isCorrect: true,
              },
              {
                id: "i3",
                label: "First aid kit and essential personal medication",
                isCorrect: true,
              },
              {
                id: "i4",
                label:
                  "Cash for situations where electronic payments are unavailable",
                isCorrect: true,
              },
              {
                id: "i5",
                label: "Flashlight and a battery-powered or hand-cranked radio",
                isCorrect: true,
              },
              {
                id: "i6",
                label: "Whistle and other compact signalling equipment",
                isCorrect: true,
              },
              {
                id: "i7",
                label: "A change of clothes appropriate for the conditions",
                isCorrect: true,
              },
              {
                id: "i8",
                label:
                  "A large cooking pot because meals may need to be prepared at the shelter",
                isCorrect: false,
              },
              {
                id: "i9",
                label:
                  "Several large containers of food that make the bag difficult to carry",
                isCorrect: false,
              },
              {
                id: "i10",
                label:
                  "A complete set of household cookware for use after evacuation",
                isCorrect: false,
              },
            ],
          },
        },
        {
          id: "L2.10",
          type: "checklist",
          title: "Build Your Emergency Supply Kit",
          xpReward: 30,
          content: {
            prompt:
              "This is your HOME kit, not your portable go bag - select what belongs here.",
            items: [
              {
                id: "i1",
                label: "Warm blankets and basic bedding supplies",
                isCorrect: true,
              },
              {
                id: "i2",
                label: "Paper plates, cups, and utensils for conserving water",
                isCorrect: true,
              },
              {
                id: "i3",
                label: "A manual can opener for canned food",
                isCorrect: true,
              },
              {
                id: "i4",
                label: "Basic hygiene supplies such as soap and toothpaste",
                isCorrect: true,
              },
              {
                id: "i5",
                label: "Extra batteries for essential equipment",
                isCorrect: true,
              },
              {
                id: "i6",
                label:
                  "Large entertainment equipment that depends on mains electricity",
                isCorrect: false,
              },
            ],
          },
        },
        {
          id: "L2.11",
          type: "checklist",
          title: "Prepare Your Documents",
          xpReward: 20,
          content: {
            prompt:
              "Select the items that should go in your waterproof document container.",
            items: [
              {
                id: "i1",
                label: "A photo inventory of important personal belongings",
                isCorrect: true,
              },
              {
                id: "i2",
                label: "Proof of occupancy such as a current utility bill",
                isCorrect: true,
              },
              {
                id: "i3",
                label: "Immunization and other essential health records",
                isCorrect: true,
              },
              {
                id: "i4",
                label: "Lease, mortgage, or other housing documents",
                isCorrect: true,
              },
              {
                id: "i5",
                label:
                  "Receipts for routine purchases that are not needed for claims or identification",
                isCorrect: false,
              },
            ],
          },
        },
        {
          id: "L2.12",
          type: "lesson",
          title: "Prepare Your Medication",
          xpReward: 20,
          content: {
            body:
              "Medication is one of the easiest things to forget under pressure, and one of the most " +
              "dangerous to go without.",
            bullets: [
              "Pack at minimum a 1-month supply, in its original labelled container",
              "Keep a written list of all medications, dosages, and prescribing doctors",
              "If refrigeration is needed, plan for a cooler and ice packs",
            ],
          },
        },
        {
          id: "L2.13",
          type: "lesson",
          title: "Charge Your Devices",
          xpReward: 10,
          content: {
            body: "Do this BEFORE the storm, not after the power's already out.",
            bullets: [
              "Fully charge your phone and any power banks as soon as a Watch is issued",
              "Charge a spare radio or flashlight if it's rechargeable rather than battery-only",
              "Keep a car charger - your vehicle can be a backup power source if needed",
            ],
          },
        },
      ],
    },

    prove: {
      activities: [
        {
          id: "L2.14",
          type: "checklist",
          title: "Go-Bag Inspection",
          xpReward: 35,
          content: {
            prompt:
              "A player's go bag is being inspected. Select everything that's actually essential.",
            items: [
              {
                id: "i1",
                label: "Water and compact non-perishable food",
                isCorrect: true,
              },
              {
                id: "i2",
                label: "First aid supplies and essential medication",
                isCorrect: true,
              },
              {
                id: "i3",
                label:
                  "A flashlight and a reliable way to receive official updates",
                isCorrect: true,
              },
              {
                id: "i4",
                label: "Cash and protected copies of essential documents",
                isCorrect: true,
              },
              {
                id: "i5",
                label:
                  "A bulky comfort item that would significantly reduce space for essential supplies",
                isCorrect: false,
              },
              {
                id: "i6",
                label:
                  "Extra household items that are useful only if you remain at home",
                isCorrect: false,
              },
            ],
          },
        },
        {
          id: "L2.15",
          type: "quiz",
          title: "Emergency Kit Quiz",
          xpReward: 25,
          content: {
            questions: [
              {
                id: "q1",
                prompt:
                  "Why should you keep medication in its original labelled container?",
                options: [
                  "So the medication can be identified accurately if you need help from a responder or pharmacist",
                  "Because medication stored outside its original container will always become unsafe during an evacuation",
                  "Because the original container proves that you have enough medication for the entire emergency period",
                  "Because shelters will only accept medication that is still in its original retail packaging",
                ],
                correctOptionIndex: 0,
                explanation:
                  "Correct identification matters most when you may not be able to explain your own medications.",
              },
              {
                id: "q2",
                prompt: "Where should your go bag be kept?",
                options: [
                  "In the most secure location available, even if only one household member knows where it is",
                  "In a known, easily reachable location that the whole household has been told about",
                  "Packed away with other seasonal supplies so it stays protected from everyday use",
                  "Near the main exit only when a storm is forecast so it does not take up space year-round",
                ],
                correctOptionIndex: 1,
                explanation:
                  "A go bag only works if everyone can find and grab it quickly.",
              },
            ],
          },
        },
        {
          id: "L2.16",
          type: "checklist",
          title: "What's Missing?",
          xpReward: 20,
          content: {
            prompt:
              "This kit is missing several essentials. Select what SHOULD be added.",
            items: [
              {
                id: "i1",
                label: "Water appropriate for the planned evacuation period",
                isCorrect: true,
              },
              {
                id: "i2",
                label: "First aid supplies and essential medication",
                isCorrect: true,
              },
              {
                id: "i3",
                label: "A flashlight and a way to receive official information",
                isCorrect: true,
              },
              {
                id: "i4",
                label: "Cash and protected copies of essential documents",
                isCorrect: true,
              },
              {
                id: "i5",
                label:
                  "Only additional clothing, because food and water can be obtained after evacuation",
                isCorrect: false,
              },
            ],
          },
        },
      ],
    },

    respond: {
      activities: [
        {
          id: "L2.17",
          type: "scenario",
          title: "You're Evacuating",
          xpReward: 80,
          content: {
            situationText:
              "ODM has issued an evacuation order for your area. You have 20 minutes before you need " +
              "to leave. Your go bag is packed and by the door. What do you do?",
            choices: [
              {
                id: "c1",
                text: "Take the prepared go bag, essential documents and medication, then leave for the designated shelter",
                isBestChoice: true,
                consequenceText:
                  "The purpose of preparing in advance is to allow you to leave quickly when an evacuation order is issued.",
              },
              {
                id: "c2",
                text: "Spend a few minutes adding additional household items that may be difficult to replace before leaving",
                isBestChoice: false,
                consequenceText:
                  "Additional belongings can delay evacuation. Once an evacuation order is issued, personal safety takes priority over property.",
              },
              {
                id: "c3",
                text: "Call several family members to confirm the evacuation order before deciding whether to leave",
                isBestChoice: false,
                consequenceText:
                  "Confirming information can be useful, but an official evacuation order should not be delayed while you wait for multiple people to confirm it.",
              },
            ],
          },
        },
      ],
    },

    recover: {
      activities: [
        {
          id: "L2.18",
          type: "checklist",
          title: "Safe After the Storm",
          xpReward: 50,
          content: {
            prompt:
              "Before returning home or resuming normal activity, which of these should you check?",
            items: [
              {
                id: "i1",
                label:
                  "Whether ODM has issued an official All Clear or other return guidance",
                isCorrect: true,
              },
              {
                id: "i2",
                label:
                  "Whether essential medication remains usable and properly stored",
                isCorrect: true,
              },
              {
                id: "i3",
                label:
                  "Whether authorities have issued any instructions about the safety of drinking water",
                isCorrect: true,
              },
              {
                id: "i4",
                label:
                  "Whether you have access to cash in case electronic payment systems remain unavailable",
                isCorrect: true,
              },
              {
                id: "i5",
                label:
                  "Whether nearby roads appear quiet enough to resume normal travel",
                isCorrect: false,
              },
            ],
          },
        },
      ],
    },
  },
};
