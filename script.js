import {
  timeSlots,
  routine60F,
  weekday,
  announcements,
  exams,
  semesterOffDays,
  deadlines,
} from "./data.js";

const timeSlotMap = Object.fromEntries(timeSlots.map((t) => [t.slot, t]));

/**
 * ===== Date helpers =====
 */
const pad2 = (n) => String(n).padStart(2, "0");

function parseYMDToLocalDate(ymd) {
  const [year, month, day] = ymd.split("-").map((part) => parseInt(part, 10));
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function parseDateTimeLocal(dateTimeString) {
  if (!dateTimeString) return null;
  const [datePart, timePart = "00:00"] = dateTimeString.split("T");
  const [year, month, day] = datePart.split("-").map((part) => parseInt(part, 10));
  const [hour, minute] = timePart.split(":").map((part) => parseInt(part, 10));
  const dt = new Date(year, month - 1, day, hour || 0, minute || 0, 0, 0);
  return isNaN(dt.getTime()) ? null : dt;
}

function formatYMD(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function formatCountdown(milliseconds) {
  const ms = Math.max(0, milliseconds);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${days > 0 ? days + "d " : ""}${hours}h ${minutes}m ${seconds}s`;
}

function getTodayClasses() {
  const todayName = weekday[new Date().getDay()];
  return routine60F.days[todayName] || [];
}

function getNextUpcomingClass() {
  const now = new Date();
  const offSet = new Set(semesterOffDays || []);

  for (let offset = 0; offset < 28; offset += 1) {
    const searchDate = new Date(now);
    searchDate.setDate(now.getDate() + offset);
    const ymd = formatYMD(searchDate);
    if (offSet.has(ymd)) continue;

    const dayName = weekday[searchDate.getDay()];
    const classes = (routine60F.days[dayName] || []).slice().sort((a, b) => a.slot - b.slot);

    for (const classItem of classes) {
      const time = timeSlotMap[classItem.slot];
      if (!time) continue;
      const startDate = new Date(searchDate);
      const [hour, minute] = time.start.split(":").map((p) => parseInt(p, 10));
      startDate.setHours(hour, minute, 0, 0);
      if (startDate.getTime() > now.getTime()) {
        return { classItem, startDate };
      }
    }
  }

  return null;
}

function renderTodayClasses() {
  const container = document.querySelector(".class-list");
  if (!container) return;

  const now = new Date();
  const todayYMD = formatYMD(now);
  const todayName = weekday[now.getDay()];
  const todayClasses = getTodayClasses();
  const isOffDay = semesterOffDays.includes(todayYMD);

  const todayDateEl = document.getElementById("todayDate");
  if (todayDateEl) {
    todayDateEl.textContent = `${todayName} · ${now.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  }

  container.innerHTML = "";

  if (isOffDay) {
    container.innerHTML = `
      <div class="holiday-card">
        <h2>🎉 Off Day</h2>
        <p>Today is an off day. There are no classes scheduled.</p>
      </div>
    `;
    return;
  }

  if (!todayClasses.length) {
    container.innerHTML = `
      <div class="empty-state">No classes scheduled for today.</div>
    `;
    return;
  }

  todayClasses.forEach((classItem) => {
    const time = timeSlotMap[classItem.slot];
    const classCard = document.createElement("div");
    classCard.className = "class-card";
    classCard.innerHTML = `
      <div class="time">${time.start}–${time.end}</div>
      <div class="details">
        <h3>${classItem.courseTitle}</h3>
        <p>${classItem.courseCode} • ${classItem.type}</p>
        <p>${classItem.teacher} • ${classItem.room}</p>
      </div>
    `;
    container.appendChild(classCard);
  });
}

function renderWeeklyRoutineTable() {
  const container = document.getElementById("table-container");
  if (!container) return;

  const columnDays = weekday;
  let html = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            ${columnDays.map((day) => `<th>${day}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
  `;

  timeSlots.forEach((slotInfo) => {
    html += `<tr><td>${slotInfo.start}–${slotInfo.end}</td>`;
    columnDays.forEach((dayName) => {
      const dayClasses = routine60F.days[dayName] || [];
      const classItem = dayClasses.find((item) => item.slot === slotInfo.slot);
      if (classItem) {
        html += `
          <td>
            <strong>${classItem.courseCode}</strong><br>
            <span>${classItem.courseTitle}</span><br>
            <small>${classItem.teacher} • ${classItem.type}</small>
          </td>
        `;
      } else {
        html += `<td class="empty-cell">—</td>`;
      }
    });
    html += `</tr>`;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

function renderAnnouncements() {
  const root = document.getElementById("announcementsList");
  if (!root) return;

  const sorted = [...announcements].sort((a, b) => b.date.localeCompare(a.date));
  root.innerHTML = "";

  if (!sorted.length) {
    root.innerHTML = `<div class="empty-state">No announcements yet.</div>`;
    return;
  }

  sorted.forEach((announcement) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="meta">${new Date(announcement.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</div>
      <h3>${announcement.title}</h3>
      <p>${announcement.content}</p>
    `;
    root.appendChild(card);
  });
}

function renderExams() {
  const examsTodayEl = document.getElementById("examsToday");
  const fullExamEl = document.getElementById("fullExamRoutine");
  if (!examsTodayEl || !fullExamEl) return;

  const now = new Date();
  const todayYMD = formatYMD(now);

  const examsSorted = [...exams]
    .map((exam) => ({ ...exam, _dt: parseDateTimeLocal(exam.datetime) }))
    .filter((exam) => exam._dt)
    .sort((a, b) => a._dt - b._dt);

  const todayExams = examsSorted.filter((exam) => formatYMD(exam._dt) === todayYMD);
  examsTodayEl.innerHTML = "";

  if (!todayExams.length) {
    examsTodayEl.innerHTML = `<div class="empty-state">No exam scheduled for today.</div>`;
  } else {
    todayExams.forEach((exam) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="meta">${exam._dt.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</div>
        <h3>${exam.courseTitle}</h3>
        <p>${exam.courseCode} • ${exam.type}${exam.venue ? ` • ${exam.venue}` : ""}</p>
      `;
      examsTodayEl.appendChild(card);
    });
  }

  fullExamEl.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Type</th>
            <th>Course</th>
            <th>Venue</th>
          </tr>
        </thead>
        <tbody>
          ${examsSorted
            .map(
              (exam) => `
            <tr>
              <td>${exam._dt.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</td>
              <td>${exam.type}</td>
              <td><strong>${exam.courseCode}</strong><br><span>${exam.courseTitle}</span></td>
              <td>${exam.venue || "TBA"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderOffDaysCalendar() {
  const calendarRoot = document.getElementById("offDayCalendar");
  if (!calendarRoot) return;

  const offSet = new Set(semesterOffDays || []);
  const offDates = Array.from(offSet).sort();
  if (!offDates.length) {
    calendarRoot.innerHTML = `<div class="empty-state">No off days configured.</div>`;
    return;
  }

  const months = new Map();
  offDates.forEach((ymd) => {
    const [year, month] = ymd.split("-");
    const key = `${year}-${month}`;
    if (!months.has(key)) months.set(key, []);
    months.get(key).push(ymd);
  });

  let html = "";
  months.forEach((list, key) => {
    const [year, month] = key.split("-").map((value) => parseInt(value, 10));
    const firstDay = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const offset = firstDay.getDay();

    html += `
      <div class="calendar-month">
        <div class="calendar-month-title">${firstDay.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
        <div class="calendar-grid">
          ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<div class="cal-header">${d}</div>`).join("")}
          ${Array.from({ length: offset }).map(() => `<div class="cal-cell empty"></div>`).join("")}
          ${Array.from({ length: daysInMonth })
            .map((_, index) => {
              const day = index + 1;
              const ymd = `${year}-${pad2(month)}-${pad2(day)}`;
              const isOff = offSet.has(ymd);
              return `<div class="cal-cell ${isOff ? "off" : ""}"><div class="cal-day-number">${day}</div></div>`;
            })
            .join("")}
        </div>
      </div>
    `;
  });

  calendarRoot.innerHTML = html;
}

function renderDeadlines() {
  const root = document.getElementById("deadlinesNext");
  if (!root) return;

  const now = new Date();
  const upcoming = deadlines
    .map((item) => ({ ...item, _dt: parseDateTimeLocal(item.dueDateTime) }))
    .filter((item) => item._dt && item._dt.getTime() >= now.getTime() - 1000)
    .sort((a, b) => a._dt - b._dt)
    .slice(0, 6);

  root.innerHTML = "";
  if (!upcoming.length) {
    root.innerHTML = `<div class="empty-state">No upcoming tests or assignments found.</div>`;
    return;
  }

  upcoming.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.deadlineIso = item.dueDateTime;
    card.innerHTML = `
      <div class="meta">${item.kind} • ${item.courseCode}</div>
      <h3>${item.title}</h3>
      <p>Due: ${item._dt.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</p>
      <div class="deadline-countdown">Calculating...</div>
    `;
    root.appendChild(card);
  });
}

function updateNextClassCountdown() {
  const countdownEl = document.getElementById("countdown");
  if (!countdownEl) return;
  const nextClass = getNextUpcomingClass();
  if (!nextClass) {
    countdownEl.textContent = "No upcoming classes found in the routine.";
    return;
  }

  const diff = nextClass.startDate - new Date();
  countdownEl.innerHTML = `
    <div class="countdown-title">Next Class</div>
    <div class="countdown-meta">${nextClass.classItem.courseTitle} • ${nextClass.classItem.courseCode}</div>
    <div class="countdown-value">${formatCountdown(diff)}</div>
    <div class="countdown-note">Starts ${nextClass.startDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} at ${nextClass.startDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</div>
  `;
}

function updateHolidayCountdown() {
  const element = document.getElementById("holiday-countdown");
  if (!element) return;

  const now = new Date();
  const offSet = new Set(semesterOffDays || []);
  const upcoming = Array.from(offSet)
    .map(parseYMDToLocalDate)
    .filter((date) => date.getTime() >= now.getTime() - 1000)
    .sort((a, b) => a - b)[0];

  if (!upcoming) {
    element.textContent = "No upcoming off days scheduled.";
    return;
  }

  const isToday = formatYMD(upcoming) === formatYMD(now);
  const target = new Date(upcoming);
  if (isToday) target.setHours(23, 59, 59, 999);

  const diff = target - now;
  element.innerHTML = `
    <div class="countdown-card holiday-card">
      <div class="countdown-title">Next Off Day</div>
      <div class="countdown-meta">${upcoming.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}${isToday ? " (Today)" : ""}</div>
      <div class="countdown-value">${formatCountdown(diff)}</div>
      <div class="countdown-note">${isToday ? "Enjoy your day off!" : "Plan ahead for your next break."}</div>
    </div>
  `;
}

function updateNextExamCountdown() {
  const el = document.getElementById("nextExamCountdown");
  if (!el) return;

  const now = new Date();
  const nextExam = exams
    .map((exam) => ({ ...exam, _dt: parseDateTimeLocal(exam.datetime) }))
    .filter((exam) => exam._dt && exam._dt.getTime() > now.getTime())
    .sort((a, b) => a._dt - b._dt)[0];

  if (!nextExam) {
    el.textContent = "No upcoming exams found.";
    return;
  }

  const diff = nextExam._dt - now;
  el.innerHTML = `
    <div class="countdown-title">Next Exam</div>
    <div class="countdown-meta">${nextExam.courseTitle} • ${nextExam.courseCode}</div>
    <div class="countdown-value">${formatCountdown(diff)}</div>
    <div class="countdown-note">${nextExam._dt.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
  `;
}

function updateNextOffDayCountdown() {
  const el = document.getElementById("nextOffDayCountdown");
  if (!el) return;

  const now = new Date();
  const nextOff = Array.from(new Set(semesterOffDays || []))
    .map(parseYMDToLocalDate)
    .filter((date) => date.getTime() >= now.getTime() - 1000)
    .sort((a, b) => a - b)[0];

  if (!nextOff) {
    el.textContent = "No upcoming off days found.";
    return;
  }

  const isToday = formatYMD(nextOff) === formatYMD(now);
  const target = new Date(nextOff);
  if (isToday) target.setHours(23, 59, 59, 999);
  const diff = target - now;

  el.innerHTML = `
    <div class="countdown-title">Next Off Day</div>
    <div class="countdown-meta">${nextOff.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}${isToday ? " (Today)" : ""}</div>
    <div class="countdown-value">${formatCountdown(diff)}</div>
  `;
}

function updateDeadlinesCountdowns() {
  const root = document.getElementById("deadlinesNext");
  if (!root) return;

  const now = new Date();
  root.querySelectorAll(".card[data-deadline-iso]").forEach((card) => {
    const iso = card.dataset.deadlineIso;
    const dt = parseDateTimeLocal(iso);
    const node = card.querySelector(".deadline-countdown");
    if (!node || !dt) return;
    const diff = dt - now;
    node.textContent = diff < 0 ? "Due time passed" : `Countdown: ${formatCountdown(diff)}`;
  });
}

function setActiveNavItem() {
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".top-nav a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
}

function init() {
  setActiveNavItem();
  if (document.querySelector(".class-list")) renderTodayClasses();
  if (document.getElementById("table-container")) renderWeeklyRoutineTable();
  if (document.getElementById("announcementsList")) renderAnnouncements();
  if (document.getElementById("examsToday") || document.getElementById("fullExamRoutine")) renderExams();
  if (document.getElementById("offDayCalendar")) renderOffDaysCalendar();
  if (document.getElementById("deadlinesNext")) renderDeadlines();

  updateNextClassCountdown();
  updateHolidayCountdown();
  updateNextExamCountdown();
  updateNextOffDayCountdown();
  updateDeadlinesCountdowns();

  setInterval(() => {
    updateNextClassCountdown();
    updateHolidayCountdown();
    updateNextExamCountdown();
    updateNextOffDayCountdown();
    updateDeadlinesCountdowns();
  }, 1000);
}

init();
