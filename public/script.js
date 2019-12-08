const userInfo = document.querySelector('.user-info__name');
const userJob = document.querySelector('.user-info__job');

class API {
  constructor(request) {
    this.request = request;
  }

  CardsNAddPlace(url, auth) {
    return fetch(`${url}/cards`, {
      headers: {
        authorization: `${auth}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      });
  }

  editUserData() {
    popupEdit.formWithin.submitInfo.textContent = 'Загрузка...';
    fetch(`${this.request.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: `${this.request.headers.authorization}`,
        'Content-Type': `${this.request.headers.ContentType}`,
      },
      body: JSON.stringify({
        name: `${popupEdit.formWithin.name.value}`,
        about: `${popupEdit.formWithin.job.value}`,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res;
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .then(() => {
        userInfo.textContent = popupEdit.formWithin.name.value;
        userJob.textContent = popupEdit.formWithin.job.value;
        popupEdit.close();
        popupEdit.formWithin.submitInfo.textContent = 'Сохранить';
      })
      .catch(() => { popupEdit.formWithin.submitInfo.textContent = 'Ошибка. Попробовать снова?'; });
  }

  setUser() {
    fetch(`${this.request.baseUrl}/users/me`, {
      headers: {
        authorization: `${this.request.headers.authorization}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res;
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .then((res) => res.json())
      .then((res) => {
        document.querySelector('.user-info__photo').style.backgroundImage = `url(${res.avatar})`;
        document.querySelector('.user-info__name').textContent = res.name;
        document.querySelector('.user-info__job').textContent = res.about;
        return res;
      })
      .then((res) => {
        document.querySelector('.popup__input_type_name').value = res.name;
        document.querySelector('.popup__input_type_infoProfile').value = res.about;
      })
      .catch(() => console.log('Error'));
  }
}


class Card {
  constructor(name, link, likes) {
    this.likes = likes;
    this.name = name;
    this.link = link;
    this.card = this.create(this.name, this.link, this.likes);
  }

  events(card) {
    card.querySelector('.place-card__like-icon').addEventListener('click', () => {
      this.like(card);
    });
    card.querySelector('.place-card__delete-icon').addEventListener('click', () => {
      this.remove(card);
    });
  }

  like(card) {
    card.querySelector('.place-card__like-icon').classList.toggle('place-card__like-icon_liked');
  }

  remove(card) {
    card.parentNode.removeChild(card);
  }

  create(name, link, likes) {
    const plcard = document.createElement('div');
    plcard.classList.add('place-card');
    const cardimg = document.createElement('div');
    cardimg.classList.add('place-card__image');
    cardimg.setAttribute('style', `background-image: url(${link})`);
    const cardbtn = document.createElement('button');
    cardbtn.classList.add('place-card__delete-icon');
    cardimg.appendChild(cardbtn);
    const desc = document.createElement('div');
    desc.classList.add('place-card__description');
    const header = document.createElement('h3');
    header.classList.add('place-card__name');
    header.textContent = name;
    const likeContainer = document.createElement('div');
    likeContainer.classList.add('place-card__like-container');
    const likebtn = document.createElement('button');
    likebtn.classList.add('place-card__like-icon');
    const likeAmount = document.createElement('p');
    likeAmount.classList.add('place-card__name');
    likeAmount.textContent = likes;
    desc.appendChild(header);
    likeContainer.appendChild(likebtn);
    likeContainer.appendChild(likeAmount);
    desc.appendChild(likeContainer);
    plcard.appendChild(cardimg);
    plcard.appendChild(desc);
    this.events(plcard);
    return plcard;
  }
}

class Popup {
  constructor(elem) {
    this.elem = elem;
    this.formWithin = elem.querySelector('.popup__form');
    this.closeButton = elem.querySelector('.popup__close');
    this.addEvents();
  }

  open() {
    this.elem.classList.add('popup_is-opened');
  }

  close() {
    this.elem.classList.remove('popup_is-opened');
  }

  addEvents() {
    this.closeButton.addEventListener('click', () => {
      this.close();
    });
  }
}

class CardList {
  constructor(container, masCards) {
    this.container = container;
    this.masCards = masCards;
  }


  addCard(card) {
    this.container.appendChild(card);
  }

  render() {
    for (let i = 0; i < this.masCards.length; i += 1) {
      this.addCard(new Card(this.masCards[i].name, this.masCards[i].link,
        this.masCards[i].likes.length).card);
    }
  }
}


const session = new API({
  baseUrl: 'http://95.216.175.5/cohort4',
  headers: {
    authorization: '64054b97-077f-410e-a42b-579936b99c8f',
    ContentType: 'application/json',
  },
});

const popupEdit = new Popup(document.querySelector('.popup-edit'));
const formButton = document.querySelector('.user-info__button');
const editButton = document.querySelector('.user-info__edit-button');
const popupNewPlace = new Popup(document.querySelector('.popup-newPlace'));
const pictureBlur = new Popup(document.querySelector('.background-blur'));
const initialCards = [];
let cardList = null;


session.setUser();
session.CardsNAddPlace(session.request.baseUrl,
  session.request.headers.authorization, session.request.headers.ContentType)
  .then((res) => {
    res.forEach((value) => {
      initialCards.push(value);
    });
    cardList = new CardList(document.querySelector('.places-list'), initialCards);
    cardList.render();
  })
  .catch((res) => { console.log(`Ошибка: ${res}`); });

popupNewPlace.formWithin.addEventListener('submit', (event) => {
  event.preventDefault();
  popupNewPlace.formWithin.submitNew.textContent = 'Загрузка...';
  fetch(`${session.request.baseUrl}/cards`, {
    method: 'POST',
    headers: {
      authorization: `${session.request.headers.authorization}`,
      'Content-Type': `${session.request.headers.ContentType}`,
    },
    body: JSON.stringify({
      name: popupNewPlace.formWithin.namePlace.value,
      link: popupNewPlace.formWithin.link.value,
    }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } return Promise.reject(res.status);
    })
    .then(() => {
      cardList.addCard(new Card(popupNewPlace.formWithin.namePlace.value,
        popupNewPlace.formWithin.link.value).card);
      popupNewPlace.close();
      popupNewPlace.formWithin.reset();
      popupNewPlace.formWithin.submitNew.textContent = '+';
    })
    .then(() => {
      cardList.container.addEventListener('click', (event) => {
        if (event.target.classList.contains('place-card__image')) {
          pictureBlur.image = pictureBlur.elem.querySelector('.popup-image');
          pictureBlur.open();
          pictureBlur.image.setAttribute('src', `${event.target.style.backgroundImage.substr(5,
            event.target.style.backgroundImage.length - 7)}`);
        }
      });
    })
    .catch(() => {
      popupNewPlace.formWithin.submitNew.textContent = 'Ошибка. Попробовать снова?';
    });
});


function checkValid(inputField) {
  const val = inputField.value;
  const err = document.querySelector(`.error-${inputField.name}`);
  if (val.length === 0) {
    err.textContent = 'Это обязательное поле';
    return false;
  } if (val.length > 30 || val.length < 2) {
    err.textContent = 'Должно быть от 2 до 30 символов';
    return false;
  }
  err.textContent = '';
  return true;
}


editButton.addEventListener('click', () => {
  popupEdit.open();
});


popupEdit.formWithin.name.addEventListener('input', () => {
  if (checkValid(popupEdit.formWithin.name) && checkValid(popupEdit.formWithin.job)) {
    popupEdit.formWithin.submitInfo.classList.add('popup__button_active');
    popupEdit.formWithin.submitInfo.removeAttribute('disabled');
  } else {
    popupEdit.formWithin.submitInfo.classList.remove('popup__button_active');
    popupEdit.formWithin.submitInfo.setAttribute('disabled', '');
  }
});

popupEdit.formWithin.job.addEventListener('input', () => {
  if (checkValid(popupEdit.formWithin.job) && checkValid(popupEdit.formWithin.name)) {
    popupEdit.formWithin.submitInfo.classList.add('popup__button_active');
    popupEdit.formWithin.submitInfo.removeAttribute('disabled');
  } else {
    popupEdit.formWithin.submitInfo.classList.remove('popup__button_active');
    popupEdit.formWithin.submitInfo.setAttribute('disabled', '');
  }
});

popupEdit.formWithin.addEventListener('submit', (event) => {
  event.preventDefault();
  session.editUserData();
});


formButton.addEventListener('click', () => {
  popupNewPlace.open();
});


popupNewPlace.formWithin.namePlace.addEventListener('input', () => {
  if (checkValid(popupNewPlace.formWithin.namePlace)) {
    popupNewPlace.formWithin.submitNew.classList.add('popup__button_active');
    popupNewPlace.formWithin.submitNew.removeAttribute('disabled');
  } else {
    popupNewPlace.formWithin.submitNew.classList.remove('popup__button_active');
    popupNewPlace.formWithin.submitNew.setAttribute('disabled', '');
  }
});
