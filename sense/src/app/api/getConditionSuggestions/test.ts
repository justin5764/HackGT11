// src/app/api/test.ts

import { NextRequest, NextResponse } from 'next/server';
import { loadHealthConditions } from './healthConditions'; // Import your function

export async function GET(req: NextRequest) {
  try {
    // Load health conditions
    const healthConditions = loadHealthConditions();

    // Log the loaded conditions to the console
    console.log('Loaded Health Conditions:', healthConditions);

    // Respond with the loaded conditions
    return NextResponse.json(healthConditions);
  } catch (error) {
    console.error('Error loading health conditions:', error);
    return NextResponse.json(
      { error: 'Failed to load health conditions' },
      { status: 500 }
    );
  }
}