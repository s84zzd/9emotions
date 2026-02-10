import { supabase } from '@/lib/supabase';
import { CheckInRecord, CreateCheckInDTO } from '@/types/check-in';

export const CheckInService = {
  // 保存打卡记录
  async create(data: CreateCheckInDTO) {
    // Input validation
    if (!data.emotions || data.emotions.length === 0) {
      throw new Error('At least one emotion is required');
    }
    if (data.emotions.length > 2) {
      throw new Error('Maximum 2 emotions allowed');
    }
    if (!data.scene) {
      throw new Error('Scene is required');
    }
    
    // Validate energy_score is within valid range
    if (data.energy_score !== undefined && (data.energy_score < 0 || data.energy_score > 100)) {
      throw new Error('Energy score must be between 0 and 100');
    }
    
    // Sanitize note to prevent XSS (trim and limit length)
    const sanitizedNote = data.note ? data.note.trim().substring(0, 500) : '';
    
    const { data: result, error } = await supabase
      .from('check_ins')
      .insert([
        {
          emotions: data.emotions,
          scene: data.scene,
          energy_score: data.energy_score,
          note: sanitizedNote
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // 获取指定时间范围的记录
  async getHistory(startDate: Date, endDate: Date) {
    // Validate date range
    if (startDate > endDate) {
      throw new Error('Start date must be before end date');
    }
    
    // Limit the date range to prevent excessive data retrieval
    const maxDays = 365; // 1 year max
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > maxDays) {
      throw new Error(`Date range cannot exceed ${maxDays} days`);
    }
    
    const { data, error } = await supabase
      .from('check_ins')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true })
      .limit(1000); // Limit results to prevent memory issues

    if (error) throw error;
    return data as CheckInRecord[];
  }
};
