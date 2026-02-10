import { supabase } from "@/lib/supabase";
import { Activity } from "@/types/activity";

export const ActivityService = {
  async getAll(): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*');

    if (error) {
      console.error('Error fetching activities:', error);
      return [];
    }

    return data as Activity[];
  }
};
