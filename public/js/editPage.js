import axios from 'axios';
import { showAlert } from './alerts';
import Swal from 'sweetalert2'


export const editPage = async( ...values ) => {

    const {id, title, album, lyrics} = values[0];
    console.log(id, title, album, lyrics);

    try {
        const res = await axios({
          method: 'PATCH',
          url: `https://www.mathewmacielmusic.com/api/v1/music/${id}`,
          data: {
              title,
              album,
              lyrics
          }
        });
        
        if (res.data.status === 'success') {
          showAlert('success', 'music edit is successfully changed!');
          window.setTimeout(() => {
            location.assign('/admin/');
          }, 1500);
        }
      } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message.toUpperCase());
      }

}
