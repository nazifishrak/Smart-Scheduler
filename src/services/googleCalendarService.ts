import { GOOGLE_CLIENT_ID } from '../config';

declare global {
  interface Window {
    google: any;
  }
}

let tokenClient: any;

export function initializeGoogleSignIn(callback: (signedIn: boolean) => void) {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.onload = () => {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      callback: (resp: any) => {
        if (resp.error !== undefined) {
          throw resp;
        }
        callback(true);
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById('googleSignInButton'),
      { theme: 'outline', size: 'large' }
    );
  };
  document.body.appendChild(script);
}

function handleCredentialResponse(response: any) {
  // This function will handle the initial sign-in
  console.log('Encoded JWT ID token: ' + response.credential);
  // You can send this token to your server for verification
  // For now, we'll just request access to the Calendar API
  tokenClient.requestAccessToken();
}

export async function listUpcomingEvents(): Promise<any[]> {
  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=' + new Date().toISOString() + '&maxResults=10&orderBy=startTime&singleEvents=true', {
      headers: {
        'Authorization': 'Bearer ' + tokenClient.getAccessToken().access_token
      }
    });
    const data = await response.json();
    return data.items || [];
  } catch (err) {
    console.error('Error fetching calendar events:', err);
    return [];
  }
}