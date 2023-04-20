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

// LẤY DỮ LIỆU TỪ LOCALHOST
function getProductCartList() {
  var productListJson = localStorage.getItem("PL");
  if (!productListJson) return [];
  // console.log(JSON.parse(productListJson));
  return JSON.parse(productListJson);
}

function saveProductCartList() {
  var productListJson = JSON.stringify(cart);
  console.log(cart);
  localStorage.setItem("PL", productListJson);
}

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

// Thêm
let previewSrc; // biến toàn cục lưu file ảnh đang thêm
async function layThongTinSanPhamTuTable() {
  var khung = document.getElementById("khungThemSanPham");
  var tr = khung.getElementsByTagName("tr");

  var masp = tr[1]
    .getElementsByTagName("td")[1]
    .getElementsByTagName("input")[0].value;
  var type = tr[2]
    .getElementsByTagName("td")[1]
    .getElementsByTagName("input")[0].value;
  var name = tr[3]
    .getElementsByTagName("td")[1]
    .getElementsByTagName("input")[0].value;
  var image = tr[4]
    .getElementsByTagName("td")[1]
    .getElementsByTagName("input")[0].value;
  var des = tr[5]
    .getElementsByTagName("td")[1]
    .getElementsByTagName("input")[0].value;
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

  var prod = new Product(
    name,
    price,
    des,
    quantity,
    type,
    image,
    masp
  )

  var promise = productServ.createProduct(prod);  
  try {
    var res = await promise;
   console.log("Res", res);
   await fetchProductList();
   document.getElementById("khungThemSanPham").style.transform = "scale(0)";
  } catch (err) {
    console.log(err);
  }  
  
}

async function themSanPham() {
  var newSp = layThongTinSanPhamTuTable("khungThemSanPham");
  if (!newSp) return;

  for (var p of productList) {
    if (p.id == newSp.id) {
      alert("Mã sản phẩm bị trùng !!");
      return false;
    }

    if (p.name == newSp.name) {
      alert("Tên sản phẩm bị trùng !!");
      return false;
    }
  }
  // Them san pham vao list_product
  var promise = productServ.createProduct(newSp);

  console.log(newSp);
  try {
    var res = await promise;
    console.log("res", res);
    await fetchProductList();
    alert('Thêm sản phẩm "' + newSp.name + '" thành công.');
    document.getElementById("khungThemSanPham").style.transform = "scale(0)";
  } catch (error) {
    console.log(error);
  }
}

// Cập nhật ảnh sản phẩm
function capNhatAnhSanPham(files, id) {
    const reader = new FileReader();
    reader.addEventListener("load", function () {
        // convert image file to base64 string
        previewSrc = reader.result;
        document.getElementById(id).src = previewSrc;
    }, false);

    if (files[0]) {
        reader.readAsDataURL(files[0]);
    }
} 

window.onload = async function () {
  await fetchProductList();
  var productListFromLocal = getProductCartList();
  // cart = mapProductCartList(productListFromLocal);
  console.log("productList", productList);
};
