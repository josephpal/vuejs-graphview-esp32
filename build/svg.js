const svgstore = require('svgstore');
const fs = require('fs');

const sprites = svgstore({
  symbolAttrs: {
    fill: 'currentColor'
  }
});

const add = (name) => {
  sprites.add(name, fs.readFileSync(`./src/assets/svg/${name}.svg`, 'utf8'));
};

add('arrow');
add('connect');
add('disconnect');
add('load');
add('logo');
add('save');
add('clear');
add('reload');

fs.writeFileSync('./src/assets/svg/sprites.svg', sprites);
