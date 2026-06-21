import type { MotionSpec } from './types.js';

export type ValidationError = {
  path: string;
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
};

const VALID_ELEMENT_TYPES = [
  'text', 'logo', 'icon', 'card', 'workflowCard', 'connector',
  'shape', 'image', 'video', 'browserFrame', 'terminalFrame',
  'codeFrame', 'productShot', 'particleField', 'gradientBlob'
];

const VALID_ANIMATION_TYPES = [
  'fade', 'slide', 'scale', 'blur', 'rotate', 'drawLine',
  'countUp', 'typewriter', 'revealMask', 'cameraPush',
  'parallax', 'morph', 'stagger', 'spring', 'pulse', 'orbit'
];

const VALID_SCENE_TYPES = ['title', 'content', 'transition', 'cta'];
const VALID_ATTENTION_ROLES = ['hook', 'retention', 'emotion', 'distribution'];
const VALID_TRANSITION_TYPES = ['fade', 'slide', 'cameraPush', 'cut'];
const VALID_BACKGROUND_TYPES = ['solid', 'gradient', 'image'];
const VALID_EXPORT_FORMATS = ['mp4', 'webm'];

export function validateMotionSpec(spec: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  if (!spec || typeof spec !== 'object') {
    return { valid: false, errors: [{ path: '$', message: 'Spec must be a JSON object' }], warnings };
  }

  const s = spec as Record<string, unknown>;

  if (!s.version) errors.push({ path: '$.version', message: 'version is required' });
  if (!s.title) errors.push({ path: '$.title', message: 'title is required' });

  if (typeof s.duration !== 'number' || s.duration <= 0 || s.duration > 120) {
    errors.push({ path: '$.duration', message: 'duration must be > 0 and ≤ 120 seconds' });
  }

  if (s.fps !== 30 && s.fps !== 60) {
    errors.push({ path: '$.fps', message: 'fps must be 30 or 60' });
  }

  if (!s.resolution || typeof s.resolution !== 'object') {
    errors.push({ path: '$.resolution', message: 'resolution is required' });
  } else {
    const r = s.resolution as Record<string, number>;
    if (typeof r.width !== 'number' || r.width < 640 || r.width > 3840) {
      errors.push({ path: '$.resolution.width', message: 'width must be between 640 and 3840' });
    }
    if (typeof r.height !== 'number' || r.height < 480 || r.height > 2160) {
      errors.push({ path: '$.resolution.height', message: 'height must be between 480 and 2160' });
    }
  }

  if (!s.brand || typeof s.brand !== 'object') {
    errors.push({ path: '$.brand', message: 'brand is required' });
  }

  if (!Array.isArray(s.scenes) || s.scenes.length === 0) {
    errors.push({ path: '$.scenes', message: 'at least 1 scene is required' });
  } else {
    if (s.scenes.length > 20) {
      errors.push({ path: '$.scenes', message: 'max 20 scenes allowed' });
    }

    const sceneIds = new Set<string>();
    let timelineEnd = 0;

    for (let i = 0; i < s.scenes.length; i++) {
      const scene = s.scenes[i] as Record<string, unknown>;
      const prefix = `$.scenes[${i}]`;

      if (!scene.id) {
        errors.push({ path: `${prefix}.id`, message: 'scene id is required' });
      } else if (sceneIds.has(scene.id as string)) {
        errors.push({ path: `${prefix}.id`, message: `duplicate scene id: ${scene.id}` });
      } else {
        sceneIds.add(scene.id as string);
      }

      if (typeof scene.start !== 'number' || scene.start < 0) {
        errors.push({ path: `${prefix}.start`, message: 'start must be ≥ 0' });
      }

      if (typeof scene.duration !== 'number' || scene.duration <= 0) {
        errors.push({ path: `${prefix}.duration`, message: 'duration must be > 0' });
      }

      if (scene.start !== undefined && scene.duration !== undefined) {
        const sceneEnd = (scene.start as number) + (scene.duration as number);
        if (s.duration && sceneEnd > (s.duration as number)) {
          errors.push({ path: `${prefix}`, message: `scene ends at ${sceneEnd}s but video duration is ${s.duration}s` });
        }
        if (scene.start as number < timelineEnd - 0.01) {
          errors.push({ path: `${prefix}.start`, message: `overlaps with previous scene ending at ${timelineEnd}s` });
        }
        timelineEnd = sceneEnd;
      }

      if (scene.type && !VALID_SCENE_TYPES.includes(scene.type as string)) {
        errors.push({ path: `${prefix}.type`, message: `invalid scene type: ${scene.type}` });
      }

      if (scene.attentionRole && !VALID_ATTENTION_ROLES.includes(scene.attentionRole as string)) {
        errors.push({ path: `${prefix}.attentionRole`, message: `invalid attention role: ${scene.attentionRole}` });
      }

      if (scene.background && typeof scene.background === 'object') {
        const bg = scene.background as Record<string, unknown>;
        if (!VALID_BACKGROUND_TYPES.includes(bg.type as string)) {
          errors.push({ path: `${prefix}.background.type`, message: `invalid background type: ${bg.type}` });
        }
      }

      if (Array.isArray(scene.elements)) {
        const elementIds = new Set<string>();
        for (let j = 0; j < scene.elements.length; j++) {
          const el = scene.elements[j] as Record<string, unknown>;
          const elPrefix = `${prefix}.elements[${j}]`;

          if (!el.id) {
            errors.push({ path: `${elPrefix}.id`, message: 'element id is required' });
          } else if (elementIds.has(el.id as string)) {
            errors.push({ path: `${elPrefix}.id`, message: `duplicate element id: ${el.id}` });
          } else {
            elementIds.add(el.id as string);
          }

          if (!VALID_ELEMENT_TYPES.includes(el.type as string)) {
            errors.push({ path: `${elPrefix}.type`, message: `invalid element type: ${el.type}` });
          }

          if (el.animations && typeof el.animations === 'object') {
            const anims = el.animations as Record<string, unknown>;
            for (const animKey of ['entry', 'loop', 'exit']) {
              if (anims[animKey] && typeof anims[animKey] === 'object') {
                const anim = anims[animKey] as Record<string, unknown>;
                if (anim.type && !VALID_ANIMATION_TYPES.includes(anim.type as string)) {
                  errors.push({ path: `${elPrefix}.animations.${animKey}.type`, message: `invalid animation type: ${anim.type}` });
                }
              }
            }
          }
        }

        if (scene.elements.length > 15) {
          warnings.push(`Scene ${scene.id || i} has ${scene.elements.length} elements — consider reducing for performance`);
        }
      }

      if (scene.transitions && typeof scene.transitions === 'object') {
        const trans = scene.transitions as Record<string, unknown>;
        for (const key of ['in', 'out']) {
          if (trans[key] && typeof trans[key] === 'object') {
            const t = trans[key] as Record<string, unknown>;
            if (t.type && !VALID_TRANSITION_TYPES.includes(t.type as string)) {
              errors.push({ path: `${prefix}.transitions.${key}.type`, message: `invalid transition type: ${t.type}` });
            }
          }
        }
      }
    }
  }

  if (Array.isArray(s.exports)) {
    for (let i = 0; i < s.exports.length; i++) {
      const exp = s.exports[i] as Record<string, unknown>;
      const prefix = `$.exports[${i}]`;
      if (exp.format && !VALID_EXPORT_FORMATS.includes(exp.format as string)) {
        errors.push({ path: `${prefix}.format`, message: `invalid format: ${exp.format}` });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function printValidationResult(result: ValidationResult): void {
  if (result.valid) {
    console.log('\x1b[32m  ✓ Motion spec is valid\x1b[0m');
  } else {
    console.log('\x1b[31m  ✗ Motion spec validation failed:\x1b[0m');
    for (const err of result.errors) {
      console.log(`    \x1b[31m${err.path}: ${err.message}\x1b[0m`);
    }
  }

  if (result.warnings.length > 0) {
    console.log('\n  Warnings:');
    for (const warn of result.warnings) {
      console.log(`    \x1b[33m${warn}\x1b[0m`);
    }
  }
}
