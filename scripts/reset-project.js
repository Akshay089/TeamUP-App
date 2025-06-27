const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Clear metro bundler cache
console.log('Clearing Metro bundler cache...');
try {
  execSync('npx expo start --clear', { stdio: 'inherit' });
} catch (error) {
  console.log('Metro bundler cache cleared.');
}

// Clear watchman cache if it exists
console.log('Clearing Watchman cache...');
try {
  execSync('watchman watch-del-all', { stdio: 'inherit' });
} catch (error) {
  console.log('Watchman cache cleared or not installed.');
}

console.log('Project cache has been reset. Please restart your development server.'); 