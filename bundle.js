(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
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

},{"ical-generator":3}],3:[function(require,module,exports){
"use strict";var Q=Object.create;var R=Object.defineProperty;var K=Object.getOwnPropertyDescriptor;var $=Object.getOwnPropertyNames,j=Object.getOwnPropertySymbols,_=Object.getPrototypeOf,H=Object.prototype.hasOwnProperty,tt=Object.prototype.propertyIsEnumerable;var G=(a,t,e)=>t in a?R(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e,T=(a,t)=>{for(var e in t||(t={}))H.call(t,e)&&G(a,e,t[e]);if(j)for(var e of j(t))tt.call(t,e)&&G(a,e,t[e]);return a};var et=(a,t)=>{for(var e in t)R(a,e,{get:t[e],enumerable:!0})},W=(a,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of $(t))!H.call(a,i)&&i!==e&&R(a,i,{get:()=>t[i],enumerable:!(n=K(t,i))||n.enumerable});return a};var at=(a,t,e)=>(e=a!=null?Q(_(a)):{},W(t||!a||!a.__esModule?R(e,"default",{value:a,enumerable:!0}):e,a)),nt=a=>W(R({},"__esModule",{value:!0}),a);var lt={};et(lt,{ICalAlarm:()=>p,ICalAlarmRelatesTo:()=>Y,ICalAlarmType:()=>z,ICalAttendee:()=>f,ICalAttendeeRole:()=>w,ICalAttendeeStatus:()=>V,ICalAttendeeType:()=>L,ICalCalendar:()=>A,ICalCalendarMethod:()=>F,ICalCategory:()=>y,ICalEvent:()=>D,ICalEventBusyStatus:()=>B,ICalEventClass:()=>k,ICalEventRepeatingFreq:()=>x,ICalEventStatus:()=>U,ICalEventTransparency:()=>P,ICalWeekday:()=>S,default:()=>st,escape:()=>s,foldLines:()=>v,formatDate:()=>d,formatDateTZ:()=>E});module.exports=nt(lt);function d(a,t,e,n){if(a!=null&&a.startsWith("/")&&(a=a.substr(1)),typeof t=="string"||t instanceof Date){let i=new Date(t),r=i.getUTCFullYear()+String(i.getUTCMonth()+1).padStart(2,"0")+i.getUTCDate().toString().padStart(2,"0");return a&&(r=i.getFullYear()+String(i.getMonth()+1).padStart(2,"0")+i.getDate().toString().padStart(2,"0")),e?r:a?(r+="T"+i.getHours().toString().padStart(2,"0")+i.getMinutes().toString().padStart(2,"0")+i.getSeconds().toString().padStart(2,"0"),r):(r+="T"+i.getUTCHours().toString().padStart(2,"0")+i.getUTCMinutes().toString().padStart(2,"0")+i.getUTCSeconds().toString().padStart(2,"0")+(n?"":"Z"),r)}else if(N(t)){let i=a?q(t)&&!t.tz()?t.clone().tz(a):t:n||e&&q(t)&&t.tz()?t:t.utc();return i.format("YYYYMMDD")+(e?"":"T"+i.format("HHmmss")+(n||a?"":"Z"))}else if(O(t)){let i=a?t.setZone(a):n||e&&t.zone.type!=="system"?t:t.setZone("utc");return i.toFormat("yyyyLLdd")+(e?"":"T"+i.toFormat("HHmmss")+(n||a?"":"Z"))}else{let i=t;if(a)i=typeof t.tz=="function"?t.tz(a):t;else if(!n)if(typeof t.utc=="function")i=t.utc();else throw new Error("Unable to convert dayjs object to UTC value: UTC plugin is not available!");return i.format("YYYYMMDD")+(e?"":"T"+i.format("HHmmss")+(n||a?"":"Z"))}}function E(a,t,e,n){let i="",r=(n==null?void 0:n.floating)||!1;return n!=null&&n.timezone&&(i=";TZID="+n.timezone,r=!0),t+i+":"+d(a,e,!1,r)}function s(a,t){return String(a).replace(t?/[\\"]/g:/[\\;,]/g,function(e){return"\\"+e}).replace(/(?:\r\n|\r|\n)/g,"\\n")}function v(a){return a.split(`\r
`).map(function(t){let e="",n=0;for(let i=0;i<t.length;i++){let r=t.charAt(i);r>="\uD800"&&r<="\uDBFF"&&(r+=t.charAt(++i));let l=new TextEncoder().encode(r).length;n+=l,n>74&&(e+=`\r
 `,n=l),e+=r}return e}).join(`\r
`)}function o(a,t,e){if(Array.isArray(t))a.x=t.map(n=>{if(Array.isArray(n))return n;if(typeof n.key!="string"||typeof n.value!="string")throw new Error("Either key or value is not a string!");if(n.key.substr(0,2)!=="X-")throw new Error("Key has to start with `X-`!");return[n.key,n.value]});else if(typeof t=="object")a.x=Object.entries(t).map(([n,i])=>{if(typeof n!="string"||typeof i!="string")throw new Error("Either key or value is not a string!");if(n.substr(0,2)!=="X-")throw new Error("Key has to start with `X-`!");return[n,i]});else if(typeof t=="string"&&typeof e=="string"){if(t.substr(0,2)!=="X-")throw new Error("Key has to start with `X-`!");a.x.push([t,e])}else return a.x.map(n=>({key:n[0],value:n[1]}))}function b(a){let t=a.x.map(([e,n])=>e.toUpperCase()+":"+s(n,!1)).join(`\r
`);return t.length?t+`\r
`:""}function I(a,t){let e=null;if(typeof t=="string"){let n=t.match(/^(.+) ?<([^>]+)>$/);n?e={name:n[1].trim(),email:n[2].trim()}:t.includes("@")&&(e={name:t.trim(),email:t.trim()})}else typeof t=="object"&&(e={name:t.name,email:t.email,mailto:t.mailto,sentBy:t.sentBy});if(!e&&typeof t=="string")throw new Error("`"+a+"` isn't formated correctly. See https://sebbo2002.github.io/ical-generator/develop/reference/interfaces/ICalOrganizer.html");if(!e)throw new Error("`"+a+"` needs to be a valid formed string or an object. See https://sebbo2002.github.io/ical-generator/develop/reference/interfaces/ICalOrganizer.html");if(!e.name)throw new Error("`"+a+".name` is empty!");return e}function h(a,t){let e=Object.values(a),n=String(t).toUpperCase();if(!n||!e.includes(n))throw new Error(`Input must be one of the following: ${e.join(", ")}`);return n}function g(a,t){if(a instanceof Date&&isNaN(a.getTime())||typeof a=="string"&&isNaN(new Date(a).getTime()))throw new Error(`\`${t}\` has to be a valid date!`);if(a instanceof Date||typeof a=="string"||O(a)&&a.isValid===!0||(N(a)||it(a))&&a.isValid())return a;throw new Error(`\`${t}\` has to be a valid date!`)}function J(a){return typeof a=="string"||a instanceof Date?new Date(a):O(a)?a.toJSDate():a.toDate()}function N(a){return a!=null&&a._isAMomentObject!=null}function q(a){return N(a)&&"tz"in a&&typeof a.tz=="function"}function it(a){return typeof a=="object"&&a!==null&&!(a instanceof Date)&&!N(a)&&!O(a)}function O(a){return typeof a=="object"&&a!==null&&"toJSDate"in a&&typeof a.toJSDate=="function"}function X(a){return a!==null&&typeof a=="object"&&typeof a.asSeconds=="function"}function M(a){return a!==null&&typeof a=="object"&&typeof a.between=="function"&&typeof a.toString=="function"}function m(a){return a?typeof a=="string"?a:a.toJSON():null}function c(a){let t="";return a<0&&(t="-",a*=-1),t+="P",a>=86400&&(t+=Math.floor(a/86400)+"D",a%=86400),!a&&t.length>1||(t+="T",a>=3600&&(t+=Math.floor(a/3600)+"H",a%=3600),a>=60&&(t+=Math.floor(a/60)+"M",a%=60),a>0?t+=a+"S":t.length<=2&&(t+="0S")),t}var Z=at(require("uuid-random"),1);var w=(i=>(i.CHAIR="CHAIR",i.REQ="REQ-PARTICIPANT",i.OPT="OPT-PARTICIPANT",i.NON="NON-PARTICIPANT",i))(w||{}),V=(r=>(r.ACCEPTED="ACCEPTED",r.TENTATIVE="TENTATIVE",r.DECLINED="DECLINED",r.DELEGATED="DELEGATED",r.NEEDSACTION="NEEDS-ACTION",r))(V||{}),L=(r=>(r.INDIVIDUAL="INDIVIDUAL",r.GROUP="GROUP",r.RESOURCE="RESOURCE",r.ROOM="ROOM",r.UNKNOWN="UNKNOWN",r))(L||{}),f=class a{constructor(t,e){if(this.data={name:null,email:"",mailto:null,sentBy:null,status:null,role:"REQ-PARTICIPANT",rsvp:null,type:null,delegatedTo:null,delegatedFrom:null,x:[]},this.parent=e,!this.parent)throw new Error("`event` option required!");if(!t.email)throw new Error("No value for `email` in ICalAttendee given!");t.name!==void 0&&this.name(t.name),t.email!==void 0&&this.email(t.email),t.mailto!==void 0&&this.mailto(t.mailto),t.sentBy!==void 0&&this.sentBy(t.sentBy),t.status!==void 0&&this.status(t.status),t.role!==void 0&&this.role(t.role),t.rsvp!==void 0&&this.rsvp(t.rsvp),t.type!==void 0&&this.type(t.type),t.delegatedTo!==void 0&&this.delegatedTo(t.delegatedTo),t.delegatedFrom!==void 0&&this.delegatedFrom(t.delegatedFrom),t.delegatesTo&&this.delegatesTo(t.delegatesTo),t.delegatesFrom&&this.delegatesFrom(t.delegatesFrom),t.x!==void 0&&this.x(t.x)}name(t){return t===void 0?this.data.name:(this.data.name=t||null,this)}email(t){return t?(this.data.email=t,this):this.data.email}mailto(t){return t===void 0?this.data.mailto:(this.data.mailto=t||null,this)}sentBy(t){return t?(this.data.sentBy=t,this):this.data.sentBy}role(t){return t===void 0?this.data.role:(this.data.role=h(w,t),this)}rsvp(t){return t===void 0?this.data.rsvp:t===null?(this.data.rsvp=null,this):(this.data.rsvp=!!t,this)}status(t){return t===void 0?this.data.status:t?(this.data.status=h(V,t),this):(this.data.status=null,this)}type(t){return t===void 0?this.data.type:t?(this.data.type=h(L,t),this):(this.data.type=null,this)}delegatedTo(t){return t===void 0?this.data.delegatedTo:t?(typeof t=="string"?this.data.delegatedTo=new a(T({email:t},I("delegatedTo",t)),this.parent):t instanceof a?this.data.delegatedTo=t:this.data.delegatedTo=new a(t,this.parent),this.data.status="DELEGATED",this):(this.data.delegatedTo=null,this.data.status==="DELEGATED"&&(this.data.status=null),this)}delegatedFrom(t){return t===void 0?this.data.delegatedFrom:(t?typeof t=="string"?this.data.delegatedFrom=new a(T({email:t},I("delegatedFrom",t)),this.parent):t instanceof a?this.data.delegatedFrom=t:this.data.delegatedFrom=new a(t,this.parent):this.data.delegatedFrom=null,this)}delegatesTo(t){let e=t instanceof a?t:this.parent.createAttendee(t);return this.delegatedTo(e),e.delegatedFrom(this),e}delegatesFrom(t){let e=t instanceof a?t:this.parent.createAttendee(t);return this.delegatedFrom(e),e.delegatedTo(this),e}x(t,e){if(t===void 0)return o(this.data);if(typeof t=="string"&&typeof e=="string")o(this.data,t,e);else if(typeof t=="object")o(this.data,t);else throw new Error("Either key or value is not a string!");return this}toJSON(){var t,e;return Object.assign({},this.data,{delegatedTo:((t=this.data.delegatedTo)==null?void 0:t.email())||null,delegatedFrom:((e=this.data.delegatedFrom)==null?void 0:e.email())||null,x:this.x()})}toString(){let t="ATTENDEE";if(!this.data.email)throw new Error("No value for `email` in ICalAttendee given!");return t+=";ROLE="+this.data.role,this.data.type&&(t+=";CUTYPE="+this.data.type),this.data.status&&(t+=";PARTSTAT="+this.data.status),this.data.rsvp!==null&&(t+=";RSVP="+this.data.rsvp.toString().toUpperCase()),this.data.sentBy!==null&&(t+=';SENT-BY="mailto:'+this.data.sentBy+'"'),this.data.delegatedTo&&(t+=';DELEGATED-TO="'+this.data.delegatedTo.email()+'"'),this.data.delegatedFrom&&(t+=';DELEGATED-FROM="'+this.data.delegatedFrom.email()+'"'),this.data.name&&(t+=';CN="'+s(this.data.name,!0)+'"'),this.data.email&&this.data.mailto&&(t+=";EMAIL="+s(this.data.email,!1)),this.data.x.length&&(t+=";"+this.data.x.map(([e,n])=>e.toUpperCase()+"="+s(n,!1)).join(";")),t+=":MAILTO:"+s(this.data.mailto||this.data.email,!1)+`\r
`,t}};var z=(n=>(n.display="display",n.audio="audio",n.email="email",n))(z||{}),Y={end:"END",start:"START"},p=class{constructor(t,e){if(this.data={type:"display",trigger:-600,relatesTo:null,repeat:null,interval:null,attach:null,description:null,summary:null,attendees:[],x:[]},this.event=e,!e)throw new Error("`event` option required!");t.type!==void 0&&this.type(t.type),"trigger"in t&&t.trigger!==void 0&&this.trigger(t.trigger),"triggerBefore"in t&&t.triggerBefore!==void 0&&this.triggerBefore(t.triggerBefore),"triggerAfter"in t&&t.triggerAfter!==void 0&&this.triggerAfter(t.triggerAfter),t.repeat&&this.repeat(t.repeat),t.attach!==void 0&&this.attach(t.attach),t.description!==void 0&&this.description(t.description),t.summary!==void 0&&this.summary(t.summary),t.attendees!==void 0&&this.attendees(t.attendees),t.x!==void 0&&this.x(t.x)}type(t){if(t===void 0)return this.data.type;if(!t||!Object.keys(z).includes(t))throw new Error("`type` is not correct, must be either `display` or `audio`!");return this.data.type=t,this}trigger(t){if(t===void 0&&typeof this.data.trigger=="number")return-1*this.data.trigger;if(t===void 0)return this.data.trigger;if(typeof t=="number"&&isFinite(t))this.data.trigger=-1*t;else{if(!t||typeof t=="number")throw new Error("`trigger` is not correct, must be a finite number or a supported date!");this.data.trigger=g(t,"trigger")}return this}relatesTo(t){if(t===void 0)return this.data.relatesTo;if(!t)return this.data.relatesTo=null,this;if(!Object.values(Y).includes(t))throw new Error("`relatesTo` is not correct, must be either `START` or `END`!");return this.data.relatesTo=t,this}triggerAfter(t){return t===void 0?this.data.trigger:this.trigger(typeof t=="number"?-1*t:t)}triggerBefore(t){return t===void 0?this.trigger():this.trigger(t)}repeat(t){if(t===void 0)return this.data.repeat;if(!t)return this.data.repeat=null,this;if(typeof t!="object")throw new Error("`repeat` is not correct, must be an object!");if(typeof t.times!="number"||!isFinite(t.times))throw new Error("`repeat.times` is not correct, must be numeric!");if(typeof t.interval!="number"||!isFinite(t.interval))throw new Error("`repeat.interval` is not correct, must be numeric!");return this.data.repeat=t,this}attach(t){if(t===void 0)return this.data.attach;if(!t)return this.data.attach=null,this;let e=null;if(typeof t=="string")e={uri:t,mime:null};else if(typeof t=="object")e={uri:t.uri,mime:t.mime||null};else throw new Error("`attachment` needs to be a valid formed string or an object. See https://sebbo2002.github.io/ical-generator/develop/reference/classes/ICalAlarm.html#attach");if(!e.uri)throw new Error("`attach.uri` is empty!");return this.data.attach={uri:e.uri,mime:e.mime},this}description(t){return t===void 0?this.data.description:t?(this.data.description=t,this):(this.data.description=null,this)}summary(t){return t===void 0?this.data.summary:t?(this.data.summary=t,this):(this.data.summary=null,this)}createAttendee(t){if(t instanceof f)return this.data.attendees.push(t),t;typeof t=="string"&&(t=T({email:t},I("data",t)));let e=new f(t,this);return this.data.attendees.push(e),e}attendees(t){return t?(t.forEach(e=>this.createAttendee(e)),this):this.data.attendees}x(t,e){if(t===void 0)return o(this.data);if(typeof t=="string"&&typeof e=="string")o(this.data,t,e);else if(typeof t=="object")o(this.data,t);else throw new Error("Either key or value is not a string!");return this}toJSON(){let t=this.trigger();return Object.assign({},this.data,{trigger:typeof t=="number"?t:m(t),x:this.x()})}toString(){var e;let t=`BEGIN:VALARM\r
`;if(t+="ACTION:"+this.data.type.toUpperCase()+`\r
`,typeof this.data.trigger=="number"&&this.data.relatesTo===null?this.data.trigger>0?t+="TRIGGER;RELATED=END:"+c(this.data.trigger)+`\r
`:t+="TRIGGER:"+c(this.data.trigger)+`\r
`:typeof this.data.trigger=="number"?t+="TRIGGER;RELATED="+((e=this.data.relatesTo)==null?void 0:e.toUpperCase())+":"+c(this.data.trigger)+`\r
`:t+="TRIGGER;VALUE=DATE-TIME:"+d(this.event.timezone(),this.data.trigger)+`\r
`,this.data.repeat){if(!this.data.repeat.times)throw new Error("No value for `repeat.times` in ICalAlarm given, but required for `interval`!");if(!this.data.repeat.interval)throw new Error("No value for `repeat.interval` in ICalAlarm given, but required for `repeat`!");t+="REPEAT:"+this.data.repeat.times+`\r
`,t+="DURATION:"+c(this.data.repeat.interval)+`\r
`}return this.data.type==="audio"&&this.data.attach&&this.data.attach.mime?t+="ATTACH;FMTTYPE="+s(this.data.attach.mime,!1)+":"+s(this.data.attach.uri,!1)+`\r
`:this.data.type==="audio"&&this.data.attach?t+="ATTACH;VALUE=URI:"+s(this.data.attach.uri,!1)+`\r
`:this.data.type==="audio"&&(t+=`ATTACH;VALUE=URI:Basso\r
`),this.data.type!=="audio"&&this.data.description?t+="DESCRIPTION:"+s(this.data.description,!1)+`\r
`:this.data.type!=="audio"&&(t+="DESCRIPTION:"+s(this.event.summary(),!1)+`\r
`),this.data.type==="email"&&this.data.summary?t+="SUMMARY:"+s(this.data.summary,!1)+`\r
`:this.data.type==="email"&&(t+="SUMMARY:"+s(this.event.summary(),!1)+`\r
`),this.data.type==="email"&&this.data.attendees.forEach(n=>{t+=n.toString()}),t+=b(this.data),t+=`END:VALARM\r
`,t}};var y=class{constructor(t){if(this.data={name:""},!t.name)throw new Error("No value for `name` in ICalCategory given!");this.name(t.name)}name(t){return t===void 0?this.data.name:(this.data.name=t,this)}toJSON(){return Object.assign({},this.data)}toString(){return s(this.data.name,!1)}};var x=(u=>(u.SECONDLY="SECONDLY",u.MINUTELY="MINUTELY",u.HOURLY="HOURLY",u.DAILY="DAILY",u.WEEKLY="WEEKLY",u.MONTHLY="MONTHLY",u.YEARLY="YEARLY",u))(x||{}),S=(u=>(u.SU="SU",u.MO="MO",u.TU="TU",u.WE="WE",u.TH="TH",u.FR="FR",u.SA="SA",u))(S||{});var U=(n=>(n.CONFIRMED="CONFIRMED",n.TENTATIVE="TENTATIVE",n.CANCELLED="CANCELLED",n))(U||{}),B=(i=>(i.FREE="FREE",i.TENTATIVE="TENTATIVE",i.BUSY="BUSY",i.OOF="OOF",i))(B||{}),P=(e=>(e.TRANSPARENT="TRANSPARENT",e.OPAQUE="OPAQUE",e))(P||{}),k=(n=>(n.PUBLIC="PUBLIC",n.PRIVATE="PRIVATE",n.CONFIDENTIAL="CONFIDENTIAL",n))(k||{}),D=class{constructor(t,e){if(this.data={id:(0,Z.default)(),sequence:0,start:new Date,end:null,recurrenceId:null,timezone:null,stamp:new Date,allDay:!1,floating:!1,repeating:null,summary:"",location:null,description:null,organizer:null,attendees:[],alarms:[],categories:[],status:null,busystatus:null,priority:null,url:null,attachments:[],transparency:null,created:null,lastModified:null,class:null,x:[]},this.calendar=e,!e)throw new Error("`calendar` option required!");t.id&&this.id(t.id),t.sequence!==void 0&&this.sequence(t.sequence),t.start&&this.start(t.start),t.end!==void 0&&this.end(t.end),t.recurrenceId!==void 0&&this.recurrenceId(t.recurrenceId),t.timezone!==void 0&&this.timezone(t.timezone),t.stamp!==void 0&&this.stamp(t.stamp),t.allDay!==void 0&&this.allDay(t.allDay),t.floating!==void 0&&this.floating(t.floating),t.repeating!==void 0&&this.repeating(t.repeating),t.summary!==void 0&&this.summary(t.summary),t.location!==void 0&&this.location(t.location),t.description!==void 0&&this.description(t.description),t.organizer!==void 0&&this.organizer(t.organizer),t.attendees!==void 0&&this.attendees(t.attendees),t.alarms!==void 0&&this.alarms(t.alarms),t.categories!==void 0&&this.categories(t.categories),t.status!==void 0&&this.status(t.status),t.busystatus!==void 0&&this.busystatus(t.busystatus),t.priority!==void 0&&this.priority(t.priority),t.url!==void 0&&this.url(t.url),t.attachments!==void 0&&this.attachments(t.attachments),t.transparency!==void 0&&this.transparency(t.transparency),t.created!==void 0&&this.created(t.created),t.lastModified!==void 0&&this.lastModified(t.lastModified),t.class!==void 0&&this.class(t.class),t.x!==void 0&&this.x(t.x)}id(t){return t===void 0?this.data.id:(this.data.id=String(t),this)}uid(t){return t===void 0?this.id():this.id(t)}sequence(t){if(t===void 0)return this.data.sequence;let e=parseInt(String(t),10);if(isNaN(e))throw new Error("`sequence` must be a number!");return this.data.sequence=t,this}start(t){return t===void 0?(this.swapStartAndEndIfRequired(),this.data.start):(this.data.start=g(t,"start"),this)}end(t){return t===void 0?(this.swapStartAndEndIfRequired(),this.data.end):t===null?(this.data.end=null,this):(this.data.end=g(t,"end"),this)}swapStartAndEndIfRequired(){if(this.data.start&&this.data.end&&J(this.data.start).getTime()>J(this.data.end).getTime()){let t=this.data.start;this.data.start=this.data.end,this.data.end=t}}recurrenceId(t){return t===void 0?this.data.recurrenceId:t===null?(this.data.recurrenceId=null,this):(this.data.recurrenceId=g(t,"recurrenceId"),this)}timezone(t){return t===void 0&&this.data.timezone!==null?this.data.timezone:t===void 0?this.calendar.timezone():(this.data.timezone=t&&t!=="UTC"?t.toString():null,this.data.timezone&&(this.data.floating=!1),this)}stamp(t){return t===void 0?this.data.stamp:(this.data.stamp=g(t,"stamp"),this)}timestamp(t){return t===void 0?this.stamp():this.stamp(t)}allDay(t){return t===void 0?this.data.allDay:(this.data.allDay=!!t,this)}floating(t){return t===void 0?this.data.floating:(this.data.floating=!!t,this.data.floating&&(this.data.timezone=null),this)}repeating(t){if(t===void 0)return this.data.repeating;if(!t)return this.data.repeating=null,this;if(M(t)||typeof t=="string")return this.data.repeating=t,this;if(this.data.repeating={freq:h(x,t.freq)},t.count){if(!isFinite(t.count))throw new Error("`repeating.count` must be a finite number!");this.data.repeating.count=t.count}if(t.interval){if(!isFinite(t.interval))throw new Error("`repeating.interval` must be a finite number!");this.data.repeating.interval=t.interval}if(t.until!==void 0&&(this.data.repeating.until=g(t.until,"repeating.until")),t.byDay){let e=Array.isArray(t.byDay)?t.byDay:[t.byDay];this.data.repeating.byDay=e.map(n=>h(S,n))}if(t.byMonth){let e=Array.isArray(t.byMonth)?t.byMonth:[t.byMonth];this.data.repeating.byMonth=e.map(n=>{if(typeof n!="number"||n<1||n>12)throw new Error("`repeating.byMonth` contains invalid value `"+n+"`!");return n})}if(t.byMonthDay){let e=Array.isArray(t.byMonthDay)?t.byMonthDay:[t.byMonthDay];this.data.repeating.byMonthDay=e.map(n=>{if(typeof n!="number"||n<-31||n>31||n===0)throw new Error("`repeating.byMonthDay` contains invalid value `"+n+"`!");return n})}if(t.bySetPos){if(!this.data.repeating.byDay)throw"`repeating.bySetPos` must be used along with `repeating.byDay`!";let e=Array.isArray(t.bySetPos)?t.bySetPos:[t.bySetPos];this.data.repeating.bySetPos=e.map(n=>{if(typeof n!="number"||n<-366||n>366||n===0)throw"`repeating.bySetPos` contains invalid value `"+n+"`!";return n})}if(t.exclude){let e=Array.isArray(t.exclude)?t.exclude:[t.exclude];this.data.repeating.exclude=e.map((n,i)=>g(n,`repeating.exclude[${i}]`))}return t.startOfWeek&&(this.data.repeating.startOfWeek=h(S,t.startOfWeek)),this}summary(t){return t===void 0?this.data.summary:(this.data.summary=t?String(t):"",this)}location(t){if(t===void 0)return this.data.location;if(typeof t=="string")return this.data.location={title:t},this;if(t&&("title"in t&&!t.title||t!=null&&t.geo&&(!isFinite(t.geo.lat)||!isFinite(t.geo.lon))||!("title"in t)&&!(t!=null&&t.geo)))throw new Error("`location` isn't formatted correctly. See https://sebbo2002.github.io/ical-generator/develop/reference/classes/ICalEvent.html#location");return this.data.location=t||null,this}description(t){return t===void 0?this.data.description:t===null?(this.data.description=null,this):(typeof t=="string"?this.data.description={plain:t}:this.data.description=t,this)}organizer(t){return t===void 0?this.data.organizer:t===null?(this.data.organizer=null,this):(this.data.organizer=I("organizer",t),this)}createAttendee(t){if(t instanceof f)return this.data.attendees.push(t),t;typeof t=="string"&&(t=T({email:t},I("data",t)));let e=new f(t,this);return this.data.attendees.push(e),e}attendees(t){return t?(t.forEach(e=>this.createAttendee(e)),this):this.data.attendees}createAlarm(t){let e=t instanceof p?t:new p(t,this);return this.data.alarms.push(e),e}alarms(t){return t?(t.forEach(e=>this.createAlarm(e)),this):this.data.alarms}createCategory(t){let e=t instanceof y?t:new y(t);return this.data.categories.push(e),e}categories(t){return t?(t.forEach(e=>this.createCategory(e)),this):this.data.categories}status(t){return t===void 0?this.data.status:t===null?(this.data.status=null,this):(this.data.status=h(U,t),this)}busystatus(t){return t===void 0?this.data.busystatus:t===null?(this.data.busystatus=null,this):(this.data.busystatus=h(B,t),this)}priority(t){if(t===void 0)return this.data.priority;if(t===null)return this.data.priority=null,this;if(t<0||t>9)throw new Error("`priority` is invalid, musst be 0 \u2264 priority \u2264 9.");return this.data.priority=Math.round(t),this}url(t){return t===void 0?this.data.url:(this.data.url=t?String(t):null,this)}createAttachment(t){return this.data.attachments.push(t),this}attachments(t){return t?(t.forEach(e=>this.createAttachment(e)),this):this.data.attachments}transparency(t){return t===void 0?this.data.transparency:t?(this.data.transparency=h(P,t),this):(this.data.transparency=null,this)}created(t){return t===void 0?this.data.created:t===null?(this.data.created=null,this):(this.data.created=g(t,"created"),this)}lastModified(t){return t===void 0?this.data.lastModified:t===null?(this.data.lastModified=null,this):(this.data.lastModified=g(t,"lastModified"),this)}class(t){return t===void 0?this.data.class:t===null?(this.data.class=null,this):(this.data.class=h(k,t),this)}x(t,e){return t===void 0?o(this.data):(typeof t=="string"&&typeof e=="string"&&o(this.data,t,e),typeof t=="object"&&o(this.data,t),this)}toJSON(){var e;let t=null;return M(this.data.repeating)||typeof this.data.repeating=="string"?t=this.data.repeating.toString():this.data.repeating&&(t=Object.assign({},this.data.repeating,{until:m(this.data.repeating.until)||void 0,exclude:(e=this.data.repeating.exclude)==null?void 0:e.map(n=>m(n))})),this.swapStartAndEndIfRequired(),Object.assign({},this.data,{start:m(this.data.start)||null,end:m(this.data.end)||null,recurrenceId:m(this.data.recurrenceId)||null,stamp:m(this.data.stamp)||null,created:m(this.data.created)||null,lastModified:m(this.data.lastModified)||null,repeating:t,x:this.x()})}toString(){var e,n,i,r;let t="";if(t+=`BEGIN:VEVENT\r
`,t+="UID:"+this.data.id+`\r
`,t+="SEQUENCE:"+this.data.sequence+`\r
`,this.swapStartAndEndIfRequired(),t+="DTSTAMP:"+d(this.calendar.timezone(),this.data.stamp)+`\r
`,this.data.allDay?(t+="DTSTART;VALUE=DATE:"+d(this.timezone(),this.data.start,!0)+`\r
`,this.data.end&&(t+="DTEND;VALUE=DATE:"+d(this.timezone(),this.data.end,!0)+`\r
`),t+=`X-MICROSOFT-CDO-ALLDAYEVENT:TRUE\r
`,t+=`X-MICROSOFT-MSNCALENDAR-ALLDAYEVENT:TRUE\r
`):(t+=E(this.timezone(),"DTSTART",this.data.start,this.data)+`\r
`,this.data.end&&(t+=E(this.timezone(),"DTEND",this.data.end,this.data)+`\r
`)),M(this.data.repeating)||typeof this.data.repeating=="string"){let l=this.data.repeating.toString().replace(/\r\n/g,`
`).split(`
`).filter(u=>u&&!u.startsWith("DTSTART:")).join(`\r
`);!l.includes(`\r
`)&&!l.startsWith("RRULE:")&&(l="RRULE:"+l),t+=l.trim()+`\r
`}else this.data.repeating&&(t+="RRULE:FREQ="+this.data.repeating.freq,this.data.repeating.count&&(t+=";COUNT="+this.data.repeating.count),this.data.repeating.interval&&(t+=";INTERVAL="+this.data.repeating.interval),this.data.repeating.until&&(t+=";UNTIL="+d(this.calendar.timezone(),this.data.repeating.until,!1,this.floating())),this.data.repeating.byDay&&(t+=";BYDAY="+this.data.repeating.byDay.join(",")),this.data.repeating.byMonth&&(t+=";BYMONTH="+this.data.repeating.byMonth.join(",")),this.data.repeating.byMonthDay&&(t+=";BYMONTHDAY="+this.data.repeating.byMonthDay.join(",")),this.data.repeating.bySetPos&&(t+=";BYSETPOS="+this.data.repeating.bySetPos.join(",")),this.data.repeating.startOfWeek&&(t+=";WKST="+this.data.repeating.startOfWeek),t+=`\r
`,this.data.repeating.exclude&&(this.data.allDay?t+="EXDATE;VALUE=DATE:"+this.data.repeating.exclude.map(l=>d(this.calendar.timezone(),l,!0)).join(",")+`\r
`:(t+="EXDATE",this.timezone()?t+=";TZID="+this.timezone()+":"+this.data.repeating.exclude.map(l=>d(this.timezone(),l,!1,!0)).join(",")+`\r
`:t+=":"+this.data.repeating.exclude.map(l=>d(this.timezone(),l,!1,this.floating())).join(",")+`\r
`)));return this.data.recurrenceId&&(t+=E(this.timezone(),"RECURRENCE-ID",this.data.recurrenceId,this.data)+`\r
`),t+="SUMMARY:"+s(this.data.summary,!1)+`\r
`,this.data.transparency&&(t+="TRANSP:"+s(this.data.transparency,!1)+`\r
`),this.data.location&&"title"in this.data.location&&this.data.location.title&&(t+="LOCATION:"+s(this.data.location.title+(this.data.location.address?`
`+this.data.location.address:""),!1)+`\r
`,this.data.location.radius&&this.data.location.geo&&(t+="X-APPLE-STRUCTURED-LOCATION;VALUE=URI;"+(this.data.location.address?"X-ADDRESS="+s(this.data.location.address,!1)+";":"")+"X-APPLE-RADIUS="+s(this.data.location.radius,!1)+";X-TITLE="+s(this.data.location.title,!1)+":geo:"+s((e=this.data.location.geo)==null?void 0:e.lat,!1)+","+s((n=this.data.location.geo)==null?void 0:n.lon,!1)+`\r
`)),this.data.location&&"geo"in this.data.location&&this.data.location.geo&&(t+="GEO:"+s((i=this.data.location.geo)==null?void 0:i.lat,!1)+";"+s((r=this.data.location.geo)==null?void 0:r.lon,!1)+`\r
`),this.data.description&&(t+="DESCRIPTION:"+s(this.data.description.plain,!1)+`\r
`,this.data.description.html&&(t+="X-ALT-DESC;FMTTYPE=text/html:"+s(this.data.description.html,!1)+`\r
`)),this.data.organizer&&(t+='ORGANIZER;CN="'+s(this.data.organizer.name,!0)+'"',this.data.organizer.sentBy&&(t+=';SENT-BY="mailto:'+s(this.data.organizer.sentBy,!0)+'"'),this.data.organizer.email&&this.data.organizer.mailto&&(t+=";EMAIL="+s(this.data.organizer.email,!1)),this.data.organizer.email&&(t+=":mailto:"+s(this.data.organizer.mailto||this.data.organizer.email,!1)),t+=`\r
`),this.data.attendees.forEach(function(l){t+=l.toString()}),this.data.alarms.forEach(function(l){t+=l.toString()}),this.data.categories.length>0&&(t+="CATEGORIES:"+this.data.categories.map(l=>l.toString()).join()+`\r
`),this.data.url&&(t+="URL;VALUE=URI:"+s(this.data.url,!1)+`\r
`),this.data.attachments.length>0&&this.data.attachments.forEach(l=>{t+="ATTACH:"+s(l,!1)+`\r
`}),this.data.status&&(t+="STATUS:"+this.data.status.toUpperCase()+`\r
`),this.data.busystatus&&(t+="X-MICROSOFT-CDO-BUSYSTATUS:"+this.data.busystatus.toUpperCase()+`\r
`),this.data.priority!==null&&(t+="PRIORITY:"+this.data.priority+`\r
`),t+=b(this.data),this.data.created&&(t+="CREATED:"+d(this.calendar.timezone(),this.data.created)+`\r
`),this.data.lastModified&&(t+="LAST-MODIFIED:"+d(this.calendar.timezone(),this.data.lastModified)+`\r
`),this.data.class&&(t+="CLASS:"+this.data.class.toUpperCase()+`\r
`),t+=`END:VEVENT\r
`,t}};var F=(C=>(C.PUBLISH="PUBLISH",C.REQUEST="REQUEST",C.REPLY="REPLY",C.ADD="ADD",C.CANCEL="CANCEL",C.REFRESH="REFRESH",C.COUNTER="COUNTER",C.DECLINECOUNTER="DECLINECOUNTER",C))(F||{}),A=class{constructor(t={}){this.data={prodId:"//sebbo.net//ical-generator//EN",method:null,name:null,description:null,timezone:null,source:null,url:null,scale:null,ttl:null,events:[],x:[]},t.prodId!==void 0&&this.prodId(t.prodId),t.method!==void 0&&this.method(t.method),t.name!==void 0&&this.name(t.name),t.description!==void 0&&this.description(t.description),t.timezone!==void 0&&this.timezone(t.timezone),t.source!==void 0&&this.source(t.source),t.url!==void 0&&this.url(t.url),t.scale!==void 0&&this.scale(t.scale),t.ttl!==void 0&&this.ttl(t.ttl),t.events!==void 0&&this.events(t.events),t.x!==void 0&&this.x(t.x)}prodId(t){if(!t)return this.data.prodId;if(typeof t=="string")return this.data.prodId=t,this;if(typeof t!="object")throw new Error("`prodid` needs to be a string or an object!");if(!t.company)throw new Error("`prodid.company` is a mandatory item!");if(!t.product)throw new Error("`prodid.product` is a mandatory item!");let e=(t.language||"EN").toUpperCase();return this.data.prodId="//"+t.company+"//"+t.product+"//"+e,this}method(t){return t===void 0?this.data.method:t?(this.data.method=h(F,t),this):(this.data.method=null,this)}name(t){return t===void 0?this.data.name:(this.data.name=t?String(t):null,this)}description(t){return t===void 0?this.data.description:(this.data.description=t?String(t):null,this)}timezone(t){var e;return t===void 0?((e=this.data.timezone)==null?void 0:e.name)||null:(t==="UTC"?this.data.timezone=null:typeof t=="string"?this.data.timezone={name:t}:t===null?this.data.timezone=null:this.data.timezone=t,this)}source(t){return t===void 0?this.data.source:(this.data.source=t||null,this)}url(t){return t===void 0?this.data.url:(this.data.url=t||null,this)}scale(t){return t===void 0?this.data.scale:(t===null?this.data.scale=null:this.data.scale=t.toUpperCase(),this)}ttl(t){return t===void 0?this.data.ttl:(X(t)?this.data.ttl=t.asSeconds():t&&t>0?this.data.ttl=t:this.data.ttl=null,this)}createEvent(t){let e=t instanceof D?t:new D(t,this);return this.data.events.push(e),e}events(t){return t?(t.forEach(e=>this.createEvent(e)),this):this.data.events}clear(){return this.data.events=[],this}x(t,e){if(t===void 0)return o(this.data);if(typeof t=="string"&&typeof e=="string")o(this.data,t,e);else if(typeof t=="object")o(this.data,t);else throw new Error("Either key or value is not a string!");return this}toJSON(){return Object.assign({},this.data,{timezone:this.timezone(),events:this.data.events.map(t=>t.toJSON()),x:this.x()})}length(){return this.data.events.length}toString(){var e,n;let t="";return t=`BEGIN:VCALENDAR\r
VERSION:2.0\r
`,t+="PRODID:-"+this.data.prodId+`\r
`,this.data.url&&(t+="URL:"+this.data.url+`\r
`),this.data.source&&(t+="SOURCE;VALUE=URI:"+this.data.source+`\r
`),this.data.scale&&(t+="CALSCALE:"+this.data.scale+`\r
`),this.data.method&&(t+="METHOD:"+this.data.method+`\r
`),this.data.name&&(t+="NAME:"+this.data.name+`\r
`,t+="X-WR-CALNAME:"+this.data.name+`\r
`),this.data.description&&(t+="X-WR-CALDESC:"+this.data.description+`\r
`),(e=this.data.timezone)!=null&&e.generator&&[...new Set([this.timezone(),...this.data.events.map(r=>r.timezone())])].filter(r=>r!==null&&!r.startsWith("/")).forEach(r=>{var u;if(!((u=this.data.timezone)!=null&&u.generator))return;let l=this.data.timezone.generator(r);l&&(t+=l.replace(/\r\n/g,`
`).replace(/\n/g,`\r
`).trim()+`\r
`)}),(n=this.data.timezone)!=null&&n.name&&(t+="TIMEZONE-ID:"+this.data.timezone.name+`\r
`,t+="X-WR-TIMEZONE:"+this.data.timezone.name+`\r
`),this.data.ttl&&(t+="REFRESH-INTERVAL;VALUE=DURATION:"+c(this.data.ttl)+`\r
`,t+="X-PUBLISHED-TTL:"+c(this.data.ttl)+`\r
`),this.data.events.forEach(i=>t+=i.toString()),t+=b(this.data),t+="END:VCALENDAR",v(t)}};function rt(a){return new A(a)}var st=rt;0&&(module.exports={ICalAlarm,ICalAlarmRelatesTo,ICalAlarmType,ICalAttendee,ICalAttendeeRole,ICalAttendeeStatus,ICalAttendeeType,ICalCalendar,ICalCalendarMethod,ICalCategory,ICalEvent,ICalEventBusyStatus,ICalEventClass,ICalEventRepeatingFreq,ICalEventStatus,ICalEventTransparency,ICalWeekday,escape,foldLines,formatDate,formatDateTZ});

},{"uuid-random":4}],4:[function(require,module,exports){
"use strict";

(function(){

  var
    buf,
    bufIdx = 0,
    hexBytes = [],
    i
  ;

  // Pre-calculate toString(16) for speed
  for (i = 0; i < 256; i++) {
    hexBytes[i] = (i + 0x100).toString(16).substr(1);
  }

  // Buffer random numbers for speed
  // Reduce memory usage by decreasing this number (min 16)
  // or improve speed by increasing this number (try 16384)
  uuid.BUFFER_SIZE = 4096;

  // Binary uuids
  uuid.bin = uuidBin;

  // Clear buffer
  uuid.clearBuffer = function() {
    buf = null;
    bufIdx = 0;
  };

  // Test for uuid
  uuid.test = function(uuid) {
    if (typeof uuid === 'string') {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
    }
    return false;
  };

  // Node & Browser support
  var crypt0;
  if (typeof crypto !== 'undefined') {
    crypt0 = crypto;
  } else if( (typeof window !== 'undefined') && (typeof window.msCrypto !== 'undefined')) {
    crypt0 = window.msCrypto; // IE11
  }

  if ((typeof module !== 'undefined') && (typeof require === 'function')) {
    crypt0 = crypt0 || require('crypto');
    module.exports = uuid;
  } else if (typeof window !== 'undefined') {
    window.uuid = uuid;
  }

  // Use best available PRNG
  // Also expose this so you can override it.
  uuid.randomBytes = (function(){
    if (crypt0) {
      if (crypt0.randomBytes) {
        return crypt0.randomBytes;
      }
      if (crypt0.getRandomValues) {
        if (typeof Uint8Array.prototype.slice !== 'function') {
          return function(n) {
            var bytes = new Uint8Array(n);
            crypt0.getRandomValues(bytes);
            return Array.from(bytes);
          };
        }
        return function(n) {
          var bytes = new Uint8Array(n);
          crypt0.getRandomValues(bytes);
          return bytes;
        };
      }
    }
    return function(n) {
      var i, r = [];
      for (i = 0; i < n; i++) {
        r.push(Math.floor(Math.random() * 256));
      }
      return r;
    };
  })();

  // Buffer some random bytes for speed
  function randomBytesBuffered(n) {
    if (!buf || ((bufIdx + n) > uuid.BUFFER_SIZE)) {
      bufIdx = 0;
      buf = uuid.randomBytes(uuid.BUFFER_SIZE);
    }
    return buf.slice(bufIdx, bufIdx += n);
  }

  // uuid.bin
  function uuidBin() {
    var b = randomBytesBuffered(16);
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    return b;
  }

  // String UUIDv4 (Random)
  function uuid() {
    var b = uuidBin();
    return hexBytes[b[0]] + hexBytes[b[1]] +
      hexBytes[b[2]] + hexBytes[b[3]] + '-' +
      hexBytes[b[4]] + hexBytes[b[5]] + '-' +
      hexBytes[b[6]] + hexBytes[b[7]] + '-' +
      hexBytes[b[8]] + hexBytes[b[9]] + '-' +
      hexBytes[b[10]] + hexBytes[b[11]] +
      hexBytes[b[12]] + hexBytes[b[13]] +
      hexBytes[b[14]] + hexBytes[b[15]]
    ;
  }

})();

},{"crypto":1}]},{},[2]);
