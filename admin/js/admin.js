// GLOBAL
var productList = [];
function domId(id) {
  return document.getElementById(id);
}
// ======================= Các Tab =========================
function addEventChangeTab() {
  var sidebar = document.getElementsByClassName("sidebar")[0];
  var list_a = sidebar.getElementsByTagName("a");
  for (var a of list_a) {
    if (!a.onclick) {
      a.addEventListener("click", function () {
        turnOff_Active();
        this.classList.add("active");
        var tab = this.childNodes[1].data.trim();
        openTab(tab);
      });
    }
  }
}

function turnOff_Active() {
  var sidebar = document.getElementsByClassName("sidebar")[0];
  var list_a = sidebar.getElementsByTagName("a");
  for (var a of list_a) {
    a.classList.remove("active");
  }
}

function openTab(nameTab) {
  // ẩn hết
  var main = document.getElementsByClassName("main")[0].children;
  for (var e of main) {
    e.style.display = "none";
  }

  // mở tab
  switch (nameTab) {
    case "Sản Phẩm":
      document.getElementsByClassName("sanpham")[0].style.display = "block";
      break;
  }
}

// ========================== Sản Phẩm ========================
// fetch api
async function fetchProductList() {
  productList = [];
  renderProduct();

  var promise = productServ.fetchProduct();

  try {
    var res = await promise;
    productList = mapProductList(res.data);
    console.log(res.data);
    renderProduct();
  } catch (err) {
    console.log(err);
  } finally {
  }
}
// map dữ liệu từ api
function mapProductList(local) {
  var result = [];

  for (var i = 0; i < local.length; i++) {
    var oldProduct = local[i];
    var newProduct = new Product(
      oldProduct.name,
      oldProduct.price,
      oldProduct.description,
      oldProduct.quantity,
      oldProduct.type,
      oldProduct.image,
      oldProduct.id
    );
    result.push(newProduct);
  }

  return result;
}
//render ra dữ liệu ra table
function renderProduct(data) {
  data = data || productList;

  var tc = document
    .getElementsByClassName("sanpham")[0]
    .getElementsByClassName("table-content")[0];
  var s = `<table class="table-outline hideImg">`;

  for (var i = 0; i < data.length; i++) {
    s += `<tr>
            <td style="width: 5%">${data[i].id}</td>
            <td style="width: 10%">${data[i].type}</td>
            <td style="width: 20%">
                <a title="Xem chi tiết" target="_blank" + p.name.split(' ').join('-') + ">${data[i].name}</a>
                <img src="${data[i].image}"></img>
            </td>
            <td style="width: 30%">${data[i].description}</td>
            <td style="width: 10%">${data[i].price}</td>
            <td style="width: 10%">${data[i].quantity}</td>
            <td style="width: 15%">
                <div class="tooltip">
                    <i class="fa fa-wrench" onclick="addKhungSuaSanPham('${data[i].id}')"></i>
                    <span class="tooltiptext">Sửa</span>
                </div>
                <div class="tooltip">
                    <i class="fa fa-trash" onclick="xoaSanPham('${data[i].id}', '+p.name+')"></i>
                    <span class="tooltiptext">Xóa</span>
                </div>
            </td>
        </tr>`;
  }

  s += `</table>`;

  tc.innerHTML = s;
}

// Thêm sản phẩm mới
let previewSrc; // biến toàn cục lưu file ảnh đang thêm
domId("btnSubmit").addEventListener('click', async function (e) {
  e.preventDefault();
  if (!checkValid()) return;

  var khung = document.getElementById("khungThemSanPham");
  var tr = khung.getElementsByTagName("tr");

  var masp = tr[1]
    .getElementsByTagName("td")[1]
    .getElementsByTagName("input")[0].value;
  var type = tr[2]
    .getElementsByTagName("td")[1]
    .getElementsByTagName("select")[0].value;
  var name = tr[3]
    .getElementsByTagName("td")[1]
    .getElementsByTagName("input")[0].value;
  var image = tr[4]
    .getElementsByTagName("td")[1]
    .getElementsByTagName("input")[0].value;
  var des = tr[5]
    .getElementsByTagName("td")[1]
    .getElementsByTagName("textarea")[0].value;
  var price = tr[6]
    .getElementsByTagName("td")[1]
    .getElementsByTagName("input")[0].value;
  var quantity = tr[7]
    .getElementsByTagName("td")[1]
    .getElementsByTagName("input")[0].value;

  if (isNaN(price)) {
    alert("Giá phải là số nguyên");
    return false;
  }
  if (type === "1") {
    type = "iphone";
  } else if (type === "2") {
    type = "samsung";
  }

  var prod = new Product(name, price, des, quantity, type, image, masp);

  var promise = productServ.createProduct(prod);
  try {
    var res = await promise;
    console.log("Res", res);
    await fetchProductList();
    document.getElementById("khungThemSanPham").style.transform = "scale(0)";
  } catch (err) {
    console.log(err);
  }
})


// Cập nhật ảnh sản phẩm
function capNhatAnhSanPham(files, id) {
  const reader = new FileReader();
  reader.addEventListener(
    "load",
    function () {
      // convert image file to base64 string
      previewSrc = reader.result;
      document.getElementById(id).src = previewSrc;
    },
    false
  );

  if (files[0]) {
    reader.readAsDataURL(files[0]);
  }
}

function required(val, config) {
  if (val.length > 0) {
    domId(config.errorId).innerHTML = "";
    return true;
  }
  domId(config.errorId).innerHTML = "Vui long nhap gia tri"; 

  return false;
}

function validRequiredForm(idFideld, idNotify) {
  var valueInput = domId(idFideld).value;

  var localCheck = required(valueInput, { errorId: idNotify });

  return localCheck;
}

//pattern
function pattern(val, config) {
  if (config.regexp.test(val)) {
    domId(config.errorId).innerHTML = "";
    return true;
  } else {
    domId(config.errorId).innerHTML = config.main;
    return false;
  }
}

function requiredType() {
  var valueInput = domId("type");
  var notify = domId("notifyType");

  if (valueInput.selectedIndex === 0) {
    notify.innerHTML = "Vui lòng chọn kiểu";
    return false;
  } else {
    notify.innerHTML = "";
    return true;
  }
}

function checkValidID() {
  var idRegexp = /(^[0-9]{1,8}$)+/g;
  var validId =
    validRequiredForm("maspThem", "notifyId") &&
    pattern(domId("maspThem").value, {
      errorId: "notifyId",
      regexp: idRegexp,
      main: "id phai co từ 1 - 3 kí tự số",
    });
  return validId;
}

function checkFullName() {
  var nameRegexp = /([A-z]+)([0-9]*)+/g;
  var validName =
    validRequiredForm("name", "notifyName") &&
    pattern(domId("name").value, {
      errorId: "notifyName",
      regexp: nameRegexp,
      main: "Tên sản phẩm phải là chữ và có ít nhất 0 hoặc nhiều kí tự số",
    });
  return validName;
}

function checkPrice() {
  var priceRegexp = /(^[0-9])+/g;
  var validPrice =
  validRequiredForm("price", "notifyPrice") &&
  pattern(domId("price").value, {
    errorId: "notifyPrice",
    regexp: priceRegexp,
    main: "Giá sản phẩm phải là số dương",
  });
  return validPrice;
}
function checkDesc() {
  var descRegexp = /^[a-zA-Z0-9 ]*$/;
  var validDesc =
    validRequiredForm("desc", "notifyDescription") &&
    pattern(domId("desc").value, {
      errorId: "notifyDescription",
      regexp: descRegexp,
      main: "Mo ta chua ro rang",
    });
    return validDesc;
}
function checkImg() {
  var validImg = validRequiredForm("img", "notifyImg");
  return validImg;
}
function checkQuantity() {
  var quantityRegexp = /(^[0-9])+/g;
  var validQuantity =
    validRequiredForm("quantity", "notifyQuantity") &&
    pattern(domId("quantity").value, {
      errorId: "notifyQuantity",
      regexp: quantityRegexp,
      main: "Giá sản phẩm phải là số dương",
    });
  return validQuantity;
}
function checkValid() {
  var idRegexp = /(^[0-9]{1,8}$)+/g;
  var nameRegexp = /([A-z]+)([0-9]*)+/g;
  var priceRegexp = /(^[0-9])+/g;
  var quantityRegexp = /(^[0-9])+/g;
  var descRegexp = /^[a-zA-Z0-9 ]*$/;

  var validId =
    validRequiredForm("maspThem", "notifyId") &&
    pattern(domId("maspThem").value, {
      errorId: "notifyId",
      regexp: idRegexp,
      main: "id phai co từ 1 - 3 kí tự số",
    });

  var validName =
    validRequiredForm("name", "notifyName") &&
    pattern(domId("name").value, {
      errorId: "notifyName",
      regexp: nameRegexp,
      main: "Tên sản phẩm phải là chữ và có ít nhất 0 hoặc nhiều kí tự số",
    });

  var validPrice =
    validRequiredForm("price", "notifyPrice") &&
    pattern(domId("price").value, {
      errorId: "notifyPrice",
      regexp: priceRegexp,
      main: "Giá sản phẩm phải là số dương",
    });
  var validQuantity =
    validRequiredForm("quantity", "notifyQuantity") &&
    pattern(domId("quantity").value, {
      errorId: "notifyQuantity",
      regexp: quantityRegexp,
      main: "Số lượng phải là số dương",
    });

  var validImg = validRequiredForm("img", "notifyImg");

  var validDesc =
    validRequiredForm("desc", "notifyDescription") &&
    pattern(domId("desc").value, {
      errorId: "notifyDescription",
      regexp: descRegexp,
      main: "Mo ta chua ro rang",
    });

  var validType = requiredType();

  var valid =
    validId && validName && validPrice && validImg && validDesc && validType && validQuantity;
  // var valid = validId && validName;
  return valid;
}

window.onload = async function () {
  await fetchProductList();
  
  console.log("productList", productList);
};


domId('btnClose').addEventListener('click', function(){
  domId('khungThemSanPham').style.transform = "scale(0)";
  domId('form').reset();
  var arrError = document.getElementsByClassName("sp-error");
  for (let i = 0; i < arrError.length; i++) {
    arrError[i].innerHTML="";
    
  }
})