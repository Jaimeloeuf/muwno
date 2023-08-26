export function getArgv() {
  const envArgv =
    process.argv.find((argv) => new RegExp(/env=\w+/g).test(argv)) ??
    'env=development';

  const nodeEnv = envArgv.split('=')[1];

  if (nodeEnv !== 'development' && nodeEnv !== 'production')
    throw new Error(
      `'env=' must be either 'development' or 'production'. Found ${nodeEnv}`,
    );

  const ikArgv =
    process.argv.find((argv) => new RegExp(/ik=\w+/g).test(argv)) ??
    'ik=cli-setup-idempotent-key';

  const ik = ikArgv.split('=')[1];

  if (ik === undefined)
    throw new Error(`Internal Error: 'ik=' must be defined!`);

  return { nodeEnv, ik };
}
