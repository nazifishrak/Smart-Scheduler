import React, { useEffect, useState } from 'react';
import { Task } from '../types';
import { generateTimeline } from '../services/geminiService';
import { initializeGoogleSignIn, listUpcomingEvents } from '../services/googleCalendarService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader, Calendar } from 'lucide-react';

interface TimelineProps {
  tasks: Task[];
}

const Timeline: React.FC<TimelineProps> = ({ tasks }) => {
  const [aiTimeline, setAiTimeline] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  useEffect(() => {
    initializeGoogleSignIn((signedIn) => {
      setIsSignedIn(signedIn);
    });
  }, []);

  const fetchTimelineWithCalendar = async () => {
    setLoading(true);
    setError(null);
    try {
      const calendarEvents = await listUpcomingEvents();
      const timeline = await generateTimeline(tasks, calendarEvents);
      if (timeline.startsWith('Error:')) {
        setError(timeline);
        setAiTimeline('');
      } else {
        setAiTimeline(timeline);
      }
    } catch (err) {
      setError('Failed to generate timeline. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tasks.length > 0 && isSignedIn) {
      fetchTimelineWithCalendar();
    } else if (tasks.length > 0) {
      generateTimeline(tasks).then(setAiTimeline).catch(console.error);
    } else {
      setAiTimeline('');
    }
  }, [tasks, isSignedIn]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-lg">Planning your day...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4"
        role="alert"
      >
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!isSignedIn && (
        <div id="googleSignInButton" className="flex justify-center"></div>
      )}
      {aiTimeline ? (
        <div className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto">
                  <table
                    className="min-w-full divide-y divide-gray-200"
                    {...props}
                  />
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead className="bg-gray-50" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td className="px-6 py-4 whitespace-nowrap" {...props} />
              ),
              tr: ({ node, ...props }) => (
                <tr className="bg-white even:bg-gray-50" {...props} />
              ),
            }}
          >
            {aiTimeline}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">
          No tasks available. Add some tasks to generate a timeline.
        </p>
      )}
    </div>
  );
};

export default Timeline;