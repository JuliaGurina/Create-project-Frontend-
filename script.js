let allCosts = [];
let valueInput = "";
let valueInput2 = "";
let indexEdit = -1;
let tempEdit = "";
let tempEdit2 = "";
let d = new Date().toISOString().slice(0, 10);
let tempEditDate = d;
let tempEditDateNew = "";
let tempEditDateNew2 = null;

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
  {
    const resp = await fetch("http://localhost:8000/createCost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow_origin": "*",
      },
      body: JSON.stringify({
        text: valueInput,
        text2: tempEditDate,
        text3: valueInput2,
      }),
    });
    let result = await resp.json();
    allCosts.push(result.data);

    valueInput = "";
    input.value = "";
    valueInput2 = "";
    input2.value = "";
  }
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
      text: tempEdit,
      text2: tempEditDateNew,
      text3: tempEdit2,
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
      text.onblur = async () => {
        let textVal = text.innerText;
        let a = textVal.trim();
        if (a === "") return alert(" Введите текст");
        allCosts[index].text = text.innerText;

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
      textName.appendChild(text);
      container.appendChild(textName);

      //Date
      if (tempEditDateNew2 === index) {
        const dateInput2 = document.createElement("input");
        dateInput2.addEventListener("change", updateValueNewClick);
        dateInput2.className = "edit-text2";
        dateInput2.type = "date";
        dateInput2.value = tempEditDate;
        dateInput2.onblur = async () => {
          allCosts[index].text2 = tempEditDateNew2;
          tempEditDateNew2 = "";
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
        container.appendChild(dateInput2);
      } else {
        const text2 = document.createElement("p");
        text2.className = "date-text";
        text2.innerText = `${item.text2}`;
        text2.ondblclick = () => {
          tempEditDateNew2 = index;
          render();
        };
        container.appendChild(text2);
      }

      const text3 = document.createElement("p");
      text3.className = "price-text";
      text3.innerText = `${item.text3}`;
      text3.ondblclick = () => {
        text3.setAttribute("ContentEditable", "True");
        text3.innerText = item.text3;
      };
      text3.onblur = async () => {
        let num = text3.innerText;
        let textNum = num.trim();
        if (String(textNum).length > 8) return alert("Много цифр");
        if (!Number(textNum)) {
          text3.innerText = item.text3;
          return alert("Введите числовое значение");
        } else {
          allCosts[index].text3 = textNum;
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
      container.appendChild(text3);

      const text4 = document.createElement("p");
      text4.className = "price-text2";
      text4.innerText = ` р.`;
      container.appendChild(text4);

      //Edit-icon
      const imgEdit = document.createElement("i");
      imgEdit.className = "far fa-edit svg-icon";
      imgEdit.onclick = () => {
        tempEdit = item.text;
        tempEditDateNew = item.text2;
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

updateValueNewClick = (event) => {
  tempEditDateNew2 = event.target.value;
};
