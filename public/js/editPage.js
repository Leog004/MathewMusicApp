import axios from 'axios';
import { showAlert } from './alerts';
import Swal from 'sweetalert2'


const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  

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

          Toast.fire({ icon: 'success', title: 'update successfully'})
          window.setTimeout(() => {
            location.reload();
          }, 1500);

        }
      } catch (err) {
        console.log(err);
        Toast.fire({ icon: 'warning', title: 'Failed, please try again!'})
      }

}
