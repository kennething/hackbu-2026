import ScanbotSDK from "scanbot-web-sdk";

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();
  const scanbotSDK = await ScanbotSDK.initialize({ licenseKey: config.public.scanbotKey, enginePath: "/scanbot/" });

  return { provide: { scanbot: scanbotSDK } };
});
