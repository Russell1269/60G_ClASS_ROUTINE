export const timeSlots = [
  { slot: 1, start: "08:45", end: "10:05" },
  { slot: 2, start: "10:05", end: "11:25" },
  { slot: 3, start: "11:25", end: "12:45" },
  { slot: 4, start: "13:15", end: "14:35" },
  { slot: 5, start: "14:35", end: "15:55" },
  { slot: 6, start: "15:55", end: "17:15" },
];

export const routine60F = {
  batch: "60-A",
  semester: "Spring 2026",
  department: "CSE",
  effectiveFrom: "2026-01-12",

  days: {
    Monday: [
      {
        courseCode: "MIS0611401",
        courseTitle: "INFORMATION SYSTEMS MANAGEMENT",
        teacher: "SAK",
        type: "Theory",
        room: "5220 (515)",
        slot: 1,
      },
      {
        courseCode: "CSE0613401",
        courseTitle: "SOFTWARE PROJECT MANAGEMENT",
        teacher: "ASM",
        type: "Theory",
        room: "Lab 6150 (610)",
        slot: 3,
      },
      {
        courseCode: "CSE0613405",
        courseTitle: "MACHINE LEARNING",
        teacher: "MTZ",
        type: "Theory",
        room: "5179 (514)",
        slot: 4,
      },
      {
        courseCode: "CSE0613311",
        courseTitle: "ARTIFICIAL INTELLIGENCE",
        teacher: "KMI",
        type: "Theory",
        room: "5070 (532)",
        slot: 5,
      },
    ],
    Tuesday: [],
    Wednesday: [
      {
        courseCode: "CSE0613311",
        courseTitle: "ARTIFICIAL INTELLIGENCE",
        teacher: "MTZ",
        type: "Theory",
        room: "5220 (515)",
        slot: 1,
      },
      {
        courseCode: "CSE0613405",
        courseTitle: "MACHINE LEARNING",
        teacher: "MTZ",
        type: "Theory",
        room: "5080 (501)",
        slot: 2,
      },
      {
        courseCode: "CSE0613401",
        courseTitle: "SOFTWARE PROJECT MANAGEMENT",
        teacher: "ASM",
        type: "Theory",
        room: "5190 (512)",
        slot: 3,
      },
    ],
    Thursday: [
      {
        courseCode: "CSE0613312",
        courseTitle: "ARTIFICIAL INTELLIGENCE LAB",
        teacher: "KMI",
        type: "Lab",
        room: "Lab 6210 (616)",
        slot: 1,
      },
      {
        courseCode: "MIS0611401",
        courseTitle: "INFORMATION SYSTEMS MANAGEMENT",
        teacher: "SAK",
        type: "Theory",
        room: "5220 (515)",
        slot: 2,
      },
      {
        courseCode: "CSE0613312",
        courseTitle: "ARTIFICIAL INTELLIGENCE LAB",
        teacher: "KMI",
        type: "Lab",
        room: "Lab 6190 (614)",
        slot: 5,
      },
    ],
    Saturday: [],
  },
};

export const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const daysOfWeek = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
];

/**
 * ===== Extra semester planner datasets (static) =====
 * Dates are based on your pasted academic calendar (Summer 2026 / May–August 2026).
 * Update these arrays anytime by editing this file.
 */

export const semesterOffDays = [
  // Classes begin 13 May 2026
  // Eid-ul-Adha: 26–31 May 2026
  "2026-05-26",
  "2026-05-27",
  "2026-05-28",
  "2026-05-29",
  "2026-05-30",
  "2026-05-31",

  // Ashura: 26 Jun 2026
  "2026-06-26",

  // July Mass Uprising Day: 05 Aug 2026
  "2026-08-05",

  // Semester Final Examinations Period Summer 2026: 18 Aug – 02 Sep
  // (treat as off-days from regular classes)
  "2026-08-18",
  "2026-08-19",
  "2026-08-20",
  "2026-08-21",
  "2026-08-22",
  "2026-08-23",
  "2026-08-24",
  "2026-08-25",
  "2026-08-26",
  "2026-08-27",
  "2026-08-28",
  "2026-08-29",
  "2026-08-30",
  "2026-08-31",
  "2026-09-01",
  "2026-09-02",

  "2026-09-03",
  "2026-09-04",

  "2026-09-04",


  "2026-08-26",
];

export const announcements = [
  {
    date: "2026-05-26",
    title: "Software project management classroom Code",
    content:
      "54bdytwg",
  },

  {
    date: "2026-05-13",
    title: "Summer 2026 starts",
    content:
      "Classes begin for Summer 2026. Check your course outlines and attend orientation weeks if applicable.",
  },
  {
    date: "2026-05-19",
    title: "Mid-Term Examinations week",
    content:
      "Mid-Term Examinations are scheduled for 19 June – 03 July. Keep an eye on the room/seat plan announcement.",
  },
  {
    date: "2026-08-18",
    title: "Semester final exam period",
    content:
      "Semester Final Examinations Period starts on 18 August. Confirm your exam schedule and submit any pending tasks on time.",
  },
  {
    date: "2026-09-14",
    title: "Results publication",
    content:
      "Publication of Results from the CoE Summer 2026 is scheduled for 14 September.",
  },
];


export const exams = [
  {
    datetime: "2026-06-04T10:05",
    courseCode: "MIS0611401",
    courseTitle: "Information System Management",
    type: "Class Test",
    venue: "Room 5220 (515)",
  },
  {
    datetime: "2026-06-19T09:00",
    courseCode: "MIDTERM",
    courseTitle: "Mid-Term Examinations (Week Start)",
    type: "Mid-Term",
    venue: "TBA",
  },
  {
    datetime: "2026-08-18T09:00",
    courseCode: "FINAL",
    courseTitle: "Semester Final Examinations (Start)",
    type: "Final",
    venue: "TBA",
  },
];

export const deadlines = [
  {
    dueDateTime: "2026-05-27T17:00",
    kind: "Assignment",
    title: "Thesis or project proposal submission",
    courseCode: "CSE-COURSE",
  },

  {
    dueDateTime: "2026-06-15T17:00",
    kind: "Assignment",
    title: "Submit mid-term related assignment pack",
    courseCode: "CSE-COURSE",
  },


  {
    dueDateTime: "2026-08-15T17:00",
    kind: "Assignment",
    title: "Submit final exam preparation tasks",
    courseCode: "CSE-COURSE",
  },

  {
    dueDateTime: "2026-08-17T12:00",
    kind: "Test",
    title: "Exam orientation quiz / check",
    courseCode: "CSE-COURSE",
  },
];
