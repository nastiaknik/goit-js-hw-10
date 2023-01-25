import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://restcountries.com/v3.1/name/';

function fetchCountries(name) {
  const url = `${BASE_URL}${name}?fields=name,capital,population,flags,languages`;

  return fetch(url).then(response => {
    if (!response.ok) {
      Notify.failure('Oops, there is no country with that name!');
      throw new Error(response.status);
    }
    return response.json();
  });
}

export default { fetchCountries };
