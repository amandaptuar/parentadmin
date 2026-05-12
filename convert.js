import fs from 'fs';

const html = fs.readFileSync('../vertical/index.html', 'utf8');

// Extract the body content inside <div id="preloader"> ... </div><!-- END wrapper -->
const startIndex = html.indexOf('<div id="preloader">');
const endIndex = html.indexOf('<!-- END wrapper -->') + '<!-- END wrapper -->'.length;
let bodyContent = html.substring(startIndex, endIndex);

// Convert HTML to JSX
bodyContent = bodyContent
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/<img(.*?)>/g, (match) => {
        if (match.endsWith('/>')) return match;
        return match.replace(/>$/, ' />');
    })
    .replace(/<input(.*?)>/g, (match) => {
        if (match.endsWith('/>')) return match;
        return match.replace(/>$/, ' />');
    })
    .replace(/<hr>/g, '<hr />')
    .replace(/<br>/g, '<br />')
    // Fix inline styles like style="width: 82%"
    .replace(/style="([^"]*)"/g, (match, p1) => {
        const styleObj = p1.split(';').reduce((acc, style) => {
            const [key, value] = style.split(':');
            if (key && value) {
                const camelKey = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                acc.push(`${camelKey}: '${value.trim()}'`);
            }
            return acc;
        }, []).join(', ');
        return `style={{ ${styleObj} }}`;
    })
    // Fix svg viewBox to viewBox
    .replace(/viewbox/g, 'viewBox')
    // Fix autocomplete
    .replace(/autocomplete/g, 'autoComplete')
    // Fix tabindex
    .replace(/tabindex/g, 'tabIndex')
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // javascript:void(0) -> #
    .replace(/javascript:void\(0\);?/g, '#');

const appJsx = `
import React, { useEffect } from 'react';

function App() {
  // We don't need to re-initialize scripts because Vite will load index.html scripts on initial load.
  // However, if we need to do DOM manipulations, we can do it in useEffect.
  
  return (
    <>
      ${bodyContent}
    </>
  );
}

export default App;
`;

fs.writeFileSync('src/App.jsx', appJsx);
console.log('Successfully written to src/App.jsx');
