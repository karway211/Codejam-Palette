const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pencil = document.getElementById('pencil');
const paintBucket = document.getElementById('paintBucket');
const choose = document.getElementById('choose');
let chooseFlag = false;
let pencilFlag = true;
let paintBucketFlag = false;
const currentColor = document.getElementById('Current');
const prev = document.getElementById('prev');
const blue = document.getElementById('blue');
const red = document.getElementById('red');
prev.style.backgroundColor = '#fff';
blue.style.backgroundColor = '#0000FF';
red.style.backgroundColor = '#ff0000';
currentColor.value = '#000000';
pencil.style.backgroundColor = 'green';

const local = () => {
    const imageData = canvas.toDataURL();
    localStorage.setItem('myKey', imageData);
};

if (localStorage.getItem('myKey')) {
    const dataURL = localStorage.getItem('myKey');
    const img = new Image();
    img.src = dataURL;
    img.onload = function onl() {
        ctx.drawImage(img, 0, 0);
    };
}

const checkPencil = () => {
    if (pencilFlag) {
        pencilFlag = false;
        pencil.style.backgroundColor = '';
    } else {
        pencilFlag = true;
        paintBucketFlag = false;
        chooseFlag = false;
        pencil.style.backgroundColor = 'green';
        paintBucket.style.backgroundColor = '';
        choose.style.backgroundColor = '';
    }
};

pencil.addEventListener('click', checkPencil);

const checkBucket = () => {
    if (paintBucketFlag) {
        paintBucketFlag = false;
        paintBucket.style.backgroundColor = '';
    } else {
        paintBucketFlag = true;
        pencilFlag = false;
        chooseFlag = false;
        paintBucket.style.backgroundColor = 'green';
        pencil.style.backgroundColor = '';
        choose.style.backgroundColor = '';
    }
};

paintBucket.addEventListener('click', checkBucket);

const checkChoose = () => {
    if (chooseFlag) {
        chooseFlag = false;
        choose.style.backgroundColor = '';
    } else {
        chooseFlag = true;
        pencilFlag = false;
        paintBucketFlag = false;
        paintBucket.style.backgroundColor = '';
        choose.style.backgroundColor = 'green';
        pencil.style.backgroundColor = '';
    }
};

choose.addEventListener('click', checkChoose);

// ctx.strokeStyle = '#000';
ctx.fillStyle = currentColor.value;
ctx.lineWidth = 2;
const strokeRect = (x, y, w, h) => {
    ctx.strokeRect(x, y, w, h);
};
const fillRect = (x, y, w, h) => {
    ctx.fillRect(x, y, w, h);
};

class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.selected = false;
    }

    draw() {
        strokeRect(this.x, this.y, this.w, this.h);
    }

    fill() {
        ctx.fillStyle = currentColor.value;
        fillRect(this.x, this.y, this.w, this.h);
    }

    select() {
        this.selected = !this.selected;
    }
}

let i = 0;
const rect = [];

for (; i < 4; i++) {
    rect.push(new Rect((i * 128), 0, 128, 128));
    rect.push(new Rect(i * 128, 128, 128, 128));
    rect.push(new Rect(i * 128, 256, 128, 128));
    rect.push(new Rect(i * 128, 384, 128, 128));
}

// let n = 128;
// let c = 4;
// let j = 0;
// for (; i < n; i++) {
//     for (; j < n; j++){
//         rect.push(new Rect(i * c, j * c, c, c));
//     }
// }

const isCursorInRect = (x, y, r) => x > r.x && x < r.x + r.w
           && y > r.y && y < r.y + r.h;

const colors = (e) => {
    if (pencilFlag) {
        const x = e.offsetX;
        const y = e.offsetY;
        rect.forEach((elem) => {
            if (isCursorInRect(x, y, elem)) {
                elem.select();
                if (elem.selected) {
                    elem.fill();
                    local();
                }
            }
        });
    }
};

const colorBucket = () => {
    rect.forEach((elem) => {
        if (paintBucketFlag) {
            elem.fill();
            local();
        }
    });
};
// localStorage.clear();
const inpChange = () => {
    prev.style.backgroundColor = ctx.fillStyle;
};
currentColor.addEventListener('change', inpChange, false);

canvas.addEventListener('click', colorBucket);

let flag = false;
canvas.addEventListener('mousedown', () => {
    flag = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (flag === true) {
        colors(e);
    }
});
canvas.addEventListener('click', colors);

canvas.addEventListener('mouseup', () => {
    flag = false;
});

const rgbToHex = (n) => {
    const str = n.split('(')[1].split(')')[0].split(' ').join('');
    const arr = str.split(',');
    const rgbHex = (r, g, b) => `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`; // eslint-disable-line no-bitwise
    return rgbHex(+arr[0], +arr[1], +arr[2]);
};

blue.onclick = () => {
    prev.style.backgroundColor = ctx.fillStyle;
    currentColor.value = rgbToHex(blue.style.backgroundColor);
};

red.onclick = () => {
    prev.style.backgroundColor = ctx.fillStyle;
    currentColor.value = rgbToHex(red.style.backgroundColor);
};

prev.onclick = () => {
    currentColor.value = rgbToHex(prev.style.backgroundColor);
};

const pipette = (e) => {
    const rectan = canvas.getBoundingClientRect();
    const x = e.clientX - rectan.left;
    const y = e.clientY - rectan.top;
    const imgData = ctx.getImageData(x, y, 1, 1).data;
    const w = (`${'rgb'}${'('}${imgData[0]}, ${imgData[1]}, ${imgData[2]})`);
    return rgbToHex(w);
};

canvas.onclick = (e) => {
    if (chooseFlag) {
        prev.style.backgroundColor = ctx.fillStyle;
        currentColor.value = pipette(e);
    }
};

document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyB') {
        checkBucket();
    }
    if (event.code === 'KeyP') {
        checkPencil();
    }
    if (event.code === 'KeyC') {
        currentColor.click();
    }
});
