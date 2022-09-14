export const setOutsideClickHandler = (containerElement: () => HTMLElement | HTMLElement, onOutsideClick: Function) => {
  const outsideClickHandler: EventListener = e => {
    let elem = e.target as HTMLElement
    let isOutsideClicked = true
    const container = typeof containerElement === 'function' ? containerElement() : containerElement
    while (elem) {
      console.log(elem)
      if (elem === container) {
        isOutsideClicked = false
        break
      }
      elem = elem.parentElement
    }
    if (isOutsideClicked) {
      onOutsideClick()
      document.removeEventListener("click", outsideClickHandler)
    }
  }
  document.addEventListener("click", outsideClickHandler)
}
