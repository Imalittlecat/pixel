function get_result_from_cookie() {
    let cookies = document.cookie.split('; ');
    console.log(cookies);
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].split('=');
        console.log(cookie);
        if (cookie[0] == 'pixel-result') {
            return cookie[1];
        }
    }
    return '0' * 450
}

let IS_CLICKED = false;
let CURRENT_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--current-color');
let CURRENT_COLORCODE = "1"
let DEFAULT_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--default-color');
let FILL_MODE = false;
let COLORS = ['rgb(62, 62, 62', 'rgb(255, 102, 46)',
              'rgb(26, 218, 84)', 'rgb(83, 15, 255)', 
              'rgb(255, 236, 26)', 'rgb(142, 229, 255)'];

document.addEventListener('mousedown', () => IS_CLICKED = true);
document.addEventListener('mouseup', () => IS_CLICKED = false);

let field = document.querySelector('.field')
let temp_result = get_result_from_cookie();
console.log('temp-result', temp_result);

if (temp_result != '0') {
    for (let i = 0; i < 450; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('id', `${i}`);
        cell.dataset.color = temp_result[i];
        cell.style.backgroundColor = COLORS[parseInttemp_result[i]];
        field.appendChild(cell);
    }
}

let cells = document.querySelectorAll('.cell');
cells.forEach((cell) => {
    cell.addEventListener('click', () => {
        if (IS_CLICKED) {
            anime({
                targets: cell,
                background: CURRENT_COLOR,
                duration: 200,
                easing: 'linear'
            })
            cell.dataset.color = CURRENT_COLOR;
        }
    
    })
    cell.addEventListener('mousedown', () => {
        if (FILL_MODE) {
            let cell_id = parseInt(cell.getAttribute('id'));
            FILL_MODE = !FILL_MODE;
            anime ({
                targets: cell,
                background: CURRENT_COLOR,
                duration: 500,
                easing: 'easeInOutQuad',
                delay: anime.stagger(50, {grid: [30, 15], from: cell_id}),
            })
            cells.forEach(cell => cell.dataset.color = CURRENT_COLORCODE)
        } else {
            anime({
                targets: cell,
                background: CURRENT_COLOR,
                duration: 500,
                easing: 'easeInOutQuad'
            })
            cell.dataset.color = CURRENT_COLORCODE;
        }
    
    })
})

let color_cells = document.querySelectorAll('.color-cell');
color_cells.forEach(color_cell => {
    color_cell.addEventListener('click', () => {
        FILL_MODE = false;
        CURRENT_COLOR = getComputedStyle(color_cell).backgroundColor;
        CURRENT_COLORCODE = color_cell.dataset.colorcode;
        document.documentElement.style.cssText = `--current-color: ${CURRENT_COLOR}`;
        document.querySelector('.selected').classList.remove('selected');
        color_cell.classList.add('selected');
    })
})

document.querySelector('.eraser').addEventListener('click', function () {
    CURRENT_COLOR = DEFAULT_COLOR;
    CURRENT_COLORCODE = "0";
    document.documentElement.style.cssText = `--current-color: ${CURRENT_COLOR}`;
    document.querySelector('.selected').classList.remove('selected');
    this.classList.add('selected');
})

document.querySelector('.fill-tool').addEventListener('click', function () {
    FILL_MODE = !FILL_MODE;
    document.querySelector('.selected').classList.remove('selected');
    this.classList.add('selected');
})

setInterval(() => {
    let result = ""
    let temp_cells = document.querySelectorAll('.cell');
    temp_cells.forEach(cell => result += `${cell.dataset.color}`)
    document.cookie = `pixel-result= ${result};max-age=100000`
    console.log(document.cookie)
}, 60000)

document.querySelector('.save-tool').addEventListener('click', () => {
    domtoimage.tojpeg(field, {quality: 2})
    .then((dataUrl) => {
        let link = document.createElement('a');
        link.download = 'pixel.jpg';
        link.href = dataUrl;
        link.click()
    }).catch((error) => console.error('oops, something went wrong!', error))
})