import { EmotionNameEn } from "./emotion";
import { Scene } from "./report";

export interface CheckInRecord {
  id: string;
  user_id?: string;
  emotions: EmotionNameEn[];
  scene: Scene;
  energy_score?: number;
  note?: string;
  recommended_activity_ids?: string[];
  created_at: string;
}

export type CreateCheckInDTO = Omit<CheckInRecord, "id" | "created_at" | "user_id">;
