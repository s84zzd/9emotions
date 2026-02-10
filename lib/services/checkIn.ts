import { supabase } from '@/lib/supabase';
import { CheckInRecord, CreateCheckInDTO } from '@/types/check-in';

export const CheckInService = {
  // 保存打卡记录
  async create(data: CreateCheckInDTO) {
    const { data: result, error } = await supabase
      .from('check_ins')
      .insert([
        {
          emotions: data.emotions,
          scene: data.scene,
          energy_score: data.energy_score,
          note: data.note
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // 获取指定时间范围的记录
  async getHistory(startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from('check_ins')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as CheckInRecord[];
  }
};
