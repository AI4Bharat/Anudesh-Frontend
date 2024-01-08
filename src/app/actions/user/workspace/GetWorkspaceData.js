const BASE_URL = 'https://backend.dev.anudesh.ai4bharat.org/workspaces/';

export const GetWorkspaceData = async () => {
  try {
 
    const token = localStorage.getItem('access');

    const response = await fetch(`${BASE_URL}`, {
      method: 'GET',
      headers: {
        Authorization: `JWT ${token}`, 
        'Content-Type': 'application/json', 
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching workspace data:', error);
    throw error;
  }
};
