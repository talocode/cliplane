import { NextResponse } from 'next/server';
import { createDirectorProject, createValidationErrorPayload, validateDirectorCreateInput } from '@/lib/director';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = validateDirectorCreateInput(body);
  if (!parsed.success) {
    return NextResponse.json(createValidationErrorPayload(parsed.error), { status: 400 });
  }

  try {
    const result = createDirectorProject(parsed.data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Director mode could not build a draft project' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'POST /api/public/director/create',
    alias: 'POST /api/v1/director/create',
    description: 'Create a draft video direction project from a written idea.',
    approvalRequired: true,
    renderedVideo: false,
    note: 'Director Mode creates planning drafts only. Review before rendering or publishing.',
  });
}
