import { NextResponse } from 'next/server';
import { createValidationErrorPayload, reviseDirectorProject, validateDirectorReviseInput } from '@/lib/director';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = validateDirectorReviseInput(body);
  if (!parsed.success) {
    return NextResponse.json(createValidationErrorPayload(parsed.error), { status: 400 });
  }

  try {
    const result = reviseDirectorProject(parsed.data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Director mode could not revise the draft project' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'POST /api/public/director/revise',
    alias: 'POST /api/v1/director/revise',
    description: 'Revise a draft direction project with conversational feedback.',
    approvalRequired: true,
    renderedVideo: false,
    note: 'Director Mode revisions update the brief, scene plan, and motion spec draft only.',
  });
}
