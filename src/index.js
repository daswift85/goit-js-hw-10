import "./css/styles.css";

const DEBOUNCE_DELAY = 300;

import { fetchCountries } from "./fetchCountries.js";
import debounce from "lodash.debounce";
import Notiflix from "notiflix";

const searchBox = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

const renderCountryList = (countries) => {
  countryList.innerHTML = "";
  countries.forEach((country) => {
    const li = document.createElement("li");
    li.classList.add("country-item");
    const flag = document.createElement("img");
    flag.src = country.flags.svg;
    flag.alt = `Flag of ${country.name.official}`;
    flag.classList.add("country-flag");
    const name = document.createElement("p");
    name.textContent = country.name.official;
    name.classList.add("country-name");
    li.append(flag, name);
    countryList.append(li);
  });
};

const renderCountryInfo = (country) => {
  let languages = "";
  if (country.languages) {
    languages = Object.values(country.languages).join(", ");
  }
  countryInfo.innerHTML = `
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" class="country-flag">
      <h2 class="country-name">${country.name.official}</h2>
      <p><strong>Capital:</strong> ${country.capital}</p>
      <p><strong>Population:</strong> ${country.population}</p>
      <p><strong>Languages:</strong> ${languages}</p>
    `;
};

const onSearch = debounce(() => {
  const searchValue = searchBox.value.trim();
  if (searchValue) {
    fetchCountries(searchValue)
      .then((countries) => {
        if (countries.length === 0) {
          Notiflix.Notify.failure("Oops, there is no country with that name");
          countryList.innerHTML = "";
          countryInfo.innerHTML = "";
        } else if (countries.length > 10) {
          Notiflix.Notify.warning(
            "Too many matches found. Please enter a more specific name."
          );
          countryList.innerHTML = "";
          countryInfo.innerHTML = "";
        } else if (countries.length > 1 && countries.length <= 10) {
          renderCountryList(countries);
          countryInfo.innerHTML = "";
        } else if (countries.length === 1) {
          renderCountryInfo(countries[0]);
          countryList.innerHTML = "";
        }
      })
      .catch((error) => {
        if (error.message.includes("404")) {
          Notiflix.Notify.failure("Oops, there is no country with that name");
          countryList.innerHTML = "";
          countryInfo.innerHTML = "";
        } else {
          console.log(error);
          Notiflix.Notify.failure(
            "Something went wrong. Please try again later."
          );
        }
      });
  } else {
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
  }
}, DEBOUNCE_DELAY);

searchBox.addEventListener("input", onSearch);
