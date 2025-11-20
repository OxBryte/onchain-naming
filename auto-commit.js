#!/usr/bin/env node

const { execSync } = require('child_process');
const { watch } = require('fs');
const { join } = require('path');
const { readdirSync, statSync } = require('fs');

// Track changed files
const changedFiles = new Set();
let commitTimer = null;

// Function to get all files recursively
function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    // Ignore node_modules, .git, .next, and other build/cache directories
    if (file === 'node_modules' || file === '.git' || file === '.next' || 
        file === '.vercel' || file === 'dist' || file === 'build' ||
        file.startsWith('.')) {
      return;
    }
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to commit changes
function commitChanges() {
  if (changedFiles.size === 0) {
    return;
  }

  // Stage all changes
  try {
    execSync('git add -A', { stdio: 'pipe' });
    
    // Get the list of changed files
    const files = Array.from(changedFiles);
    const rootDir = process.cwd();
    const fileNames = files.map(file => {
      let relativePath = file;
      if (file.startsWith(rootDir)) {
        relativePath = file.substring(rootDir.length + 1);
      }
      return relativePath;
    });
    
    // Create commit message
    const message = `updated: ${fileNames.join(', ')}`;
    
    // Commit
    execSync(`git commit -m "${message}"`, { stdio: 'pipe' });
    
    console.log(`✓ Committed: ${message}`);
    
    // Clear the set
    changedFiles.clear();
  } catch (error) {
    // Ignore errors (e.g., no changes to commit)
    const errorMsg = error.message || error.toString();
    if (!errorMsg.includes('nothing to commit') && !errorMsg.includes('no changes')) {
      // Silent ignore for "nothing to commit" errors
    }
  }
}

// Function to schedule commit
function scheduleCommit(filePath) {
  changedFiles.add(filePath);
  
  // Clear existing timer
  if (commitTimer) {
    clearTimeout(commitTimer);
  }
  
  // Schedule commit after 3 seconds
  commitTimer = setTimeout(() => {
    commitChanges();
    commitTimer = null;
  }, 3000);
}

// Watch for file changes
function watchFiles() {
  const rootDir = process.cwd();
  const files = getAllFiles(rootDir);
  
  console.log(`Watching ${files.length} files for changes...`);
  console.log('Auto-commit will trigger 3 seconds after any file change.');
  console.log('Press Ctrl+C to stop.\n');
  
  files.forEach(file => {
    try {
      watch(file, { persistent: true }, (eventType, filename) => {
        if (eventType === 'change') {
          const relativePath = file.startsWith(rootDir) 
            ? file.substring(rootDir.length + 1) 
            : file;
          console.log(`📝 Detected change: ${relativePath}`);
          scheduleCommit(file);
        }
      });
    } catch (e) {
      // Ignore errors for files that can't be watched
    }
  });
  
  // Also watch for new files in directories
  function watchDirectory(dir) {
    try {
      watch(dir, { persistent: true, recursive: false }, (eventType, filename) => {
        if (filename && (eventType === 'rename' || eventType === 'change')) {
          const filePath = join(dir, filename);
          try {
            const stat = statSync(filePath);
            if (stat.isFile()) {
              const relativePath = filePath.startsWith(rootDir) 
                ? filePath.substring(rootDir.length + 1) 
                : filePath;
              console.log(`📝 Detected new/changed file: ${relativePath}`);
              scheduleCommit(filePath);
              // Start watching the new file
              watch(filePath, { persistent: true }, (eventType) => {
                if (eventType === 'change') {
                  console.log(`📝 Detected change: ${relativePath}`);
                  scheduleCommit(filePath);
                }
              });
            } else if (stat.isDirectory() && !filename.startsWith('.')) {
              watchDirectory(filePath);
            }
          } catch (e) {
            // File might have been deleted, ignore
          }
        }
      });
    } catch (e) {
      // Ignore errors
    }
  }
  
  // Watch root directory for new files
  watchDirectory(rootDir);
}

// Initialize git if not already initialized
try {
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
} catch (error) {
  console.log('Initializing git repository...');
  execSync('git init', { stdio: 'inherit' });
}

// Start watching
watchFiles();

