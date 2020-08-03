import '@babel/polyfill'
import {instagramPhotos} from './getInstagram'


var instagramRows = document.getElementById('instaRow');
const position = 'beforeend';
var html = '';

instagramPhotos().then(val => {

    val.forEach(element => {
        html += `<div class="image-item col">
                    <div class="multiply-effect">
                        <a href="https://www.instagram.com/mathew_maciel/?hl=en" target="_blank">
                            <img class="first" src="${element}" width="300" height="300" alt="">
                        <span class="second">
                            <img src="${element}" width="300" height="300" alt="">
                        </span>
                        <span class="third">
                            <img src="${element}" width="300" height="300" alt="">
                        </span>
                        </a>
                    </div>
                </div>`
    });

    instagramRows.insertAdjacentHTML(position, html);
});



