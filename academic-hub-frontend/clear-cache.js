// Clear React development cache
const fs = require('fs');
const path = require('path');

const nodeModulesPath = path.join(__dirname, 'node_modules', '.cache');
const buildPath = path.join(__dirname, 'build');

// Remove cache directories
if (fs.existsSync(nodeModulesPath)) {
  fs.rmSync(nodeModulesPath, { recursive: true, force: true });
  console.log('✅ Cleared node_modules/.cache');
}

if (fs.existsSync(buildPath)) {
  fs.rmSync(buildPath, { recursive: true, force: true });
  console.log('✅ Cleared build directory');
}

console.log('✅ Cache cleared! Please restart your development server.');


