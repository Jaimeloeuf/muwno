export function getArgv() {
  const noIkArgv = process.argv.some((argv) => new RegExp(/noik/g).test(argv));

  // If user explicitly requests for no idempotency key to be used, return
  // without parsing for ik key.
  if (noIkArgv) return { ik: undefined };

  const ikArgv =
    process.argv.find((argv) => new RegExp(/ik=\w+/g).test(argv)) ??
    'ik=cli-setup-idempotent-key';

  const ik = ikArgv.split('=')[1];

  if (ik === undefined)
    throw new Error(`Internal Error: 'ik=' must be defined!`);

  return { ik };
}
