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

            // We will replace stone- with amber- to act as our warm "Brown" color
            let newContent = content.replace(/stone-/g, 'amber-');

            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
            }
        }
    }
}

replaceColorsInDirectory(path.join(__dirname, 'client', 'src'));
console.log('Stone replaced with Amber (Brown) successfully in client/src');
