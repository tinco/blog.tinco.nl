#!/usr/bin/env node
// Saves a tweet to _data/tweets/<id>.json so posts can show it as a static
// card with {% include tweet.html id="<id>" %}.
//
// Usage: node scripts/fetch-tweet.mjs https://x.com/dhh/status/2106810173683851564
//
// The data comes from the public syndication endpoint that X's own embeds
// use. Images and video stay on X's CDN; only the tweet text and the media
// URLs are stored here.

import { mkdir, writeFile } from 'node:fs/promises';

const arg = process.argv[2];
const id = arg && arg.match(/(\d{5,})\/?(?:\?.*)?$/)?.[1];
if (!id) {
  console.error('Usage: node scripts/fetch-tweet.mjs <tweet url or id>');
  process.exit(1);
}

const token = ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');
const response = await fetch(`https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=en&token=${token}`);
if (!response.ok) {
  console.error(`Could not fetch tweet ${id}: HTTP ${response.status}`);
  process.exit(1);
}
const tweet = await response.json();
if (tweet.__typename !== 'Tweet') {
  console.error(`Tweet ${id} is not available (${tweet.__typename ?? 'unknown'})`);
  process.exit(1);
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Entity indices count code points, so work on an array of them.
function renderText() {
  const chars = Array.from(tweet.text);
  const [start, end] = tweet.display_text_range ?? [0, chars.length];
  const entities = [
    ...(tweet.entities?.urls ?? []).map((u) => ({ ...u, html: `<a href="${escape(u.expanded_url)}">${escape(u.display_url)}</a>` })),
    ...(tweet.entities?.user_mentions ?? []).map((m) => ({ ...m, html: `<a href="https://x.com/${m.screen_name}">@${escape(m.screen_name)}</a>` })),
    ...(tweet.entities?.hashtags ?? []).map((h) => ({ ...h, html: `<a href="https://x.com/hashtag/${encodeURIComponent(h.text)}">#${escape(h.text)}</a>` })),
  ]
    .filter((e) => e.indices[0] >= start && e.indices[1] <= end)
    .sort((a, b) => a.indices[0] - b.indices[0]);

  let html = '';
  let position = start;
  for (const entity of entities) {
    html += escape(chars.slice(position, entity.indices[0]).join(''));
    html += entity.html;
    position = entity.indices[1];
  }
  html += escape(chars.slice(position, end).join(''));
  return html.trim().replace(/\n/g, '<br>');
}

function renderMedia(media) {
  const base = { width: media.original_info?.width, height: media.original_info?.height };
  if (media.type === 'photo') {
    return { type: 'photo', src: media.media_url_https, ...base };
  }
  // Videos and GIFs: pick the best MP4 that is at most 720p.
  const mp4s = (media.video_info?.variants ?? [])
    .filter((v) => v.content_type === 'video/mp4')
    .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));
  const best = mp4s.find((v) => !/\/(\d+)x(\d+)\//.test(v.url) || Math.min(...v.url.match(/\/(\d+)x(\d+)\//).slice(1).map(Number)) <= 720) ?? mp4s[0];
  return { type: media.type === 'animated_gif' ? 'gif' : 'video', src: best?.url, poster: media.media_url_https, ...base };
}

const user = tweet.user;
const data = {
  id,
  url: `https://x.com/${user.screen_name}/status/${id}`,
  name: user.name,
  handle: user.screen_name,
  avatar: user.profile_image_url_https.replace('_normal.', '_bigger.'),
  date: tweet.created_at,
  html: renderText(),
  // Long posts are cut off in the syndication data, like in X's own embed.
  truncated: Boolean(tweet.note_tweet),
  media: (tweet.mediaDetails ?? []).map(renderMedia),
};

const dir = new URL('../_data/tweets/', import.meta.url);
await mkdir(dir, { recursive: true });
await writeFile(new URL(`${id}.json`, dir), JSON.stringify(data, null, 2) + '\n');
console.log(`Saved _data/tweets/${id}.json (@${data.handle})`);
console.log(`Use it in a post with: {% include tweet.html id="${id}" %}`);
