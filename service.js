import { exec } from 'child_process';
import { Service } from 'node-windows';
import { join } from 'path';

// Path to your TypeScript application
const tsAppPath = join(__dirname, 'src', 'index.ts');

// Create a new service object
const svc = new Service({
  name: 'MyNodeApp', // Name of the service
  description: 'My Node.js application running as a Windows service.', // Service description
  script: tsAppPath, // Path to your TypeScript application
  nodeOptions: [
    // Add ts-node for running TypeScript directly
    '--require', 'ts-node/register'
  ],
});

// Listen for the "install" event
svc.on('install', function () {
  console.log('Service installed successfully!');
  svc.start(); // Start the service after installation
});

// Install the service
svc.install();
