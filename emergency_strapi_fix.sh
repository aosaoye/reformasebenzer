#!/bin/bash
set -e

BACKEND_DIR="/home/john/Documentos/strapi-cloud-migracion"
echo "🚑 Reverting URL constraints from Strapi configuration..."

# 1. Revert server.js to let Cloud set its own auto-detected URL
SERVER_JS="$BACKEND_DIR/config/server.js"
cat << 'EOF' > "$SERVER_JS"
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
EOF
echo "✅ Reverted config/server.js to dynamic routing."

# 2. Update middlewares explicitly adding wildcard cors for flexibility
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
            'market-assets.strapi.io',
            'https://*.strapi.io',
            'https://*.strapiapp.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'https://*.strapi.io',
            'https://*.strapiapp.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['*'],
      headers: ['*'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    },
  },
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
echo "✅ Reinforced config/middlewares.js with permissive CORS hooks."

# 3. Commit and unlock
cd "$BACKEND_DIR"
git add .
git commit -m "fix: remove absolute server url to fix cloud hostname routing conflicts and deploy explicit wildcard cors" || echo "No changes"

echo "✨ REPAIR COMPLETE."
echo "Next Step: Run 'git push origin main' to finalize deployment fix."
