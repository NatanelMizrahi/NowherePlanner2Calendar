# NowherePlanner2Calendar
🦄 Hello Nobodies! 🦄

This is a tool to convert the whatwherewhen.guide planner to ICS file to be imported to Google Calendar (or similar).


Follow the easy steps below.

Based on the [What Where When guide website](https://whatwherewhen.guide) (not my work! Awesome job!!!)

## What is it good for?
* **Saves paper:** Carry all the info on your mobile, rather than using a paper guide
* **Available offline:** once synced to your phone, the calendar with all the details is accecible offline
* **Customizable:** you can add colors to events, rename, add notes, etc. 

## How to use
1. Add events to the planner here: https://whatwherewhen.guide/Directory

2. Copy the code from [this page](https://github.com/NatanelMizrahi/NowherePlanner2Calendar/blob/main/bundle.js) via the copy button
<img src="https://github.com/NatanelMizrahi/NowherePlanner2Calendar/assets/20489303/e8cdd411-0087-4b07-a4ac-4c7d1e506a99" width="200" />

3. Go to the planner tab in https://whatwherewhen.guide/planner
<img src="https://github.com/NatanelMizrahi/NowherePlanner2Calendar/assets/20489303/613dbb08-471f-4617-928b-64e5d3085c96" width="250" />

4. Press F12 while in the planner tab to open the developer console in the `console` tab.

   **Note**: You may get a warning in the console upon pasting, in which case type `allow pasting` and press enter


5. paste the code and press ENTER to download **Nowhere.ics**
<img src="https://github.com/NatanelMizrahi/NowherePlanner2Calendar/assets/20489303/3f7a7b4c-98da-4e09-be71-8c35282f9d23" width="250" />

6. Go to [Google Calendar](https://calendar.google.com/calendar/u/0/r) or your favorite app

7. Press the "+" next to "Other Calendars" in the sidebar and click import
<img src="https://github.com/NatanelMizrahi/NowherePlanner2Calendar/assets/20489303/581418cd-6660-48a9-90e2-9e732403c93a" width="150" />

8. Select the desired calendar, upload the file and click "Import"
<img src="https://github.com/NatanelMizrahi/NowherePlanner2Calendar/assets/20489303/96902422-d6c9-4ed3-9a58-34a3040e77ca" width="200" />

### Sample Result
<img src="https://github.com/NatanelMizrahi/NowherePlanner2Calendar/assets/20489303/28490be6-c2db-45d5-ae68-1c0a960d1103" width="500" />

### Geeky Notes
* Used https://browserify.org/ to convert the node.js script to a browser-supported script.
