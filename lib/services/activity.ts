import { supabase } from "@/lib/supabase";
import { Activity } from "@/types/activity";

export const ActivityService = {
  async getAll(): Promise<Activity[]> {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .limit(500); // Limit results to prevent memory issues

      if (error) {
        console.error('Error fetching activities:', error);
        return [];
      }

      // Validate and sanitize data
      if (!Array.isArray(data)) {
        console.error('Invalid data format received from database');
        return [];
      }

      return data as Activity[];
    } catch (error) {
      console.error('Unexpected error fetching activities:', error);
      return [];
    }
  }
};
