const API_BASE_URL = 'http://localhost:5000';

export const exerciseApi = {
  setExerciseType: async (exerciseType: string): Promise<void> => {
    try {
      let endpoint = '';
      switch (exerciseType) {
        case 'bicep_curls':
          endpoint = '/bicep_curls_instructions';
          break;
        case 'pushups':
          endpoint = '/push_ups_instructions';
          break;
        case 'squats':
          endpoint = '/squats_instructions';
          break;
        default:
          throw new Error(`Unknown exercise type: ${exerciseType}`);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to set exercise type: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error setting exercise type:', error);
      throw error;
    }
  },

  getVideoFeedUrl: (exerciseType?: string): string => {
    return `${API_BASE_URL}/video_feed${exerciseType ? `?exercise=${exerciseType}` : ''}`;
  },

  /**
   * Navigate to the exercise interface page
   */
  goToExerciseInterface: async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercise_interface`);
      if (!response.ok) {
        throw new Error(`Failed to navigate to exercise interface: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error navigating to exercise interface:', error);
      throw error;
    }
  }
};