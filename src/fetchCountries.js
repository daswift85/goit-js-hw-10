import { debounce } from 'lodash.debounce';

const BASE_URL = 'https://restcountries.com/v3.1/name/';

export async function fetchCountries(name) {
  const response = await fetch(`${BASE_URL}${name}?fields=name,flags,capital,population,languages`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};
  