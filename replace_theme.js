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

            let newContent = content.replace(/amber-/g, '__TMP_GREEN__');
            newContent = newContent.replace(/orange-/g, '__TMP_BROWN__');

            newContent = newContent.replace(/__TMP_GREEN__/g, 'green-');
            // Using 'stone-' as an earthy brown color, which looks much more "brown" than orange.
            // Another option is 'amber-' which is a yellow-brown. Let's use 'stone-'
            newContent = newContent.replace(/__TMP_BROWN__/g, 'stone-');

            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
            }
        }
    }
}

replaceColorsInDirectory(path.join(__dirname, 'client', 'src'));
console.log('Colors replaced successfully in client/src');
