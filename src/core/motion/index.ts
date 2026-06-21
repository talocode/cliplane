export type { MotionSpec, MotionBrand, MotionScene, MotionElement, MotionAnimation, MotionExport, MotionCamera, MotionTransition, MotionCaption, MotionBackground, MotionAudio } from './types.js';
export { validateMotionSpec, printValidationResult } from './validator.js';
export type { ValidationResult, ValidationError } from './validator.js';
export { renderMotionSpec, createScenePlan, printScenePlan } from './renderer.js';
export type { MotionRenderResult, ScenePlanItem, RenderStatus } from './renderer.js';
