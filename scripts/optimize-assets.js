const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminGifsicle = require('imagemin-gifsicle');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

const buildDir = path.join(__dirname, '../build');
const androidAssetsDir = path.join(__dirname, '../android/app/src/main/assets/public');

// Ensure directories exist
if (!fs.existsSync(path.dirname(androidAssetsDir))) {
  fs.mkdirSync(path.dirname(androidAssetsDir), { recursive: true });
}

// Copy and optimize build folder to Android assets
async function optimizeAndCopyAssets() {
  console.log('Starting assets optimization...');
  
  // Compress images
  await optimizeImages();
  
  // Optimize JS and CSS
  await optimizeJsAndCss();
  
  // Copy to Android assets folder
  copyToAndroidAssets();
  
  console.log('Assets optimization complete!');
}

// Optimize images
async function optimizeImages() {
  console.log('Optimizing images...');
  
  const imageFiles = await findFiles(buildDir, ['.jpg', '.jpeg', '.png', '.gif', '.svg']);
  
  for (const file of imageFiles) {
    const files = await imagemin([file], {
      destination: path.dirname(file),
      plugins: [
        imageminMozjpeg({ quality: 70 }),
        imageminPngquant({ quality: [0.6, 0.8] }),
        imageminSvgo({
          plugins: [
            { name: 'removeViewBox', active: false },
            { name: 'removeDimensions', active: true }
          ]
        }),
        imageminGifsicle({ optimizationLevel: 2 })
      ]
    });
    
    console.log(`Optimized: ${path.basename(file)}`);
  }
}

// Optimize JS and CSS files
async function optimizeJsAndCss() {
  console.log('Optimizing JS and CSS...');
  
  // Optimize JS files
  const jsFiles = await findFiles(buildDir, ['.js']);
  for (const file of jsFiles) {
    if (!file.includes('.min.js')) {
      try {
        const code = fs.readFileSync(file, 'utf8');
        const result = await minify(code, {
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          mangle: true
        });
        
        if (result.code) {
          fs.writeFileSync(file, result.code);
          console.log(`Optimized JS: ${path.basename(file)}`);
        }
      } catch (err) {
        console.error(`Failed to optimize JS file ${file}: ${err.message}`);
      }
    }
  }
  
  // Optimize CSS files
  const cssFiles = await findFiles(buildDir, ['.css']);
  for (const file of cssFiles) {
    if (!file.includes('.min.css')) {
      try {
        const input = fs.readFileSync(file, 'utf8');
        const output = new CleanCSS({ level: 2 }).minify(input);
        
        fs.writeFileSync(file, output.styles);
        console.log(`Optimized CSS: ${path.basename(file)}`);
      } catch (err) {
        console.error(`Failed to optimize CSS file ${file}: ${err.message}`);
      }
    }
  }
}

// Copy to Android assets
function copyToAndroidAssets() {
  console.log('Copying to Android assets...');
  
  // Ensure the directory exists
  if (!fs.existsSync(androidAssetsDir)) {
    fs.mkdirSync(androidAssetsDir, { recursive: true });
  }
  
  // Delete everything in the Android assets directory
  fs.readdirSync(androidAssetsDir).forEach(file => {
    const curPath = path.join(androidAssetsDir, file);
    if (fs.lstatSync(curPath).isDirectory()) {
      deleteFolderRecursive(curPath);
    } else {
      fs.unlinkSync(curPath);
    }
  });
  
  // Copy everything from build to Android assets
  copyFolderRecursive(buildDir, androidAssetsDir);
  
  console.log('Copy complete!');
}

// Utility: Find files with specific extensions
async function findFiles(dir, extensions) {
  let results = [];
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results = results.concat(await findFiles(fullPath, extensions));
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  
  return results;
}

// Utility: Delete folder recursively
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(file => {
      const curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

// Utility: Copy folder recursively
function copyFolderRecursive(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // Get all files and directories in the source
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  // Copy each item
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    // Check if the entry is a directory
    if (entry.isDirectory()) {
      copyFolderRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Execute the optimization process
optimizeAndCopyAssets()
  .then(() => console.log('Asset optimization completed successfully'))
  .catch(err => console.error('Error during asset optimization:', err)); 