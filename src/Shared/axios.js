import axios from 'axios';

// CONTACT AXIOS
export const contactAxios = axios.create({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});