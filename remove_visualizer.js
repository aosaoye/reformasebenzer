const fs = require('fs');
const path = require('path');

const globalPath = path.join(__dirname, 'src', 'data', 'global.json');
if (fs.existsSync(globalPath)) {
    let globalData = JSON.parse(fs.readFileSync(globalPath, 'utf8'));
    if (globalData.navItems) {
        globalData.navItems = globalData.navItems.filter(item => item.name !== 'Visor 3D');
        fs.writeFileSync(globalPath, JSON.stringify(globalData, null, 2));
    }
}

const layoutPath = path.join(__dirname, 'src', 'data', 'layout.json');
if (fs.existsSync(layoutPath)) {
    let layoutData = JSON.parse(fs.readFileSync(layoutPath, 'utf8'));
    layoutData = layoutData.filter(item => item.type !== 'AIVisualizer' && item.type !== 'visualizer' && item.id !== 'visualizer');
    fs.writeFileSync(layoutPath, JSON.stringify(layoutData, null, 2));
}
console.log('Done cleaning JSON files');
