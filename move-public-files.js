// Using CommonJS syntax for better compatibility with Node.js 14
const fs = require('fs');
const path = require('path');

// Paths
const publicDir = path.resolve(__dirname, 'public');
const rootDir = path.resolve(__dirname, '.');

console.log('Public directory path:', publicDir);
console.log('Root directory path:', rootDir);

// Copy all files from public to root
function copyFilesFromPublic() {
  try {
    console.log('Reading public directory contents...');
    const files = fs.readdirSync(publicDir);
    console.log('Found files:', files);
    
    let filesCopied = 0;
    
    for (const file of files) {
      // Skip index.html as we've already created it
      if (file === 'index.html') {
        console.log('Skipping index.html as it already exists in root');
        continue;
      }
      
      const sourceFile = path.join(publicDir, file);
      const targetFile = path.join(rootDir, file);
      
      // Check if it's a file (not a directory)
      if (fs.statSync(sourceFile).isFile()) {
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`Copied ${sourceFile} to ${targetFile}`);
        filesCopied++;
      } else {
        console.log(`Skipping directory: ${file}`);
      }
    }
    
    if (filesCopied > 0) {
      console.log(`${filesCopied} public files copied to the root directory successfully!`);
    } else {
      console.log('No files were copied. Please check if the public directory contains files.');
    }
  } catch (error) {
    console.error('Error copying files:', error);
  }
}

copyFilesFromPublic(); 