////polyfill for remove()
import("element-remove");

//=========================================================================

//add item function
function addItem() {
  const inputText = event.target.value;
  let list = document.querySelector(".todo__list"),
    //create items
    item = document.createElement("li"),
    inpCheck = document.createElement("input"),
    label = document.createElement("label"),
    close = document.createElement("button");

  //add classes and attr
  item.className = "todo__item";
  inpCheck.className = "todo__checkbox";

  label.appendChild(document.createTextNode(inputText));
  inpCheck.setAttribute("type", "checkbox");

  //add events
  inpCheck.addEventListener("click", function() {
    changeChecked();
  });
  close.addEventListener("click", function() {
    delItem(event);
  });
  close.className = "todo__close";
  close.innerHTML = "&times;";

  //apend content  in items
  item.appendChild(inpCheck);
  item.appendChild(label);
  item.appendChild(close);

  //apend items in list
  list.appendChild(item);
}

//keydown input event
let input = document.querySelector(".todo__input"),
  content = document.querySelector(".todo__content"),
  countText = document.querySelector(".todo-toolbar__count");

content.style.cssText = "display: none";

input.addEventListener("keydown", function(event) {
  if (this.value != "" && event.keyCode === 13) {
    content.style.cssText = "display: block";
    addItem();
    this.value = "";
    let items = document.querySelectorAll(".todo__item");
    let itemsArr = [...items];
    itemsArr.map((item, index, arr) => {
      let checkBox = item.querySelectorAll(".todo__checkbox"),
        label = item.getElementsByTagName("label");
      checkBox[0].setAttribute("id", ++index);
      label[0].setAttribute("for", ++index - 1);
      countItems();
    });
  } else {
    return false;
  }
});

//change checkbox function
function changeChecked() {
  let checkBox = document.querySelectorAll(".todo__checkbox"),
    checkBoxArr = [...checkBox];

  checkBoxArr.map((item, index, arr) => {
    let label = [...item.parentNode.children].filter(child => child !== item);
    if (item.checked == true) {
      label[0].style.cssText = "text-decoration: line-through; color: #ddd;";
      item.setAttribute("data-selected", "");
    } else {
      label[0].style.cssText = "text-decoration: none; color: '';";
      item.removeAttribute("data-selected");
    }
  });
  countItems();
}

//count items function
function countItems() {
  let checkbox = document.querySelectorAll(".todo__checkbox"),
    checkboxArr = [...checkbox],
    checkboxChecked = checkboxArr.filter(item => {
      return item.hasAttribute("data-selected");
    }),
    checkboxCheckedLength = checkboxChecked.length,
    items = document.querySelectorAll(".todo__item"),
    itemsArr = [...items];

  countText.textContent = `${itemsArr.length -
    checkboxCheckedLength} item left`;
}

//single item delete function
function delItem(event) {
  let current = event.target,
    item = current.parentElement,
    items = document.querySelectorAll(".todo__item"),
    itemsArr = [...items];

  item.classList.add("remove");
  item.addEventListener(
    "transitionend",
    () => {
      item.remove();
      countItems();
    },
    false
  );

  if (itemsArr.length - 1 <= 0) {
    item.addEventListener(
      "transitionend",
      () => {
        content.style.cssText = "display: none";
      },
      false
    );
  }
}

//clear all function
function delItemsAll() {
  let items = document.querySelectorAll(".todo__item"),
    itemsArr = [...items];
  const itemsRemoveDelay = () => {
    return itemsArr.map((item, index, arr) => {
      return new Promise(resolve =>
        setTimeout(() => {
          item.classList.add("remove");
          countItems();
          resolve();
        }, index * 50)
      );
    });
  };
  Promise.all([...itemsRemoveDelay()]).then(() => {
    content.style.cssText = "display: none";
    items.forEach(item => {
      item.remove();
    });
  });
}

//buttons toolbar
let clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", () => {
  delItemsAll();
});

let activeBtn = document.getElementById("activeBtn"),
  completeBtn = document.getElementById("completedBtn"),
  allBtn = document.getElementById("all"),
  btnArr = [activeBtn, completeBtn, allBtn];

btnArr.forEach(item => {
  item.addEventListener("click", function(event) {
    filterBtn();
    btnArr.forEach(item => {
      item.classList.remove("active");
    });
    this.classList.add("active");
  });
});

//filter function
function filterBtn() {
  let currentbtn = event.target,
    items = document.querySelectorAll(".todo__item"),
    itemsArr = [...items],
    checkbox = document.querySelectorAll(".todo__checkbox"),
    checkboxArr = [...checkbox],
    checkboxChecked = checkboxArr.filter(item => {
      return item.hasAttribute("data-selected");
    }),
    checkboxNotChecked = checkboxArr.filter(item => {
      return !item.hasAttribute("data-selected");
    });

  if (currentbtn.getAttribute("id") === "activeBtn") {
    checkboxChecked.forEach(item => {
      let items = item.parentElement;
      items.style.cssText = "display: none";
    });
    checkboxNotChecked.forEach(item => {
      let items = item.parentElement;
      items.style.cssText = "display: flex";
    });
  } else if (currentbtn.getAttribute("id") === "completedBtn") {
    checkboxNotChecked.forEach(item => {
      let items = item.parentElement;
      items.style.cssText = "display: none";
    });

    checkboxChecked.forEach(item => {
      let items = item.parentElement;
      items.style.cssText = "display: flex";
    });
  } else if (currentbtn.getAttribute("id") === "all") {
    itemsArr.forEach(item => {
      item.style.cssText = "display: flex";
    });
  }
}
