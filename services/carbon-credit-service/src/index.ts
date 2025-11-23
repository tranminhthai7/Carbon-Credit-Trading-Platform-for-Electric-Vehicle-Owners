//index.ts
import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import routes from './routes';
import bodyParser from 'body-parser';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3003;

const app = express();
// Custom tolerant JSON/URL-encoded parser: capture raw body and attempt to parse JSON; if that fails, try to normalize JS-like keys or parse form-encoded
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
  let raw = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => { raw += chunk; });
  req.on('end', () => {
    (req as any).rawBody = raw;
    if (!raw) { req.body = {}; return next(); }
    try {
      req.body = JSON.parse(raw);
      return next();
    } catch (e) {
      try {
        // convert urlencoded to object
        if (raw.includes('=') && raw.includes('&')) {
          const obj: any = {};
          raw.split('&').forEach((kv) => { const [k, v] = kv.split('='); obj[decodeURIComponent(k)] = decodeURIComponent(v); });
          req.body = obj; return next();
        }
      } catch (ee) { /* ignore */ }
      try {
        function normalizePseudoJson(s: string) {
          // Wrap keys
          let t = s.replace(/([a-zA-Z0-9_\-]+)\s*:/g, '"$1":');
          // Wrap unquoted string values (not numbers, not quoted)
          t = t.replace(/:\s*([A-Za-z0-9_\-]+)/g, (m, p1) => {
            if (/^-?\d+(\.\d+)?$/.test(p1)) return ':' + p1; // number
            if (/^\".*\"$/.test(p1)) return ':' + p1; // already quoted
            return ':"' + p1 + '"';
          });
          return t;
        }
        const normalized = normalizePseudoJson(raw);
        req.body = JSON.parse(normalized);
        console.debug('[TOLERANT PARSER] Normalized body from:', raw, '->', JSON.stringify(req.body));
        return next();
      } catch (eee) {
        req.body = {};
        return next();
      }
    }
  });
  });
} else {
  // In production, use strict JSON parsing only
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
}
app.use((req, res, next) => {
  if ((req as any).rawBody) {
    // Log a short preview of the raw request body for debugging
    console.debug('[RAW BODY]', `${(req as any).rawBody}`.slice(0, 500));
  }
  next();
});

// health
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// routes
app.use('/', routes);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`Carbon Credit Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });