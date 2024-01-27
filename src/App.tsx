import { useEffect } from 'react';
import { outputStdout, useWebContainer } from './services/webContainer';

export const App = () => {
  const { webContainer, serverUrl } = useWebContainer({
    'package.json': {
      file: {
        contents: `{
          "name": "vite-test",
          "private": true,
          "version": "0.0.0",
          "type": "module",
          "scripts": {
            "dev": "vite",
            "build": "vite build",
            "preview": "vite preview"
          },
          "devDependencies": {
            "vite": "^5.0.12"
          }
        }
        `,
      },
    },
    'main.js': {
      file: {
        contents: `
        document.querySelector('#app').innerHTML = "hello!";
        `,
      },
    },
    'index.html': {
      file: {
        contents: `<!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Vite App</title>
          </head>
          <body>
            <div id="app"></div>
            <script type="module" src="/main.js"></script>
          </body>
        </html>
        `,
      },
    },
  });

  useEffect(() => {
    const runCommands = async () => {
      if (webContainer) {
        const ls = await webContainer.spawn('ls');
        ls.output.pipeTo(outputStdout());

        await ls.exit;

        const npmInstall = await webContainer.spawn('npm', ['install']);
        npmInstall.output.pipeTo(outputStdout());

        await npmInstall.exit;

        const npmRunDev = await webContainer.spawn('npm', ['run', 'dev']);
        npmRunDev.output.pipeTo(outputStdout());
      }
    };

    runCommands();
  }, [!!webContainer]);

  return <iframe src={serverUrl} id="web-view" />;
};
