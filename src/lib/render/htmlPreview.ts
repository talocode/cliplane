import type { FullMotionSpec, SceneSpec } from '../motion/types.js';
import type { PreviewResult } from './types.js';
import { getPreviewCSS } from './css.js';
import { computeTimeline, formatTime, formatDuration } from './timeline.js';
import { generateWarnings } from './types.js';

export function generateHtmlPreview(spec: FullMotionSpec): PreviewResult {
  const warnings = generateWarnings(spec);
  const timeline = computeTimeline(spec);
  const isVertical = spec.resolution.height > spec.resolution.width;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ClipLoop Preview: ${escapeHtml(spec.title)}</title>
<style>${getPreviewCSS()}</style>
</head>
<body>
<div class="preview-container">

  <div class="header">
    <h1>${escapeHtml(spec.title)}</h1>
    <div class="meta">
      <span class="meta-tag">${spec.platform}</span>
      <span class="meta-tag">${spec.resolution.width}×${spec.resolution.height}</span>
      <span class="meta-tag">${spec.fps}fps</span>
      <span class="meta-tag accent">${formatDuration(spec.duration)}</span>
      <span class="meta-tag">${spec.scenes.length} scenes</span>
      <span class="meta-tag">v${spec.version}</span>
    </div>
  </div>

  ${renderFramePreview(spec, isVertical)}

  <h2 style="color:#fff;font-size:18px;margin-bottom:12px">Scene Timeline</h2>
  <div class="scene-timeline">
    ${timeline.map(bar => `<div class="scene-bar ${bar.cssClass}" style="flex:${bar.widthPercent}" title="${bar.id}: ${formatTime(spec.scenes.find(s => s.id === bar.id)?.start || 0)}">${bar.label}</div>`).join('\n    ')}
  </div>

  <div class="scenes-grid">
    ${spec.scenes.map(scene => renderSceneCard(scene, spec.brand)).join('\n    ')}
  </div>

  <div class="captions-section">
    <h2>Captions</h2>
    <div class="caption-list">
      ${spec.captions.map((cap, i) => {
        const scene = spec.scenes[i];
        const startTime = scene ? formatTime(scene.start) : '0:00';
        return `<div class="caption-item">
          <span class="caption-time">${startTime}</span>
          <span class="caption-text">${escapeHtml(cap.text)}</span>
        </div>`;
      }).join('\n      ')}
    </div>
  </div>

  ${spec.approvalRequired ? `
  <div class="approval-banner">
    <h2>⏳ Approval Required</h2>
    <p>This motion spec requires human review before any video is rendered. No video has been generated.</p>
  </div>` : ''}

  ${warnings.length > 0 ? `
  <div class="warnings-box">
    <h3>Warnings</h3>
    <ul>
      ${warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('\n      ')}
    </ul>
  </div>` : ''}

  <div class="export-checklist">
    <h2>Export Readiness</h2>
    <div class="check-item"><span class="icon">✓</span> Motion spec valid</div>
    <div class="check-item"><span class="icon">✓</span> ${spec.scenes.length} scenes planned</div>
    <div class="check-item"><span class="icon">✓</span> Captions generated</div>
    <div class="check-item"><span class="icon">✓</span> B-roll planned for each scene</div>
    <div class="check-item"><span class="icon">✓</span> Export format: ${spec.exports[0]?.format || 'mp4'} (${spec.exports[0]?.aspectRatio || '16:9'})</div>
    <div class="check-item" style="color:#eab308"><span class="icon" style="color:#eab308">⏳</span> Awaiting human approval</div>
    <div class="check-item" style="color:#525252"><span class="icon" style="color:#525252">○</span> Video render (requires approval + renderer)</div>
  </div>

  <div class="footer">
    ClipLoop Motion Spec Preview — v${spec.version} — Generated ${spec.sourceMetadata.generatedAt}
  </div>

</div>
</body>
</html>`;

  return {
    type: 'html',
    html,
    warnings,
    renderedVideo: false,
    metadata: {
      sceneCount: spec.scenes.length,
      totalDuration: spec.duration,
      platform: spec.platform,
      resolution: `${spec.resolution.width}×${spec.resolution.height}`,
    },
  };
}

function renderFramePreview(spec: FullMotionSpec, isVertical: boolean): string {
  const firstScene = spec.scenes[0];
  const firstCaption = spec.captions[0];
  const bgColor = spec.brand.colors.background;
  const textColor = spec.brand.colors.primary;
  const accentColor = spec.brand.colors.accent;

  return `
  <div class="frame-preview${isVertical ? ' vertical' : ''}" style="background:${bgColor}">
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;width:80%">
      <div style="font-size:${isVertical ? '28px' : '36px'};font-weight:800;color:${textColor};margin-bottom:12px">
        ${escapeHtml(firstScene?.caption || spec.title)}
      </div>
      <div style="font-size:${isVertical ? '14px' : '16px'};color:${accentColor}">${escapeHtml(spec.brand.name)}</div>
    </div>
    <div class="frame-overlay">
      <div class="caption">${escapeHtml(firstCaption?.text || '')}</div>
      <div class="caption-small">${spec.platform} • ${spec.resolution.width}×${spec.resolution.height} • ${spec.fps}fps</div>
    </div>
  </div>`;
}

function renderSceneCard(scene: SceneSpec, brand: { name: string; colors: { background: string; primary: string; accent: string } }): string {
  const badgeClass = `badge-${scene.attentionRole}`;

  return `
    <div class="scene-card">
      <div class="scene-header">
        <span class="scene-id">${scene.id} • ${formatTime(scene.start)}–${formatTime(scene.start + scene.duration)}</span>
        <span class="scene-badge ${badgeClass}">${scene.attentionRole}</span>
      </div>
      <h3>${escapeHtml(scene.caption)}</h3>
      <div class="narration">"${escapeHtml(scene.narration)}"</div>
      <div class="visual-intent">${escapeHtml(scene.visualIntent)}</div>
      <div class="broll-box">
        <div class="label">B-Roll</div>
        <div class="prompt">${escapeHtml(scene.broll.prompt)}</div>
        <div class="meta-row">
          <span>${scene.broll.assetType}</span>
          <span>${scene.broll.cameraMotion}</span>
          <span>${formatDuration(scene.broll.duration)}</span>
          ${scene.broll.requiresExternalProvider ? '<span style="color:#eab308">needs provider</span>' : '<span style="color:#22c55e">local</span>'}
        </div>
      </div>
    </div>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
