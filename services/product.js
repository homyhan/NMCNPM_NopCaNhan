var productServ={
    fetchProduct: function () {
        return axios({
            url: "https://my-json-server.typicode.com/ThanhTad/TestApi/db",
            method: "GET"
        })
    },
    createProduct: function(product){
        return axios({
            url: "https://my-json-server.typicode.com/ThanhTad/TestApi/db",
            method: "POST",
            data: product,
        })
    },
}