import type { MotionSpec } from './types.js';

export type RenderStatus = 'scaffolded' | 'rendering' | 'completed' | 'failed' | 'unsupported';

export type MotionRenderResult = {
  status: RenderStatus;
  message: string;
  videoPath?: string;
  thumbnailPath?: string;
  scenePlan?: ScenePlanItem[];
  errors?: string[];
};

export type ScenePlanItem = {
  id: string;
  type: string;
  start: number;
  duration: number;
  elementCount: number;
  attentionRole?: string;
  hasCamera: boolean;
  transitionIn?: string;
  transitionOut?: string;
};

export function createScenePlan(spec: MotionSpec): ScenePlanItem[] {
  return spec.scenes.map(scene => ({
    id: scene.id,
    type: scene.type,
    start: scene.start,
    duration: scene.duration,
    elementCount: scene.elements.length,
    attentionRole: scene.attentionRole,
    hasCamera: !!scene.camera,
    transitionIn: scene.transitions?.in?.type,
    transitionOut: scene.transitions?.out?.type
  }));
}

export function printScenePlan(plan: ScenePlanItem[]): void {
  console.log('\n  Scene Plan:');
  console.log('  ' + '─'.repeat(80));
  console.log(`  ${'ID'.padEnd(20)} ${'Type'.padEnd(10)} ${'Start'.padEnd(8)} ${'Dur'.padEnd(6)} ${'Els'.padEnd(5)} ${'Role'.padEnd(12)} Cam`);
  console.log('  ' + '─'.repeat(80));

  for (const item of plan) {
    const cam = item.hasCamera ? '✓' : '';
    const role = item.attentionRole || '';
    console.log(
      `  ${item.id.padEnd(20)} ${item.type.padEnd(10)} ${item.start.toFixed(1).padEnd(8)} ${item.duration.toFixed(1).padEnd(6)} ${String(item.elementCount).padEnd(5)} ${role.padEnd(12)} ${cam}`
    );
  }

  console.log('  ' + '─'.repeat(80));
  console.log(`  Total: ${plan.length} scenes`);
}

export async function renderMotionSpec(_spec: MotionSpec): Promise<MotionRenderResult> {
  return {
    status: 'scaffolded',
    message: 'Motion rendering is scaffolded but not fully implemented yet. The spec validates successfully and the scene plan is ready for rendering.',
    scenePlan: createScenePlan(_spec)
  };
}
