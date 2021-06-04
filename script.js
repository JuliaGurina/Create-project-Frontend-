let allCosts = [];
let valueInput = "";
let valueInput2 = "";
let d = new Date();
let dateTime =
  ("0" + d.getDate()).slice(-2) +
  "." +
  ("0" + (d.getMonth() + 1)).slice(-2) +
  "." +
  d.getFullYear();
let indexEdit = -1;
let tempEdit = "";
let tempEdit2 = "";
let tempEditDate = "";

window.onload = function init() {
  totalSum = document.getElementById("sum");
  input = document.getElementById("add-cost");
  input.addEventListener("change", updateValue1);
  input2 = document.getElementById("add-cost2");
  input2.addEventListener("change", updateValue2);
  //BUTTON 'Enter'
  input.addEventListener("keyup", updateValue3);
  input2.addEventListener("keyup", updateValue4);
};

const onclickButton = () => {
  let a = valueInput.trim();
  let b = valueInput2.trim();
  if (a === "") return alert(" Введите текст");
  if (b === "") return alert(" Введите число");
  allCosts.push({
    text: valueInput,
    text2: dateTime,
    text3: valueInput2,
  });
  valueInput = "";
  input.value = "";
  valueInput2 = "";
  input2.value = "";
  render();
};

updateValue1 = (event) => {
  valueInput = event.target.value;
};

updateValue2 = (event) => {
  valueInput2 = event.target.value;
};

updateValue3 = (event) => {
  if (event.key === "Enter") {
    onclickButton();
  }
  render();
};

updateValue4 = (event) => {
  if (event.key === "Enter") {
    onclickButton();
  }
  render();
};

updateValueNew = (e) => {
  tempEdit = e.target.value;
};

updateValueNewDate = (e) => {
  tempEditDate = e.target.value;
};

updateValueNew2 = (e) => {
  tempEdit2 = e.target.value;
};

onClickImgEdit = (index) => {
  indexEdit = index;
  render();
};

onClickSvgDelete = (index) => {
  allCosts.splice(index, 1);
  render();
};

onClickImgDone = () => {
  if (tempEdit === "") return alert("Введите текст");
  if (!Number(tempEdit2)) return alert("Введите числовое значение");
  allCosts[indexEdit].text = tempEdit;
  allCosts[indexEdit].text2 = tempEditDate;
  allCosts[indexEdit].text3 = tempEdit2;
  indexEdit = -1;
  render();
};

onClickImgCancel = () => {
  indexEdit = -1;
  render();
};

render = () => {
  let totalCounter = 0;
  const content = document.getElementById("content-page");

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allCosts.map((item, index) => {
    const container = document.createElement("div");
    container.id = `cost-${index}`;
    container.className = "block-costs";

    //Edit-textarea
    if (indexEdit === index) {
      const editInput = document.createElement("textarea");
      editInput.className = "edit-text";
      editInput.value = tempEdit;
      container.appendChild(editInput);

      const dateInput = document.createElement("input");
      dateInput.className = "edit-text2";
      dateInput.type = "date";
      dateInput.value = tempEditDate;
      container.appendChild(dateInput);

      const editInput2 = document.createElement("textarea");
      editInput2.className = "edit-text3";
      editInput2.value = tempEdit2;
      container.appendChild(editInput2);

      editInput.onkeyup = (e) => updateValueNew(e);
      dateInput.oninput = (e) => updateValueNewDate(e);
      editInput2.onkeyup = (e) => updateValueNew2(e);

      //Done
      const imgDone = document.createElement("i");
      imgDone.className = "far fa-check-circle svg-icon";
      imgDone.onclick = () => {
        onClickImgDone();
      };
      container.appendChild(imgDone);

      //Cancel
      const imgCancel = document.createElement("i");
      imgCancel.className = "far fa-window-close svg-icon";
      imgCancel.onclick = () => {
        onClickImgCancel();
      };
      container.appendChild(imgCancel);
    } else {
      //Costs-'li'
      const textName = document.createElement("div");
      textName.className = "name-text";
      textName.innerText = `• Магазин`;

      const text = document.createElement("p");
      text.className = "shop-text";
      text.innerText = ` "${item.text}"`;
      text.ondblclick = () => {
        text.setAttribute("ContentEditable", "True");
        text.innerText = item.text;
      };
      text.onblur = () => {
        allCosts[index].text = text.innerText;
        render();
      };
      textName.appendChild(text);

      const text2 = document.createElement("p");
      text2.className = "date-text";
      text2.innerText = `${item.text2}`;
      text2.ondblclick = () => {
        text2.setAttribute("ContentEditable", "True");
        text2.innerText = item.text2;
      };
      text2.onblur = () => {
        if (!Number(text2.innerText)) {
          text2.innerText = item.text2;
          return alert("Введите числовое значение");
        } else {
          allCosts[index].text2 = text2.innerText;
          render();
        }
      };

      const text3 = document.createElement("p");
      text3.className = "price-text";
      text3.innerText = `${item.text3}`;
      text3.ondblclick = () => {
        text3.setAttribute("ContentEditable", "True");
        text3.innerText = item.text3;
      };
      text3.onblur = () => {
        if (!Number(text3.innerText)) {
          text3.innerText = item.text3;
          return alert("Введите числовое значение");
        } else {
          allCosts[index].text3 = text3.innerText;
          render();
        }
      };

      const text4 = document.createElement("p");
      text4.className = "price-text2";
      text4.innerText = ` р.`;

      container.appendChild(textName);
      container.appendChild(text2);
      container.appendChild(text3);
      container.appendChild(text4);

      //Edit-icon
      const imgEdit = document.createElement("i");
      imgEdit.className = "far fa-edit svg-icon";
      imgEdit.onclick = () => {
        tempEdit = item.text;
        tempEditDate = item.text2;
        tempEdit2 = item.text3;
        onClickImgEdit(index);
      };
      container.appendChild(imgEdit);

      //Delete-icon
      const svgDelete = document.createElement("i");
      svgDelete.className = "far fa-trash-alt svg-icon";
      svgDelete.onclick = () => {
        onClickSvgDelete(index);
      };
      container.appendChild(svgDelete);
    }
    content.appendChild(container);
    //Sum
    totalCounter += Number(item.text3);
  });
  totalSum.innerText = `${totalCounter}`;
};
