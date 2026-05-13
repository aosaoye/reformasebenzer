#!/bin/bash
set -e

BACKEND_DIR="/home/john/Documentos/strapi-cloud-migracion"
echo "🔧 Repairing Strapi Cloud Upload configuration..."

# 1. Patch server.js to include explicit URL routing
SERVER_JS="$BACKEND_DIR/config/server.js"
cat << 'EOF' > "$SERVER_JS"
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('STRAPI_URL', 'https://superb-ants-9c3577cf0d.strapiapp.com'),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
EOF
echo "✅ Patched config/server.js with explicit public URL."

# 2. Patch middlewares.js with Extended Body Limits and Strapi Cloud CSP policies
MIDDLEWARES_JS="$BACKEND_DIR/config/middlewares.js"
cat << 'EOF' > "$MIDDLEWARES_JS"
module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'https://*.strapi.io',
            'https://*.strapiapp.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'https://*.strapi.io',
            'https://*.strapiapp.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '256mb',
      jsonLimit: '256mb',
      textLimit: '256mb',
      formidable: {
        maxFileSize: 250 * 1024 * 1024,
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
EOF
echo "✅ Patched config/middlewares.js with massive file support and Cloud Content Security policies."

# 3. Commit fixing patches automatically
cd "$BACKEND_DIR"
git add .
git commit -m "fix: configure absolute proxy URL, elevate payload body limits and extend cloud CSP for media support" || echo "No changes to commit"

echo "🚀 CONFIGURATION ARMORED AND READY!"
echo "Next Step: Run 'git push origin main' in your backend terminal to activate upload fix!"
