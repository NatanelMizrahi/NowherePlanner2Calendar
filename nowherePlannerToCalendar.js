const ical = require('ical-generator').default;

function getWeekday(date) {
  const days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
  return days[date.getUTCDay()];
}

function getStartDate(event) {
	const startDate = new Date(event.rrule.dtstart);
  const weekday = getWeekday(startDate);

  // Check if the startDate day is in the byweekday array
  if (!event.rrule.byweekday.includes(weekday)) {
    // Find the next date that matches the byweekday
    while (!event.rrule.byweekday.includes(getWeekday(startDate))) {
      startDate.setDate(startDate.getDate() + 1);
    }
  }
  return startDate;
}

function fromHours(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
}

function getUserEvents(events, savedEvents) {
	const userEvents = Object.entries(events)
		.map(event => ({ eventId: event[0], eventData: event[1]}))
		.filter(event => savedEvents[event.eventId]?.active)
		.map(event => event.eventData);
	return userEvents;
}

function ConvertAndAddToCalendar(calendar, event) {
  const startDate = getStartDate(event);
  const untilDate = new Date(Math.min(new Date(event.rrule.until), endDateLimit));

  calendar.createEvent({
    id: event.id,
    start: startDate,
    end: event.allDay 
    	? startDate
    	: new Date(startDate.getTime() + fromHours(event.duration)),
    allDay: event.allDay,
    summary: event.title + (event.extendedProps.ageRange === "xxx" ? "[xxx]" : ""),
    description: event.extendedProps.description,
    location: (event.location?.name ?? "") + ' | ' + (event.extendedProps.subLocation ?? ""),
    repeating: {
      freq: event.rrule.freq.toUpperCase(),
      until: untilDate,
      interval: event.rrule.interval,
      byDay: event.rrule.byweekday.map(day => day.substring(0, 2).toUpperCase())
    },
    status: "CONFIRMED",
  });
}

function AddEventsToCalendar(userEvents) {
	userEvents.forEach(event => ConvertAndAddToCalendar(calendar, event));
}

function saveToIcsAndDownload(calendar) {
	const blob = new Blob(
		[calendar.toString()], 
		{ type: 'text/calendar' });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = 'Nowhere.ics';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

const endDateLimit = new Date('2024-07-09');

const data = {
	events: JSON.parse(localStorage.eventDirectory),
	savedEvents: JSON.parse(localStorage.savedEvents)
};

const userEvents = getUserEvents(data.events, data.savedEvents);
const calendar = ical({ name: 'Nowhere 2024' });

AddEventsToCalendar(userEvents)
saveToIcsAndDownload(calendar);
