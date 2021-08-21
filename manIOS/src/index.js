import Application from './javascript/Application.js';

import './style/main.css';
import './style/loading.css';
import './style/outline.css';
import './style/option.css';

window.application = new Application({
    $canvas: document.querySelector('.webgl'),
    $video: document.querySelector('.video'),
    $root: document.querySelector('#root'),
});
