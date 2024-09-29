// src/app/api/user/profile/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../lib/models/User';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req, NextResponse.next());

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const userEmail = session.user.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req, NextResponse.next());

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { annualIncome, gender, race, age, priorMedicalHistory, insuranceInformation, phqScore } = await req.json();

    await dbConnect();

    const userEmail = session.user.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user information
    user.annualIncome = annualIncome || user.annualIncome;
    user.gender = gender || user.gender;
    user.race = race || user.race;
    user.age = age || user.age;
    user.priorMedicalHistory = priorMedicalHistory || user.priorMedicalHistory;
    user.insuranceInformation = insuranceInformation || user.insuranceInformation;
    user.phqScore = phqScore || user.phqScore;

    await user.save();

    return NextResponse.json({ message: 'User profile updated successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
