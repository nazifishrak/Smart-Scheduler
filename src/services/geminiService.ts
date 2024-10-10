import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config';
import { Task } from '../types';

let genAI: GoogleGenerativeAI | null = null;

if (GEMINI_API_KEY ) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

export async function generateTimeline(tasks: Task[], calendarEvents: any[] = []): Promise<string> {
  if (!genAI) {
    return 'Error: GEMINI API key is not set. Please update the API key in the config file.';
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const prompt = `
    Given the following list of incomplete tasks:
    ${incompleteTasks
      .map(
        (task) =>
          `- ${task.title} (Priority: ${task.priority}, Estimated Time: ${task.estimatedTime} minutes)`
      )
      .join('\n')}

    And the following calendar events:
    ${calendarEvents
      .map(
        (event) =>
          `- ${event.summary} (Start: ${event.start.dateTime || event.start.date}, End: ${event.end.dateTime || event.end.date})`
      )
      .join('\n')}

    Current time: ${new Date().toLocaleString()}
    Hype up the user and motivate them to finish the work as well and don't make the writing too clunky. You should consider proven psychological nudging to make the user successful.

    Please create an informative timeline with the following:
    1. A suggested order for completing the incomplete tasks, taking into account the calendar events
    2. Estimated start and end times for each task, working around the calendar events
    3. Suggested breaks between tasks
    4. Brief descriptions or tips on how to approach each task
    5. An overall strategy for completing all tasks efficiently while attending to calendar events
    6. Don't explicitly write the priority and show the timeline in a nice table

    Additionally, provide a brief summary of the ${
      completedTasks.length
    } completed task(s) and their impact on the overall progress.

    Format the response in Markdown with *TABLE* for easy rendering and always give a table for the timeline and use appropriate emojis.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating timeline:', error);
    return 'Error: Failed to generate timeline. Please check your API key and try again.';
  }
}