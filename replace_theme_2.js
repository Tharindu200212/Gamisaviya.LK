const fs = require('fs');
const path = require('path');

function replaceColorsInDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceColorsInDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            let newContent = content;

            // We will replace blue, purple, and indigo with green.
            newContent = newContent.replace(/blue-/g, 'green-');
            newContent = newContent.replace(/purple-/g, 'green-');
            newContent = newContent.replace(/indigo-/g, 'green-');

            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
            }
        }
    }
}

replaceColorsInDirectory(path.join(__dirname, 'client', 'src'));
console.log('Blue/purple/indigo replaced with green successfully in client/src');
