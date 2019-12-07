"use strict";

class  API {
    constructor(request){
        this.request = request;
    }

    /*
        Можно лучше: лучше вынести из всех методов класса Api работу со страницей и DOM,
        оставив здесь только запросы к серверу и возвращать из методов промисы с данными, т.к.
        лучше проектировать программу исходя из принципа единственной ответсвенности - класс Api должен отвечать
        только за обмен с сервером, но не за отрисовку страницы

        Например, метод getUserData: 
        getUserData() {
        return fetch(`${this.baseUrl}/users/me`,{ // <-- возвращаем промис с данными
            headers: this.headers
        })
        .then((res) => {
			if (res.ok) {
				return res.json();
			}
			return Promise.reject(`Ошибка: ${res.status}`);
        })
        }

        Использование метода:
        api.getUserData()
        .then((obj) => {
            userName.textContent = obj.name;
            userJob.textContent = obj.about;
        })
        .catch((err) => console.log(err));  // <-- обработка ошибок здесь, в самом конце цепочки then
        }
  */

    CardsNAddPlace(url, auth, contentType){
        return fetch(`${url}/cards`,{
            headers: {
                /* Можно лучше: настройки сервера передаются в конструктор класса, лучше использовать их */
                authorization: `${auth}`,
            }
        })
            .then((res)=>{
                if(res.ok){
                    return res.json();
                }
                else return  Promise.reject(`Ошибка: ${res.status}`)
            });

    }

    editUserData(){
        popupEdit.formWithin.submitInfo.textContent = "Загрузка...";
        fetch(`${this.request.baseUrl}/users/me`, {
            method: "PATCH",
            headers: {
                authorization: `${this.request.headers.authorization}`,
                'Content-Type': `${this.request.headers.ContentType}`
            },
            body: JSON.stringify({
                /* Можно лучше: данные пользователя должны передаваться как параметры метода, а не браться 
                из полей формы здесь напрямую */
                name: `${popupEdit.formWithin.name.value}`,
                about: `${popupEdit.formWithin.job.value}`
            })
        })
            .then((res)=>{
                if(res.ok){
                    return res;
                }
                return Promise.reject(`Ошибка: ${res.status}`)
            })
            .then(()=>{
                userInfo.textContent = popupEdit.formWithin.name.value;
                userJob.textContent = popupEdit.formWithin.job.value;
                popupEdit.close();
                popupEdit.formWithin.submitInfo.textContent = "Сохранить";
            })
            .catch(()=>{popupEdit.formWithin.submitInfo.textContent = "Ошибка. Попробовать снова?";});
    }

    setUser(){
        fetch(`${this.request.baseUrl}/users/me`, {
            headers: {
                authorization: `${this.request.headers.authorization}`
            }
        })
            .then((res)=>{if(res.ok){
                return res;
            }
            return Promise.reject(`Ошибка: ${res.status}`)})
            .then(res=>res.json())
            .then((res)=>{
                document.querySelector(".user-info__photo").style.backgroundImage = `url(${res.avatar})`;
                document.querySelector(".user-info__name").textContent = res.name;
                document.querySelector(".user-info__job").textContent = res.about;
                return res;
            })
            .then((res)=>{
                document.querySelector(".popup__input_type_name").value = res.name;
                document.querySelector(".popup__input_type_infoProfile").value = res.about;
            })
            .catch(()=>console.log("Error"));
    }
}


class Card {
    constructor(name, link, likes){
        this.likes = likes;
        this.name = name;
        this.link = link;
        this.card = this.create(this.name, this.link, this.likes);
    }

    events(card){
        card.querySelector(".place-card__like-icon").addEventListener("click", ()=>{
            this.like(card);
        });
        card.querySelector(".place-card__delete-icon").addEventListener("click", ()=>{
            this.remove(card);
        });
    }

    like(card){
        card.querySelector(".place-card__like-icon").classList.toggle("place-card__like-icon_liked");
    }

    remove(card){
        card.parentNode.removeChild(card);
    }

    create(name, link, likes){
        const plcard = document.createElement("div");
        plcard.classList.add("place-card");
        const cardimg = document.createElement("div");
        cardimg.classList.add("place-card__image");
        cardimg.setAttribute("style", `background-image: url(${link})`);
        const cardbtn = document.createElement("button");
        cardbtn.classList.add("place-card__delete-icon");
        cardimg.appendChild(cardbtn);
        const desc = document.createElement("div");
        desc.classList.add("place-card__description");
        const header = document.createElement("h3");
        header.classList.add("place-card__name");
        header.textContent = name;
        const likeContainer = document.createElement("div");
        likeContainer.classList.add("place-card__like-container");
        const likebtn = document.createElement("button");
        likebtn.classList.add("place-card__like-icon");
        const likeAmount = document.createElement("p");
        likeAmount.classList.add("place-card__name");
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

class  Popup {
    constructor(elem){
        this.elem = elem;
        this.formWithin = elem.querySelector(".popup__form");
        this.closeButton = elem.querySelector(".popup__close");
        this.addEvents();
    }

    open(){
        this.elem.classList.add("popup_is-opened");
    }
    close(){
        this.elem.classList.remove("popup_is-opened");
    }
    addEvents(){
        this.closeButton.addEventListener("click", ()=>{
            this.close();
        });
    }
}

class CardList {
    constructor(container, masCards){
        this.container = container;
        this.masCards = masCards;
    }


    addCard(card){
        this.container.appendChild(card);
    }

    render(){
        for (let i = 0; i<this.masCards.length; i++){
            this.addCard(new Card(this.masCards[i].name, this.masCards[i].link, this.masCards[i].likes.length).card);
        }
    }
}



  const session = new API({
      baseUrl: 'http://95.216.175.5/cohort4',
      headers: {
          authorization: '64054b97-077f-410e-a42b-579936b99c8f',
          ContentType: 'application/json'
}});


  const formButton = document.querySelector(".user-info__button");
  const editButton = document.querySelector(".user-info__edit-button");
  const userInfo = document.querySelector(".user-info__name");
  const userJob = document.querySelector(".user-info__job");
  const popupEdit = new Popup(document.querySelector(".popup-edit"));
  const popupNewPlace = new Popup(document.querySelector(".popup-newPlace"));
  const pictureBlur = new Popup(document.querySelector(".background-blur"));
  const initialCards = [];
  let cardList = null;


session.setUser();
session.CardsNAddPlace(session.request.baseUrl, session.request.headers.authorization, session.request.headers.ContentType)
    .then((res)=>{

        res.forEach((value)=>{
            initialCards.push(value);
        });
        cardList = new CardList(document.querySelector(".places-list"), initialCards);
        cardList.render();
    })
    .catch((res)=>{console.log("Ошибка: "+res)});

        popupNewPlace.formWithin.addEventListener("submit", function (event) {
            event.preventDefault();
            popupNewPlace.formWithin.submitNew.textContent = "Загрузка...";
            fetch(`${session.request.baseUrl}/cards`, {
                method: "POST",
                headers: {
                    authorization: `${session.request.headers.authorization}`,
                    'Content-Type': `${session.request.headers.ContentType}`
                },
                body: JSON.stringify({
                    name: popupNewPlace.formWithin.namePlace.value,
                    link: popupNewPlace.formWithin.link.value
                })
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else return Promise.reject(res.status)
                })
                .then(() => {
                    cardList.addCard(new Card(popupNewPlace.formWithin.namePlace.value, popupNewPlace.formWithin.link.value).card);
                    popupNewPlace.close();
                    popupNewPlace.formWithin.reset();
                    popupNewPlace.formWithin.submitNew.textContent = "+";
                })
                .then(()=>{
                    /*Этот слушатель вынести из промиса не получается, потому что тогда cardList не успеет стать экземпляром класса и будет равен null*/
                    cardList.container.addEventListener("click", (event) => {
                        if (event.target.classList.contains("place-card__image")) {
                            pictureBlur.image = pictureBlur.elem.querySelector(".popup-image");
                            pictureBlur.open();
                            pictureBlur.image.setAttribute("src", `${event.target.style.backgroundImage.substr(5,
                                event.target.style.backgroundImage.length - 7)}`);
                        }
                    });
                })
                .catch(() => {
                    popupNewPlace.formWithin.submitNew.textContent = "Ошибка. Попробовать снова?";
                })
        });





  function checkValid(inputField){
    const val = inputField.value;
    const err = document.querySelector(`.error-${inputField.name}`);
    if(val.length === 0){
        err.textContent = "Это обязательное поле";
        return false;
    }
    else if (val.length>30||val.length<2){
        err.textContent = "Должно быть от 2 до 30 символов";
        return false;
    }
    else {
        err.textContent = "";
        return true
    }
}




  editButton.addEventListener("click", ()=>{
      popupEdit.open();});


  popupEdit.formWithin.name.addEventListener("input",()=>{
    if(checkValid(popupEdit.formWithin.name)&&checkValid(popupEdit.formWithin.job)){
        popupEdit.formWithin.submitInfo.classList.add("popup__button_active");
        popupEdit.formWithin.submitInfo.removeAttribute("disabled");
    }
    else{
        popupEdit.formWithin.submitInfo.classList.remove("popup__button_active");
        popupEdit.formWithin.submitInfo.setAttribute("disabled", "");
    }
  });

  popupEdit.formWithin.job.addEventListener("input",()=>{
       if(checkValid(popupEdit.formWithin.job)&&checkValid(popupEdit.formWithin.name)){
           popupEdit.formWithin.submitInfo.classList.add("popup__button_active");
           popupEdit.formWithin.submitInfo.removeAttribute("disabled");
        }
        else{
           popupEdit.formWithin.submitInfo.classList.remove("popup__button_active");
           popupEdit.formWithin.submitInfo.setAttribute("disabled", "");
        }
  });

  popupEdit.formWithin.addEventListener("submit",(event)=>{
        event.preventDefault();
        session.editUserData();
  });



  formButton.addEventListener("click", function(){
        popupNewPlace.open();
  });



  popupNewPlace.formWithin.namePlace.addEventListener("input",()=>{
    if(checkValid(popupNewPlace.formWithin.namePlace)){
        popupNewPlace.formWithin.submitNew.classList.add("popup__button_active");
        popupNewPlace.formWithin.submitNew.removeAttribute("disabled");
    }
    else{
        popupNewPlace.formWithin.submitNew.classList.remove("popup__button_active");
        popupNewPlace.formWithin.submitNew.setAttribute("disabled", "");
    }
  });

/*
  Отлично, теперь обработка ошибок стоит на своем месте
  На всякий случай советую ещё раз закрепить теорию https://learn.javascript.ru/promise-error-handling
  Всю работу с DOM лучше вынести из класса Api, реализация в которой класс Api сам модифицирует страницу не 
  получит высокой оценки на дипломе.

  Для закрепления полученных знаний советую сделать и оставшуюся часть задания.
  Так же если у Вас будет свободное время попробуйте изучить работу с сервером
  с использованием async/await для работы с асинхронными запросами.
  https://learn.javascript.ru/async-await
  https://habr.com/ru/company/ruvds/blog/414373/
  Это часто используется в реальной работе  
*/





/*
  Почти все ошибки исправлены, осталось всего несколько:
  - в методе setUser убрать первый обработчик catch
  - при запросе карточек с сервера session.CardsNAddPlace пропала обработка ошибок

   В некоторых местах есть замечания по форматированию кода - проблемы с отступами.
    Об оформлении кода можно почитать здесь https://learn.javascript.ru/coding-style
   Практически все современные редакторы умеют автоматически форматировать код. 
   Постарайтесь настроить его, это сильно экономит время, а Ваш код будет всегда красив.
   Одно из наиболее популярных дополнений для форматирования кода - Prettier (https://prettier.io/)

*/

/*
  К сожалению часть замечаний ещё не исправлена: в классе Api отсутсвует или выполняется не верно проверка 
  на успешность выполнения запроса и в методе setUser первый обработчик catch не нужен

  На то как вынести добавление обработчика дал подсказку.

*/  

/*
  Отлично, что создан класс Api и обмен с сервером перенесен в него, но остались еще замечания:

  Надо исправить:
  - в некоторых запросах все ещё есть проблемы с обработкой ошибок, в некоторых местах нехватает обработчика ошибок, в некоторых он расположен не в том месте, проверки что запрос выполнился неудачно недостаточно, если запрос выполнился неудачно необходимо возвращать отклоненный промис
  - навешивания обработчика на форму в классе Api быть не должно
  - передаваяемы данные пользователя должны передаваться как параметры метода, а не браться из
  полей формы в классе Api напрямую


  Место где можно лучше: вынести из класса Api всю работу с элементами страницы, оставив только
  отправку запросов серверу и возвращать из методов класса Api промисы с данными

*/

/*
      Запросы к серверу выполняются, но есть замечания:
      - для обмена с сервером должен быть создан класс Api и все запросы должны делаться
        через его методы (см. задание раздел Требования к коду)
      - в некоторых местах не хватает проверки, что запрос выполнился успешно и нет обработки ошибок

*/