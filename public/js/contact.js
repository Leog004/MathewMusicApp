/* eslint-disable */
import { showAlert } from './alerts';
import axios from 'axios';

export const contactUs = async (name, email, message, recaptcha) => {
    try{
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/contact',
            data: {
                name,
                email,
                message,
                recaptcha
            }
        });

        if(res.data.status === 'success'){
            showAlert('success','Message has been sent successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
        //console.log(res);
    }
    catch(err){
        showAlert('error', err.response.data.message);
        console.log(err);
    }
}


  
export const subcriber = async (email, pageAdded) => {

    try{
        const res = await axios({
            method: 'POST',
            url: 'https://www.mathewmacielmusic.com/subscriber',
            data: {
                email,
                pageAdded
            }
        });

        if(res.data.status === 'success'){
            showAlert('success','You have been subscribed!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    }
    catch(err){
        console.log(err);
        showAlert('error', err.response.data.message);
    }
}