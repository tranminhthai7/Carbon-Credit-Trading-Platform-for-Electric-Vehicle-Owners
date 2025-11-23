#!/usr/bin/env node
const http = require('http');
const https = require('https');
const { URL } = require('url');

function fetch(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function main() {
  const host = process.env.E2E_HOST || 'http://localhost:5173';
  console.log('Checking bundle(s) served from', host);
  try {
    const page = await fetch(host + '/');
    if (!page || !page.body) {
      console.error('Failed to get index page');
      process.exit(1);
    }
    const html = page.body;
    const scriptMatches = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)];
    const assets = scriptMatches.map(m => m[1]).filter(s => s.includes('/assets/') || s.includes('.js'));
    if (assets.length === 0) {
      console.warn('No script assets found in index HTML');
    }
    for (const assetPath of assets) {
      const assetUrl = assetPath.startsWith('http') ? assetPath : (host + assetPath);
      console.log('Fetching asset', assetUrl);
      const asset = await fetch(assetUrl);
      if (asset && asset.body) {
        const matches = asset.body.match(/charAt\(/g);
        const replaceMatches = asset.body.match(/replace\(/g);
        console.log(`Asset ${assetPath}: charAt occurrences: ${matches ? matches.length : 0}, replace occurrences: ${replaceMatches ? replaceMatches.length : 0}`);
        if (matches && matches.length > 0) {
          const context = asset.body.split('\n').slice(0, 200).join('\n');
          // print first lines containing charAt
          const lines = asset.body.split('\n');
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('charAt(') || lines[i].includes('.charAt(')) {
              console.log(`-- line ${i + 1}: ${lines[i].substring(0, 200)}`);
            }
          }
        }
      }
    }
    console.log('Done');
  } catch (err) {
    console.error('Failed to check bundle', err);
    process.exit(1);
  }
}

main();
