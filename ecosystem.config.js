module.exports = {
    apps: [
      {
        name: 'my-ts-app',
        script: 'src/index.ts', // Entry point of your TypeScript project
        interpreter: 'node', // Use Node.js as the interpreter
        interpreter_args: '-r ts-node/register', // Register ts-node to compile TypeScript on the fly
        watch: true, // Optional: Enable file watching
        env: {
          NODE_ENV: 'development',
        },
        env_production: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  