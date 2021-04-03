import axios from 'axios';

export const customAxios = axios.create({
    headers: {'Authorization':localStorage.getItem('auth-token')}
});