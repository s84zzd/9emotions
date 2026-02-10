import { RegulationDirection } from "./emotion";
import { Scene } from "./report";

export type IntensityLevel = "low" | "medium" | "high";

export interface Activity {
  id: string;
  name: string;
  description: string;
  direction: RegulationDirection;
  scenes: Scene[];
  duration_min: number;
  intensity: IntensityLevel;
}
