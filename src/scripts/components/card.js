import { changeLikeCardStatus } from "./api.js";
import { deleteCardApi } from "./api.js";

export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};


export const createCardElement = (
  data, currentUserId,
  { onPreviewPicture, onLikeIcon, onDeleteCard, onInfoClick }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const infoButton = cardElement.querySelector(
    ".card__control-button_type_info"
  );
  if (data.owner && data.owner._id !== currentUserId) {
    deleteButton.remove();
  }
  const cardImage = cardElement.querySelector(".card__image");
  const likeCount = cardElement.querySelector(".card__like-count");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;
  likeCount.textContent = data.likes ? data.likes.length : 0;

  const isLiked = data.likes.some(
    (like) => like._id === currentUserId
  );

if (isLiked) {
  likeButton.classList.add(
    "card__like-button_is-active"
  );
}

if (onLikeIcon) {
  likeButton.addEventListener("click", () => {
    const isLikedNow =
      likeButton.classList.contains(
        "card__like-button_is-active"
      );

    changeLikeCardStatus(
      data._id,
      isLikedNow
    )
      .then((updatedCard) => {
        likeButton.classList.toggle(
          "card__like-button_is-active"
        );

        likeCount.textContent =
          updatedCard.likes.length;
      })
      .catch((err) => console.log(err));
  });
}

  if (onDeleteCard && deleteButton) {
  deleteButton.addEventListener("click", () => {
    deleteCardApi(data._id)
      .then(() => {
        cardElement.remove();
      })
      .catch((err) => console.log(err));
    });
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
  }

  if (onInfoClick && infoButton) {
    infoButton.addEventListener("click", () => {
      onInfoClick(data);
    });
  }
  
  return cardElement;
};

