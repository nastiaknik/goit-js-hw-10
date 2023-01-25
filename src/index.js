// пошук країн за її частковою або повною назвою.
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import API from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  infoContainerEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener(
  'input',
  debounce(onSearchCountries, DEBOUNCE_DELAY)
);

function onSearchCountries() {
  clearMurkup();
  const searchQuery = refs.inputEl.value.trim();

  if (searchQuery) {
    API.fetchCountries(searchQuery)
      .then(makeMarkup)
      .catch(error => {
        console.log(error);
      });
  } else {
    Notify.info('Type a name of country.');
  }
}

function makeMarkup(country) {
  if (country.length > 10) {
    Notify.warning(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (country.length >= 2 && country.length <= 10) {
    refs.listEl.insertAdjacentHTML(
      'beforeend',
      createCountriesListMarkup(country)
    );
  }
  if (country.length < 2) {
    refs.infoContainerEl.insertAdjacentHTML(
      'beforeend',
      createCountriesInfoMarkup(country)
    );
  }
}

function createCountriesListMarkup(country) {
  return country
    .map(({ flags: { svg }, name: { official } }) => {
      return `
      <li class="coutry-list__item">
        <img src=${svg} alt="flag" width="60"></img>
        <h3 class="country-list__descr">${official}</p>
      </li>`;
    })
    .join('');
}

function createCountriesInfoMarkup(country) {
  return country
    .map(
      ({
        flags: { svg },
        name: { official },
        capital,
        population,
        languages,
      }) => {
        return `
        <img src=${svg} alt="flag" width="60"></img>
        <h2 class="country-info__name">${official}</h2>
        <p class="country-info__descr">
          Capital: <span class="country-info__value">${capital}</span>
        </p>
        <p class="country-info__descr">
          Population: <span class="country-info__value">${population}</span>
        </p>
        <p class="country-info__descr">
          Languages: <span class="country-info__value">${Object.values(
            languages
          ).join(', ')}</span>
        </p>`;
      }
    )
    .join('');
}

function clearMurkup() {
  refs.infoContainerEl.innerHTML = '';
  refs.listEl.innerHTML = '';
}
