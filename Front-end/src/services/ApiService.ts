import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // removed "/api" since your backend doesn't prefix it
  withCredentials: true, // important for session-based logic
  headers: {
    'Content-Type': 'application/json',
  },
});

const ApiService = {
  // Get stats
  getStats: async () => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        coaches: 140,
        members: 978,
        programs: 50,
      };
    }
  },

  // Get programs
  getPrograms: async () => {
    try {
      const response = await api.get('/programs');
      return response.data;
    } catch (error) {
      console.error('Error fetching programs:', error);
      return [];
    }
  },

  // Get testimonials
  getTestimonials: async () => {
    try {
      const response = await api.get('/testimonials');
      return response.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },

  // Subscribe
  subscribe: async (email: any) => {
    try {
      const response = await api.post('/subscribe', { email });
      return response.data;
    } catch (error) {
      console.error('Error subscribing:', error);
      throw error;
    }
  },

  // Join plan
  joinPlan: async (planData: any) => {
    try {
      const response = await api.post('/join', planData);
      return response.data;
    } catch (error) {
      console.error('Error joining plan:', error);
      throw error;
    }
  },

  // Route user to instructions to set session
  goToExerciseInstructions: async (exercise_type: string) => {
    try {
      // Just trigger the GET request to set session on the backend
      let path = '';
      switch (exercise_type ) {
        case 'bicep_curls':
          path = '/bicep_curls_instructions';
          break;
        case 'pushups':
          path = '/push_ups_instructions';
          break;
        case 'squats':
          path = '/squats_instructions';
          break;
        default:
          throw new Error('Invalid exercise type');
      }
      await api.get(path);
    } catch (error) {
      console.error('Error setting exercise session:', error);
    }
  },

  // Load the exercise interface
  getExerciseInterface: async () => {
    try {
      const response = await api.get('/exercise_interface');
      return response.data;
    } catch (error) {
      console.error('Error loading exercise interface:', error);
      return null;
    }
  },

  // This can be used to embed or open the video feed
  getVideoFeedUrl: () => {
    return 'http://localhost:5000/video_feed'; // direct feed URL (streamed with correct session type)
  },
// ------------------- AUTHENTICATION -------------------

  /**
   * Logs in the user.
   * @param credentials Object: { email: string, password: string }
   */
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch (error) {
      console.error('[API ERROR] Login failed:', error);
      throw error;
    }
  },

  /**
   * Signs up the user.
   * @param userData Object: { name: string, email: string, password: string }
   */
  signup: async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await api.post('/signup', userData);
      return response.data;
    } catch (error) {
      console.error('[API ERROR] Signup failed:', error);
      throw error;
    }
  },

  /**
   * Logs out the current user.
   */
  logout: async () => {
    try {
      const response = await api.post('/logout');
      return response.data;
    } catch (error) {
      console.error('[API ERROR] Logout failed:', error);
      throw error;
    }
  },

  /**
   * Gets current logged-in user session info.
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/me'); // assuming /me returns session user
      return response.data;
    } catch (error) {
      console.error('[API ERROR] Failed to fetch current user:', error);
      return null;
    }
  },
};

export default ApiService;
