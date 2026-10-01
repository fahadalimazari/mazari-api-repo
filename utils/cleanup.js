const fs = require('fs');

/**
 * Cleans up a temporary file safely.
 * @param {string} filePath - The path to the file to remove.
 */
function cleanupFile(filePath) {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to delete temporary file ${filePath}:`, err);
            }
        });
    }
}

module.exports = {
    cleanupFile
};
