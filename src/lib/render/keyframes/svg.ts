import type { SceneFrameInput } from './types.js';

const ROLE_COLORS: Record<string, string> = {
  hook: '#ef4444',
  retention: '#3b82f6',
  emotion: '#a855f7',
  distribution: '#22c55e',
};

export function renderSceneFrameSvg(input: SceneFrameInput): string {
  const { sceneId, sceneIndex, totalScenes, caption, visualIntent, brollPrompt, brollAssetType, cameraMotion, attentionRole, start, duration, type, brand, width, height, totalDuration } = input;

  const roleColor = ROLE_COLORS[attentionRole] || '#666';
  const bg = brand.colors.background;
  const fg = brand.colors.primary;
  const accent = brand.colors.accent;
  const muted = brand.colors.muted;
  const timePercent = ((start / totalDuration) * 100).toFixed(1);
  const durPercent = ((duration / totalDuration) * 100).toFixed(1);

  const isVertical = height > width;
  const titleSize = isVertical ? 32 : 40;
  const bodySize = isVertical ? 16 : 18;
  const smallSize = isVertical ? 12 : 14;
  const padding = isVertical ? 32 : 48;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg-${sceneId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}" />
      <stop offset="100%" stop-color="${lighten(bg, 10)}" />
    </linearGradient>
    <linearGradient id="accent-${sceneId}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg-${sceneId})" />

  <!-- Subtle grid pattern -->
  <g opacity="0.03">
    ${Array.from({ length: Math.floor(width / 60) }, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${height}" stroke="${fg}" stroke-width="1"/>`).join('\n    ')}
    ${Array.from({ length: Math.floor(height / 60) }, (_, i) => `<line x1="0" y1="${i * 60}" x2="${width}" y2="${i * 60}" stroke="${fg}" stroke-width="1"/>`).join('\n    ')}
  </g>

  <!-- Top bar: scene info -->
  <rect x="0" y="0" width="${width}" height="48" fill="rgba(0,0,0,0.4)" />
  <text x="${padding}" y="30" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="${muted}">${sceneId} • ${sceneIndex + 1}/${totalScenes}</text>
  <text x="${width - padding}" y="30" font-family="system-ui, sans-serif" font-size="13" fill="${muted}" text-anchor="end">${formatTime(start)}–${formatTime(start + duration)}</text>

  <!-- Role badge -->
  <rect x="${padding}" y="68" width="${attentionRole.length * 10 + 20}" height="24" rx="12" fill="${roleColor}" opacity="0.2" />
  <text x="${padding + 10}" y="84" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="${roleColor}" text-transform="uppercase">${attentionRole.toUpperCase()}</text>

  <!-- Type badge -->
  <rect x="${padding + attentionRole.length * 10 + 32}" y="68" width="${type.length * 8 + 16}" height="24" rx="12" fill="${fg}" opacity="0.1" />
  <text x="${padding + attentionRole.length * 10 + 40}" y="84" font-family="system-ui, sans-serif" font-size="11" fill="${muted}">${type}</text>

  <!-- Main caption -->
  <text x="${width / 2}" y="${height * 0.42}" font-family="system-ui, sans-serif" font-size="${titleSize}" font-weight="800" fill="${fg}" text-anchor="middle" dominant-baseline="middle">
    ${wrapText(caption, isVertical ? 18 : 28).map((line, i) => `<tspan x="${width / 2}" dy="${i === 0 ? 0 : titleSize + 8}">${escapeXml(line)}</tspan>`).join('')}
  </text>

  <!-- Visual intent -->
  <text x="${width / 2}" y="${height * 0.58}" font-family="system-ui, sans-serif" font-size="${bodySize}" fill="${muted}" text-anchor="middle" dominant-baseline="middle" opacity="0.7">
    ${escapeXml(truncate(visualIntent, isVertical ? 40 : 60))}
  </text>

  <!-- B-Roll box -->
  <rect x="${padding}" y="${height * 0.66}" width="${width - padding * 2}" height="${isVertical ? 80 : 96}" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
  <text x="${padding + 16}" y="${height * 0.66 + 24}" font-family="system-ui, sans-serif" font-size="${smallSize}" font-weight="600" fill="${muted}" text-transform="uppercase">B-ROLL</text>
  <text x="${padding + 16}" y="${height * 0.66 + 48}" font-family="monospace" font-size="${smallSize - 2}" fill="${accent}">${escapeXml(truncate(brollPrompt, isVertical ? 50 : 80))}</text>
  <text x="${padding + 16}" y="${height * 0.66 + (isVertical ? 68 : 76)}" font-family="system-ui, sans-serif" font-size="${smallSize - 2}" fill="${muted}">${brollAssetType} • ${cameraMotion} • ${duration}s</text>

  <!-- Timeline bar at bottom -->
  <rect x="0" y="${height - 40}" width="${width}" height="40" fill="rgba(0,0,0,0.5)" />
  ${Array.from({ length: totalScenes }, (_, i) => {
    const segStart = (i / totalScenes) * width;
    const segWidth = width / totalScenes;
    const isActive = i === sceneIndex;
    const segColor = isActive ? accent : 'rgba(255,255,255,0.1)';
    return `<rect x="${segStart}" y="${height - 40}" width="${segWidth}" height="40" fill="${segColor}" opacity="${isActive ? 1 : 0.5}" />`;
  }).join('\n  ')}
  <text x="${padding}" y="${height - 16}" font-family="system-ui, sans-serif" font-size="12" fill="${muted}">Scene ${sceneIndex + 1} • ${duration}s</text>
  <text x="${width - padding}" y="${height - 16}" font-family="system-ui, sans-serif" font-size="12" fill="${muted}" text-anchor="end">${brand.name}</text>
</svg>`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '...';
}

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxCharsPerLine && current.length > 0) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}

function lighten(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(255 * percent / 100));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * percent / 100));
  const b = Math.min(255, (num & 0xff) + Math.round(255 * percent / 100));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}
