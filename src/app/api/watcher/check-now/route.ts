import { NextRequest, NextResponse } from 'next/server';
import { watcherEngine, WatcherCheckResult } from '@/lib/watcher/engine';
import { WatcherRuleZod } from '@/types/watcher';
import { z } from 'zod';

const CheckWatcherSchema = z.object({
  url: z.string().url('Please provide a valid URL'),
  rules: z.array(WatcherRuleZod).min(1, 'At least one rule is required'),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('🚀 [CHECK-NOW] Starting watcher check request at:', new Date().toISOString());

  try {
    // Log request headers for debugging
    console.log('📋 [CHECK-NOW] Request headers:', Object.fromEntries(request.headers.entries()));

    // Parse and log the request body
    console.log('📥 [CHECK-NOW] Parsing request body...');
    const body = await request.json();
    console.log('📥 [CHECK-NOW] Raw request body:', JSON.stringify(body, null, 2));

    // Validate the request body
    console.log('✅ [CHECK-NOW] Validating request schema...');
    const validationResult = CheckWatcherSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('❌ [CHECK-NOW] Validation failed:', validationResult.error.issues);
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { url, rules } = validationResult.data;
    console.log('✅ [CHECK-NOW] Validation passed. URL:', url);
    console.log('✅ [CHECK-NOW] Rules count:', rules.length);
    console.log('✅ [CHECK-NOW] Rules:', JSON.stringify(rules, null, 2));

    // Check the watcher
    console.log('🔍 [CHECK-NOW] Starting watcher engine check...');
    const result: WatcherCheckResult = await watcherEngine.checkWatcher(url, rules);

    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log('✅ [CHECK-NOW] Watcher check completed in:', duration + 'ms');
    console.log('📊 [CHECK-NOW] Result:', JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.error('💥 [CHECK-NOW] Error in watcher check-now endpoint after', duration + 'ms');
    console.error('💥 [CHECK-NOW] Error details:', error);
    console.error('💥 [CHECK-NOW] Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          duration: duration + 'ms',
          timestamp: new Date().toISOString(),
          errorType: error instanceof Error ? error.constructor.name : typeof error
        }
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed',
      message: 'Use POST to check a watcher'
    },
    { status: 405 }
  );
}
