let allCosts = [];
let valueInput = "";
let valueInput2 = "";
let indexEdit = null;
let tempEdit = "";
let tempEdit2 = "";
let d = new Date().toISOString().slice(0, 10);
let tempEditDate = d;
let tempEditDateNew = "";
let indexEdit2 = null;
let tempEditDateNew2 = "";

window.onload = async function init() {
  totalSum = document.getElementById("sum");
  input = document.getElementById("add-cost");
  input.addEventListener("change", updateValue1);
  input2 = document.getElementById("add-cost2");
  input2.addEventListener("change", updateValue2);
  //BUTTON 'Enter'
  input.addEventListener("keyup", updateValue3);
  input2.addEventListener("keyup", updateValue4);
  const resp = await fetch("http://localhost:8000/allCosts", {
    method: "GET",
  });
  let result = await resp.json();
  allCosts = result.data;
  render();
};

const onclickButton = async () => {
  let a = valueInput.trim();
  let b = valueInput2.trim();
  if (a === "") return alert(" Введите текст");
  if (b === "") return alert(" Введите число");
  if (String(b).length > 8) return alert("Много цифр");
  const resp = await fetch("http://localhost:8000/createCost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow_origin": "*",
    },
    body: JSON.stringify({
      shop: a,
      isDate: tempEditDate,
      price: b,
    }),
  });
  let result = await resp.json();
  allCosts.push(result.data);

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

//NewValue
updateValueNew = (e) => {
  tempEdit = e.target.value;
};

updateValueNewDate = (e) => {
  tempEditDateNew = e.target.value;
};

updateValueNew2 = (e) => {
  tempEdit2 = e.target.value;
};

onClickImgEdit = (index) => {
  indexEdit = index;
  render();
};

onClickSvgDelete = async (index) => {
  const resp = await fetch(
    `http://localhost:8000/deleteCost?_id=${allCosts[index]._id}`,
    {
      method: "DELETE",
    }
  );
  let result = await resp.json();
  allCosts = result.data;
  render();
};

onClickImgDone = async (index) => {
  let a2 = tempEdit.trim();
  let b2 = tempEdit2.trim();
  if (a2 === "") return alert("Введите текст");
  if (!Number(b2)) return alert("Введите числовое значение");
  if (String(b2).length > 8) return alert("Много цифр");

  const { _id } = allCosts[indexEdit];
  const resp = await fetch("http://localhost:8000/updateCost", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow_origin": "*",
    },
    body: JSON.stringify({
      _id,
      shop: a2,
      isDate: tempEditDateNew,
      price: b2,
    }),
  });
  let result = await resp.json();
  allCosts = result.data;
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
      container.appendChild(dateInput);

      const editInput2 = document.createElement("input");
      editInput2.type = "number";
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

      const textShop = document.createElement("p");
      textShop.className = "shop-text";
      textShop.innerText = `"${item.shop}"`;
      textShop.ondblclick = () => {
        textShop.setAttribute("ContentEditable", "True");
        textShop.innerText = item.shop;
      };
      textShop.onblur = async () => {
        let textVal = textShop.innerText;
        let a = textVal.trim();
        if (a === "") return alert(" Введите текст");
        allCosts[index].shop = a;
        const resp = await fetch("http://localhost:8000/updateCost", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Access-Control-Allow_origin": "*",
          },
          body: JSON.stringify(allCosts[index]),
        });
        let result = await resp.json();
        allCosts = result.data;
        render();
      };
      textName.appendChild(textShop);
      container.appendChild(textName);

      //Date
      if (indexEdit2 === index) {
        const dateInput2 = document.createElement("input");
        dateInput2.addEventListener("change", updateValueNewClick);
        dateInput2.className = "edit-text-click";
        dateInput2.type = "date";
        dateInput2.onchange = (event) => updateValueNewClick(event);
        dateInput2.onblur = async () => {
          allCosts[index].isDate = tempEditDateNew2;
          const resp = await fetch("http://localhost:8000/updateCost", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              "Access-Control-Allow_origin": "*",
            },
            body: JSON.stringify(allCosts[index]),
          });
          let result = await resp.json();
          allCosts = result.data;
          indexEdit2 = null;
          render();
        };
        container.appendChild(dateInput2);
      } else {
        const textDate = document.createElement("p");
        textDate.className = "date-text";
        textDate.innerText = `${item.isDate}`;
        textDate.ondblclick = () => {
          tempEditDateNew2 = item.isDate;
          onClickEdit2(index);
          render();
        };
        container.appendChild(textDate);
      }

      const textPrice = document.createElement("p");
      textPrice.className = "price-text";
      textPrice.innerText = `${item.price}`;
      textPrice.ondblclick = () => {
        textPrice.setAttribute("ContentEditable", "True");
        textPrice.innerText = item.price;
      };
      textPrice.onblur = async () => {
        let num = textPrice.innerText;
        let textNum = num.trim();
        if (String(textNum).length > 8) return alert("Много цифр");
        if (!Number(textNum)) {
          textPrice.innerText = item.price;
          return alert("Введите числовое значение");
        } else {
          allCosts[index].price = textNum;
          const resp = await fetch("http://localhost:8000/updateCost", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              "Access-Control-Allow_origin": "*",
            },
            body: JSON.stringify(allCosts[index]),
          });
          let result = await resp.json();
          allCosts = result.data;
          render();
        }
      };
      container.appendChild(textPrice);

      const text = document.createElement("p");
      text.className = "price-text2";
      text.innerText = ` р.`;
      container.appendChild(text);

      //Edit-icon
      const imgEdit = document.createElement("i");
      imgEdit.className = "far fa-edit svg-icon";
      imgEdit.onclick = () => {
        tempEdit = item.shop;
        tempEditDateNew = item.isDate;
        tempEdit2 = item.price;
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
    totalCounter += Number(item.price);
  });
  totalSum.innerText = `${totalCounter}`;
};

updateValueNewClick = (event) => {
  tempEditDateNew2 = event.target.value;
};

onClickEdit2 = (index) => {
  indexEdit2 = index;
  render();
};
