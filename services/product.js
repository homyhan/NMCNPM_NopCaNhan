var productServ={
    fetchProduct: function () {
        return axios({
            // url: "https://my-json-server.typicode.com/ThanhTad/TestApi/products",
            url: "https://63e677b27eef5b223386ae8a.mockapi.io/phones",
            method: "GET"
        })
    },
    createProduct: function(product){
        return axios({
            url: "https://63e677b27eef5b223386ae8a.mockapi.io/phones",
            method: "POST",
            data: product,
        })
    },
}