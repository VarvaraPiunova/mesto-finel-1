//показвает сообщение ошибки
const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};
//скрывает сообщение ошибки
const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.classList.remove(settings.errorClass);
  errorElement.textContent = '';
};
//проверяет поле на валидность 
const checkInputValidity = (
  formElement,
  inputElement,
  settings
) => {
  if (!inputElement.value.trim()) {
    showInputError(
      formElement,
      inputElement,
      "Поле не может содержать только пробелы",
      settings
    );
  } else if (!inputElement.validity.valid) {
    if (inputElement.validity.patternMismatch) {
      showInputError(
        formElement,
        inputElement,
        inputElement.dataset.errorMessage,
        settings
      );
    } else {
      showInputError(
        formElement,
        inputElement,
        inputElement.validationMessage,
        settings
      );
    }
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};
//проверяем есть ли хотя бы одно невалидное поле
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};
//выключаем функцию подтверждения 
function disableSubmitButton(buttonElement, settings) {
  buttonElement.disabled = true;
  buttonElement.classList.add(settings.inactiveButtonClass);
}
//выключаем функцию подтверждения 
function enableSubmitButton(buttonElement, settings) {
  buttonElement.disabled = false;
  buttonElement.classList.remove(settings.inactiveButtonClass);
}
//проверка валидности для включения или выключения кнопки 
function toggleButtonState(inputList, buttonElement, settings) {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, settings);
  } else {
    enableSubmitButton(buttonElement, settings);
  }
}
//добавляем слушателей проверяя форму 
function setEventListeners(formElement, settings) {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
}

export function clearValidation(formElement, settings) {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });

  disableSubmitButton(buttonElement, settings);
}
//включаем валидацию 
export function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));

  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
  });
}
