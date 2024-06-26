import '@babel/polyfill'
import {instagramPhotos} from './getInstagram'
import { login, logout } from './login';
import {contactUs, subcriber} from './contact';
import {editPage} from './editPage';
import { googleRecaptha } from './googleRecaptcha';

const loginForm = document.querySelector('#loginForm');
const logOutBtn = document.querySelector('#logoutBtn');
const contactForm = document.querySelector('#contact_form');
const subsciberForm = document.querySelector('#subscribeForm');

const editMusicButton = document.querySelectorAll('.editButton');

var instagramRows = document.getElementById('instaRow');
const position = 'beforeend';
var html = '';


if(instagramRows){
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
}


if(subsciberForm){
    subsciberForm.addEventListener('submit', e => {
        e.preventDefault();
        grecaptcha.ready(function() {
            grecaptcha.execute('6LcNdKMpAAAAAF3CPRcEzFBLPawEk92hLkBVQwWR', {action: 'submit'}).then(function(token) {
                const email = document.getElementById('subscribe_email').value;
                const pageAdded = 'asdakjshdjask';
                subcriber(email, pageAdded);
            });
        });
    });  
}


if(contactForm){
    console.log('contact form is here')
    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        grecaptcha.ready(function() {
            grecaptcha.execute('6LcNdKMpAAAAAF3CPRcEzFBLPawEk92hLkBVQwWR', {action: 'submit'}).then(function(token) {
                // Add token value to form
                let recaptcha = token; 
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;
                contactUs(name, email, message, recaptcha);
                console.log(name,email,message, recaptcha);

            });
        });
    });
}


if (loginForm){
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('inputPassword').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);


if(editMusicButton){
    
    editMusicButton.forEach(function(userItem) {
        userItem.addEventListener('click', e => {
            e.preventDefault();
            const id = e.target.id.replace('edit_', '');
            const title = 'testing title';
            const lyrics = 'fake lyrics here';
            const album = 'album test';

            const values = {id, title, lyrics, album};
            editPage(values);            
        });
      });
}
