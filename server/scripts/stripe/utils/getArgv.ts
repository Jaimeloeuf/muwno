export function getArgv() {
  const envArgv =
    process.argv.find((argv) => new RegExp(/env=\w+/g).test(argv)) ??
    'env=development';

  const nodeEnv = envArgv.split('=')[1];

  if (nodeEnv !== 'development' && nodeEnv !== 'production')
    throw new Error(
      `'env=' must be either 'development' or 'production'. Found ${nodeEnv}`,
    );

  return { nodeEnv };
}
