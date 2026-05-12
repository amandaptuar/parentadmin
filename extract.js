import fs from 'fs';

const appContent = fs.readFileSync('src/App.jsx', 'utf8');

function extractTag(content, tag, className) {
    let regex;
    if (className) {
        regex = new RegExp(`<${tag}[^>]*className=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`, 'g');
    } else {
        regex = new RegExp(`<${tag}[^>]*>`, 'g');
    }
    
    let match = regex.exec(content);
    if (!match) return null;
    
    let startIndex = match.index;
    let depth = 0;
    let i = startIndex;
    
    while (i < content.length) {
        if (content.substr(i, 2) === '</') {
            let endIndex = content.indexOf('>', i);
            let closingTag = content.substring(i + 2, endIndex).trim().split(' ')[0];
            if (closingTag === tag) {
                depth--;
                if (depth === 0) {
                    return content.substring(startIndex, endIndex + 1);
                }
            }
            i = endIndex + 1;
        } else if (content.substr(i, 1) === '<' && content.substr(i, 2) !== '<!' && content.substr(i, 2) !== '<?') {
            // Self closing tag check is simple
            let endIndex = content.indexOf('>', i);
            let fullTag = content.substring(i, endIndex + 1);
            if (!fullTag.endsWith('/>')) {
                let tagName = content.substring(i + 1, endIndex).trim().split(/[ >]/)[0];
                if (tagName === tag) {
                    depth++;
                } else if (!['img', 'input', 'hr', 'br', 'meta', 'link'].includes(tagName)) {
                    // It's another tag, we only care about depth of the target tag, wait, actually depth only tracks the TARGET tag.
                    // Oh, my parser logic for depth is simple: it increments only if it's the exact same tag name.
                    // This works if we only care about `<div...>` and `</div>`.
                }
            }
            i = endIndex + 1;
        } else {
            i++;
        }
    }
    return null;
}

const preloader = extractTag(appContent, 'div', null); // actually preloader has id="preloader"
// Let's just use string indexOf since the structure is exact.
const preloaderStr = appContent.substring(appContent.indexOf('<div id="preloader">'), appContent.indexOf('</div>', appContent.indexOf('<div className="spinner"></div>')) + 14);

const sidebarStr = extractTag(appContent.substring(appContent.indexOf('<div className="left side-menu">')), 'div', 'left');
const topbarStr = extractTag(appContent.substring(appContent.indexOf('<div className="topbar">')), 'div', 'topbar');
const dashboardStr = extractTag(appContent.substring(appContent.indexOf('<div className="page-content-wrapper dashborad-v">')), 'div', 'page-content-wrapper');
const footerStr = extractTag(appContent.substring(appContent.indexOf('<footer className="footer">')), 'footer', 'footer');

fs.writeFileSync('src/components/Preloader.jsx', `import React, { useEffect } from 'react';

export default function Preloader() {
  useEffect(() => {
    if (window.$) {
      window.$('#status').fadeOut();
      window.$('#preloader').delay(350).fadeOut('slow');
      window.$('body').delay(350).css({
        'overflow': 'visible'
      });
    }
  }, []);

  return (
    <div id="preloader">
      <div id="status">
        <div className="spinner"></div>
      </div>
    </div>
  );
}`);

fs.writeFileSync('src/components/Sidebar.jsx', `import React from 'react';\n\nexport default function Sidebar() {\n  return (\n    ${sidebarStr}\n  );\n}`);
fs.writeFileSync('src/components/Topbar.jsx', `import React from 'react';\n\nexport default function Topbar() {\n  return (\n    ${topbarStr}\n  );\n}`);
fs.writeFileSync('src/components/Dashboard.jsx', `import React from 'react';\n\nexport default function Dashboard() {\n  return (\n    ${dashboardStr}\n  );\n}`);
fs.writeFileSync('src/components/Footer.jsx', `import React from 'react';\n\nexport default function Footer() {\n  return (\n    ${footerStr}\n  );\n}`);

const newAppJsx = `import React from 'react';
import Preloader from './components/Preloader';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Preloader />
      <div id="wrapper">
        <Sidebar />
        <div className="content-page">
          <div className="content">
            <Topbar />
            <Dashboard />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
`;
fs.writeFileSync('src/App.jsx', newAppJsx);

console.log("Components extracted and App.jsx updated.");
