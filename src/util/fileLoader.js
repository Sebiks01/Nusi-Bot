const { glob } = require('glob');
const path = require('path');

const msg = require('../config/messages.js');


// Deleting cached files function
async function deleteCachedFile(file) {
  // Resolving for absolute file path
  const filePath = path.resolve(file);

  // Checking if the file is cached
  if (require.cache[filePath]) {
    // Deleting cached versions of a file
    delete require.cache[filePath];
  }
}

// Loading files function
async function loadFiles(dirName) {
  try {
    // Finding all js files within specified directory
    const files = await glob(
      path.join(process.cwd(), dirName, '**/*.js').replace(/\\/g, '/')
    );

    // Replacing all '\' in the file path with '/'
    files.forEach(
      (file) => (files[files.indexOf(file)] = file.replace(/\\/g, '/'))
    );

    // Checking if files have the .js extension
    const jsFiles = files.filter((file) => path.extname(file) === '.js');

    // Async deleting all cached versions of the files
    await Promise.all(jsFiles.map(deleteCachedFile));

    // Returning the files
    return jsFiles;
  } catch (err) {
    // Logging error if occured
    console.log(msg.util.file_load_err.replace(/{DIR_NAME}/g, dirName));

    console.log(err);
  }
}

module.exports = { loadFiles };
