import * as esbuild from 'esbuild';

const [cmd] = process.argv.slice(2);

const opts = {
  entryPoints: [
    { out: 'app', in: 'js/app.ts' },
    { out: 'single_sign', in: 'js/SingleSignApp.tsx' },
    { out: 'scu', in: 'js/scu.ts' },
  ],
  bundle: true,
  outdir: '../priv/static/assets',
};

if (cmd === 'deploy') {
  await esbuild.build({ ...opts, minify: true });
} else if (cmd === 'watch') {
  const ctx = await esbuild.context({ ...opts, sourcemap: 'inline' });
  await ctx.watch();
} else {
  console.error('missing command');
}
