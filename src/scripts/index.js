/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/
import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getUserInfo,
  getCardList,
  addNewCard,
  editProfile,
  editAvatar,
} from "./components/api.js";

let currentUserId;

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".popup__input_type_description",
);

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");
const logo = document.querySelector(".header__logo");

const infoPopup =
  document.querySelector(".popup_type_info");

const infoPopupTitle =
  infoPopup.querySelector(".popup__title");

const infoPopupDefinition =
  infoPopup.querySelector(".popup__info");

const infoPopupText =
  infoPopup.querySelector(".popup__text");

const infoPopupList =
  infoPopup.querySelector(".popup__list");

const usersStatsModalWindow =
  document.querySelector(".popup_type_info");

const usersStatsModalInfoList =
  usersStatsModalWindow.querySelector(".popup__info");

const usersStatsModalUserList =
  usersStatsModalWindow.querySelector(".popup__list");

const popupInfoDefinitionTemplate =
  document.querySelector(
    "#popup-info-definition-template"
  );

const popupInfoUserPreviewTemplate =
  document.querySelector(
    "#popup-info-user-preview-template"
  );

const usersStatsModalTitle =
  usersStatsModalWindow.querySelector(
    ".popup__title"
  );

const usersStatsModalText =
  usersStatsModalWindow.querySelector(
    ".popup__text"
  );

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const renderLoading = (button, isLoading) => {
  if (isLoading) {
    button.textContent = "Сохранение...";
  } else {
    button.textContent = "Сохранить";
  }
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = evt.submitter;

  renderLoading(submitButton, true);

  editProfile(
    profileTitleInput.value,
    profileDescriptionInput.value
  )
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;

      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(submitButton, false);
    });
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = evt.submitter;

  renderLoading(submitButton, true);

  editAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage =
        `url(${userData.avatar})`;

      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(submitButton, false);
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = evt.submitter;

  renderLoading(submitButton, true);

  addNewCard(cardNameInput.value, cardLinkInput.value)
    .then((newCard) => {
      placesWrap.prepend(
        createCardElement(newCard, currentUserId, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: likeCard,
          onDeleteCard: deleteCard,
          onInfoClick: handleInfoClick,
        })
      );

      cardForm.reset();
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(submitButton, false);
    });
};

const handleInfoClick = (cardData) => {
  infoPopupDefinition.innerHTML = "";
  infoPopupList.innerHTML = "";

  infoPopupTitle.textContent =
    "Статистика карточки";

  infoPopupText.textContent =
    "Пользователи, поставившие лайк:";

  infoPopupDefinition.append(
    createInfoString(
      "Описание:",
      cardData.name
    )
  );

  infoPopupDefinition.append(
    createInfoString(
      "Дата создания:",
      formatDate(
        new Date(cardData.createdAt)
      )
    )
  );

  infoPopupDefinition.append(
    createInfoString(
      "Владелец:",
      cardData.owner.name
    )
  );

  infoPopupDefinition.append(
    createInfoString(
      "Количество лайков:",
      cardData.likes.length
    )
  );

  if (cardData.likes.length === 0) {
    infoPopupList.append(
      createUserPreview(
        "Лайков пока нет"
      )
    );
  } else {
    cardData.likes.forEach((user) => {
      infoPopupList.append(
        createUserPreview(user.name)
      );
    });
  }

  openModalWindow(infoPopup);
};

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const createInfoString = (
  definition,
  value
) => {
  const element =
    popupInfoDefinitionTemplate.content
      .querySelector(".popup__info-item")
      .cloneNode(true);

  element.querySelector(
    ".popup__info-term"
  ).textContent = definition;

  element.querySelector(
    ".popup__info-description"
  ).textContent = value;

  return element;
};

const createUserPreview = (name) => {
  const element =
    popupInfoUserPreviewTemplate.content
      .querySelector(".popup__list-item")
      .cloneNode(true);

  element.textContent = name;

  return element;
};


// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);


openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModalWindow(profileFormModalWindow);
  clearValidation(profileForm, validationSettings);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  openModalWindow(avatarFormModalWindow);
  clearValidation(avatarForm, validationSettings);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  openModalWindow(cardFormModalWindow);
  clearValidation(cardForm, validationSettings);
});

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationSettings);

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((data) => {
      placesWrap.append(
        createCardElement(data, currentUserId, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: likeCard,
          onDeleteCard: deleteCard,
          onInfoClick: handleInfoClick,
        }),
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });