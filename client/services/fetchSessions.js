// Fetch all sessions
async function fetchSessions() {
    try {
        const response = await fetch('http://localhost:5000/sessions');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const sessions = await response.json();
        console.log("sessions fetched")
        return sessions;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Add a new session
async function addSession(session) {
    try {
        const response = await fetch('http://localhost:5000/sessions/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(session),
        });

        if (!response.ok) {
            throw new Error('Failed to add session');
        }

        const newSession = await response.json();
        console.log('Added session:', newSession);
        return newSession;
    } catch (error) {
        console.error('There was a problem adding the session:', error);
    }
}

// Update a session
async function updateSession(id, updatedSession) {
    try {
        const response = await fetch(`http://localhost:5000/sessions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedSession),
        });

        if (!response.ok) {
            throw new Error('Failed to update session');
        }

        const result = await response.json();
        console.log(`Updated session with ID ${id}:`, result);
        return result;
    } catch (error) {
        console.error('There was a problem updating the session:', error);
    }
}

// Delete a session
async function deleteSession(id) {
    try {
        const response = await fetch(`http://localhost:5000/sessions/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete session');
        }

        console.log(`Deleted session with ID ${id}`);
    } catch (error) {
        console.error('There was a problem deleting the session:', error);
    }
}

export { fetchSessions, addSession, updateSession, deleteSession };
