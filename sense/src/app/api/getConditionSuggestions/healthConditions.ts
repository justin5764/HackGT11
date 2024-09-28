// src/app/api/getConditionSuggestions/healthConditions.ts

import fs from 'fs';
import path from 'path';
import { HealthCondition } from '../../../types'; // Adjust the import path as necessary

export const loadHealthConditions = (): HealthCondition[] => {
  const filePath = path.join(process.cwd(), 'cond_proc_download-2023-10-01.json'); // Adjust path as necessary
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const parsedData: HealthCondition[] = JSON.parse(jsonData);
  return parsedData;
};