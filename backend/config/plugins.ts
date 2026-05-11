import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'cloud-cronjob-runner': {
    config: {
      apiToken: env('STRAPI_CLOUD_CRONJOB_TOKEN', 'replace-with-real-token'),
      apiUrl: env('STRAPI_CLOUD_CRONJOB_URL', 'https://superb-ants-9c3577cf0d.strapiapp.com/admin'),
      firstRunWindow: env('STRAPI_CLOUD_CRONJOB_WINDOW', '5m'),
    },
  },
});
export default config;
