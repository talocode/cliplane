export function getPreviewCSS(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: #0a0a0a;
      color: #e5e5e5;
      line-height: 1.6;
    }
    .preview-container { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .header { padding: 32px 0; border-bottom: 1px solid #222; margin-bottom: 32px; }
    .header h1 { font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 8px; }
    .header .meta { display: flex; gap: 16px; flex-wrap: wrap; }
    .meta-tag {
      padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500;
      background: #1a1a1a; color: #a3a3a3; border: 1px solid #333;
    }
    .meta-tag.accent { background: #1a1a0a; color: #eab308; border-color: #422006; }
    .frame-preview {
      position: relative; width: 100%; aspect-ratio: 16/9; background: #111;
      border: 1px solid #222; border-radius: 12px; overflow: hidden; margin-bottom: 32px;
    }
    .frame-preview.vertical { aspect-ratio: 9/16; max-width: 400px; margin: 0 auto 32px; }
    .frame-overlay {
      position: absolute; bottom: 0; left: 0; right: 0; padding: 16px;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
    }
    .frame-overlay .caption { font-size: 18px; font-weight: 600; color: #fff; text-align: center; }
    .frame-overlay .caption-small { font-size: 12px; color: #888; text-align: center; margin-top: 4px; }
    .scene-timeline {
      display: flex; gap: 2px; margin-bottom: 32px; border-radius: 8px; overflow: hidden; height: 40px;
    }
    .scene-bar {
      display: flex; align-items: center; justify-content: center; font-size: 11px;
      font-weight: 600; color: #fff; min-width: 30px; transition: opacity 0.2s;
    }
    .scene-bar:hover { opacity: 0.8; }
    .scene-bar.hook { background: #ef4444; }
    .scene-bar.retention { background: #3b82f6; }
    .scene-bar.emotion { background: #a855f7; }
    .scene-bar.distribution { background: #22c55e; }
    .scenes-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 32px; }
    @media (min-width: 768px) { .scenes-grid { grid-template-columns: 1fr 1fr; } }
    .scene-card {
      background: #141414; border: 1px solid #222; border-radius: 12px; padding: 20px;
    }
    .scene-card .scene-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .scene-card .scene-id { font-size: 13px; font-weight: 600; color: #a3a3a3; }
    .scene-card .scene-badge {
      padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase;
    }
    .badge-hook { background: #450a0a; color: #fca5a5; }
    .badge-retention { background: #172554; color: #93c5fd; }
    .badge-emotion { background: #3b0764; color: #d8b4fe; }
    .badge-distribution { background: #052e16; color: #86efac; }
    .scene-card h3 { font-size: 15px; color: #fff; margin-bottom: 8px; }
    .scene-card .narration { font-size: 13px; color: #a3a3a3; margin-bottom: 8px; font-style: italic; }
    .scene-card .visual-intent { font-size: 13px; color: #737373; margin-bottom: 12px; }
    .broll-box {
      background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 12px; margin-top: 8px;
    }
    .broll-box .label { font-size: 11px; font-weight: 600; color: #737373; text-transform: uppercase; margin-bottom: 4px; }
    .broll-box .prompt { font-size: 12px; color: #d4d4d4; font-family: 'SF Mono', monospace; }
    .broll-box .meta-row { display: flex; gap: 12px; margin-top: 8px; font-size: 11px; color: #737373; }
    .captions-section { margin-bottom: 32px; }
    .captions-section h2 { font-size: 18px; color: #fff; margin-bottom: 12px; }
    .caption-list { display: flex; flex-direction: column; gap: 8px; }
    .caption-item {
      display: flex; gap: 12px; align-items: baseline; padding: 8px 12px;
      background: #141414; border: 1px solid #222; border-radius: 8px;
    }
    .caption-time { font-size: 12px; font-weight: 600; color: #eab308; min-width: 50px; font-family: monospace; }
    .caption-text { font-size: 14px; color: #e5e5e5; }
    .approval-banner {
      background: #422006; border: 1px solid #78350f; border-radius: 12px; padding: 20px;
      margin-bottom: 32px; text-align: center;
    }
    .approval-banner h2 { color: #fbbf24; font-size: 16px; margin-bottom: 4px; }
    .approval-banner p { color: #d97706; font-size: 13px; }
    .warnings-box {
      background: #1a1a0a; border: 1px solid #422006; border-radius: 12px; padding: 16px; margin-bottom: 32px;
    }
    .warnings-box h3 { color: #eab308; font-size: 14px; margin-bottom: 8px; }
    .warnings-box ul { list-style: none; }
    .warnings-box li { font-size: 13px; color: #a3a3a3; padding: 2px 0; }
    .warnings-box li::before { content: "⚠ "; color: #eab308; }
    .export-checklist { margin-bottom: 32px; }
    .export-checklist h2 { font-size: 18px; color: #fff; margin-bottom: 12px; }
    .check-item { display: flex; gap: 8px; align-items: center; padding: 6px 0; font-size: 14px; color: #a3a3a3; }
    .check-item .icon { color: #22c55e; }
    .footer { border-top: 1px solid #222; padding-top: 24px; font-size: 12px; color: #525252; text-align: center; }
  `;
}
