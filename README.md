# Meditation App

    1. Simple app with home page showing meditation exercises for the week 
	2. Input meditation exercises into the database via the "Manage Exercises" page.
	3. Assign exercises to specific days and time using the "Schedule" page.
	4. Receive notifications on Android phone as reminders to practice- receive push notification on my phone at the scheduled times with the text in the exercise

## tech stack

	- React
	- Tailwind
	- Firebase 
    - Firebase Cloud Messaging for push notifications

## app pages

    1. Home Page: Overview of your meditation schedule for the week, starting with today.  Has a Button: "Assign Exercises" (navigates to Assignment Page).

    2. Manage Exercises Page:  Add/edit/delete meditation exercises.
        ○ Text field to input an exercise (name, description, duration).
        ○ List of saved exercises.
        ○ Buttons:
            § "Add Exercise" (opens form to create a new exercise).
            § "Edit" and "Delete" for each exercise.
    3. Schedule Page: A list of available exercises is displayed.
        Users select an exercise, which opens a form with:
        - A date picker to select the day of week (Mon, Tues, Wed, Thu, Fri, Sat, Sun)
        A time picker to set the reminder time.
        Example:         Select "Mindfulness Breathing" → Pick date → Pick time → Save.