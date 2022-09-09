let data = [];
let filterData = [];
let searchData = [];
const url = "https://hexschool.github.io/js-filter-data/data.json";
const showList = document.querySelector(".showList");

//取得資料
function getData() {
  axios.get(url).then(function (response) {
    // 取得並移除空白資料
    data = response.data.filter((item) => {
      return item["作物名稱"];
    });
    renderData(data);
  });
}
getData();

//渲染畫面
function renderData(showData) {
  let str = "";
  showData.forEach((item) => {
    str += `<tr>
        <td>${item.作物名稱}</td>
        <td>${item.市場名稱}</td>
        <td>${item.上價}</td>
        <td>${item.中價}</td>
        <td>${item.下價}</td>
        <td>${item.平均價}</td>
        <td>${item.交易量}</td>
        </tr>`;
  });

  showList.innerHTML = str;
}

//切換類型
const buttonGroup = document.querySelector(".button-group");
const buttonGroups = document.querySelectorAll(".button-group button");

buttonGroup.addEventListener("click", (e) => {
  if (e.target.nodeName == "BUTTON") {
    let type = e.target.getAttribute("data-type");
    changeType(type);
    //變更按鈕顏色
    clearColor(e.target);
    e.target.style.background = "#f8d45a";
    //清空search資料避免影響排序
    searchData = [];
    //選項跳回排序篩選
    selectOptions[0].style.display = "";
    selectOptions[0].selected = true;
  }
});

function changeType(type) {
  filterData = data.filter((item) => {
    return item.種類代碼 === type;
  });
  renderData(filterData);
}

//清除button顏色
function clearColor() {
  buttonGroups.forEach((item, i) => {
    buttonGroups[i].style.background = "";
  });
}

//搜尋
const search = document.querySelector(".search");

search.addEventListener("click", (e) => {
  if (e.target.nodeName == "BUTTON") {
    const crop = document.querySelector("#crop");
    if (crop.value.trim() === "") {
      getData();
      clearColor();
      //清空資料避免影響排序和搜尋
      filterData = [];
      searchData = [];
    }

    //依種類搜尋
    if (filterData.length === 0) {
      searchData = data.filter((item) => {
        return item.作物名稱.match(crop.value);
      });
    } else {
      searchData = filterData.filter((item) => {
        return item.作物名稱.match(crop.value);
      });
    }
    renderData(searchData);
  }
  //選項跳回排序篩選
  selectOptions[0].style.display = "";
  selectOptions[0].selected = true;
});

//排序資料
const select = document.querySelector("#js-select");

select.addEventListener("click", (e) => {
  switch (e.target.value) {
    case "依上價排序":
      selectChange("上價");
      break;
    case "依中價排序":
      selectChange("中價");
      break;
    case "依下價排序":
      selectChange("下價");
      break;
    case "依平均價排序":
      selectChange("平均價");
      break;
    case "依交易量排序":
      selectChange("交易量");
      break;
    default:
  }

  //依目前顯示資料排序

  function selectChange(value) {
    if (searchData.length !== 0) {
      searchData.sort((a, b) => {
        return a[value] - b[value];
      });
      renderData(searchData);
    } else if (filterData.length !== 0 && searchData.length === 0) {
      filterData.sort((a, b) => {
        return a[value] - b[value];
      });
      renderData(filterData);
    } else {
      data.sort((a, b) => {
        return a[value] - b[value];
      });
      renderData(data);
    }
  }
});

//進階排序資料
const sortAdvanced = document.querySelector(".js-sort-advanced");
const selectOptions = document.querySelectorAll("#js-select option");

sortAdvanced.addEventListener("click", (e) => {
  if (e.target.nodeName === "I") {
    let sortPrice = e.target.getAttribute("data-price");
    let sortCaret = e.target.getAttribute("data-sort");

    //由大到小排序
    let sortUp = (sortData) => {
      sortData.sort((a, b) => {
        return b[sortPrice] - a[sortPrice];
      });
      renderData(sortData);
    };
    //由小到大排序
    let sortDown = (sortData) => {
      sortData.sort((a, b) => {
        return a[sortPrice] - b[sortPrice];
      });
      renderData(sortData);
    };

    //依目前顯示資料排序
    if (searchData.length !== 0) {
      sortCaret === "up" ? sortUp(searchData) : sortDown(searchData);
    } else if (filterData.length !== 0 && searchData.length === 0) {
      sortCaret === "up" ? sortUp(filterData) : sortDown(filterData);
    } else {
      sortCaret === "up" ? sortUp(data) : sortDown(data);
    }

    //隱藏排序篩選並連動選項
    let selectConnect = (i) => {
      selectOptions[0].style.display = "none";
      selectOptions[i].selected = true;
    };

    switch (sortPrice) {
      case "上價":
        selectConnect(1);
        break;
      case "中價":
        selectConnect(2);
        break;
      case "下價":
        selectConnect(3);
        break;
      case "平均價":
        selectConnect(4);
        break;
      case "交易量":
        selectConnect(5);
        break;
      default:
    }
  }
});

