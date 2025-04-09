
tg = window.Telegram.WebApp;
tg.expand();
tg.backgroundColor = '#eeeeee';
const user = tg.initDataUnsafe.user;
console.log('User');



link_back = 'https://kocherga.pythonanywhere.com'
if (user) {
    const userData = {
        user_id: user.id.toString(),
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || ''
    };

    fetch(`${link_back}/save_user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => console.log('User saved:', data))
        .catch(error => console.error('Error saving user', error));



    //document.getElementById('showProducts').addEventListener('click', function(){
    /*const userData = {
        user_id: '1234567890',
        username: 'kocherga',
        first_name: 'Ivan',
        last_name: 'Kocherga'
    };*/
    cancelOrderBtn = document.getElementById('cancel-order');

    placeOrderBtn = document.getElementById('place-order');
    //orderBtn = tg.MainButton;
    //orderBtn.text = 'Оформить';
    function show_products() {
        fetch(`${link_back}/products/`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                //data = JSON.parse(data);
                if (data.products) {
                    placeOrderBtn.classList.remove('hidden');

                    cancelOrderBtn.classList.add('hidden');
                    let productHtml = '';
                    console.log(data.products);
                    Object.keys(data.products).forEach(

                        product_category => {
                            console.log(product_category);
                            productHtml += '<h3>' + product_category + '</h3>';
                            data.products[product_category].forEach(product => {
                                productHtml += '<div class="img-conteiner ratio4"><img class="preview-img-portrait" src="https://kocherga.pythonanywhere.com/static/slavichoney_app/images/' + product.image + '"> </div>';
                                productHtml += '<p class="pS">' + product.product_name + '<br>';
                                productHtml += product.price + ' ₽ <br></p>';
                                //productHtml += 'Категория: ' + product.category + '<br></p>';
                                productHtml += '<div class="box"><div class="label pS">Описание</div><div class="content"><p class="pS">' + product.description + '</p></div></div><br>';


                                productHtml += '<ul><button onclick="update_basket(' + product.product_id + ', \'red\')" id="reduce_' + product.product_id +
                                    '" class="button btnS">-</button><p class="pS" id="product_' + product.product_id + '">0</p><button onclick="update_basket(' +
                                    product.product_id + ', \'inc\')" id="increase_' + product.product_id + '" class="button btnS">+</button></ul>';
                                //console.log(document.getElementById('product_' + product.product_id));
                            });
                        });
                    //productHtml += userData;
                    document.getElementById('products').innerHTML = productHtml;
                    const boxes = Array.from(document.querySelectorAll(".box")); 

                    boxes.forEach((box) => {
                        box.addEventListener("click", boxHandler);
                    });

                    function boxHandler(e) {
                        e.preventDefault(); 
                        let currentBox = e.target.closest(".box"); 
                        let currentContent = e.target.nextElementSibling; 
                        currentBox.classList.toggle("active"); 
                        if (currentBox.classList.contains("active")) {
                            
                            currentContent.style.maxHeight = currentContent.scrollHeight + "px"; 
                        } else {
                            
                            currentContent.style.maxHeight = 0;
                        }
                    }
                    fetch(`${link_back}/products/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.basket && data.basket.length > 0) {
                                data.basket.forEach(bItem => {
                                    console.log('product_' + bItem.product_id);
                                    document.getElementById('product_' + bItem.product_id).innerText = bItem.quantity;
                                })
                            }
                        })
                        .catch(error => console.error('Basket get error', error));
                }
                else {
                    alert('В базе нет продуктов');
                }
            })
            .catch(error => {
                console.error('Error', error);
                alert(error);
                alert('Ошибка при получении продуктов');
            });

    }


    //document.getElementsByTagName("button").forEach(elem => elem.addEventListener('click',  
    function update_basket(product_id, redOrInc) {
        fetch(`${link_back}/update_basket/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'user_id': userData.user_id,
                'product_id': product_id,
                'redOrInc': redOrInc,
                //'quantity': quantity
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data) {
                    console.log('product_' + data.product_id);
                    document.getElementById('product_' + data.product_id).innerText = data.quantity;
                }
            }
            )
            .catch(error => console.error('Basket update error', error));
    }

    placeOrderBtn.addEventListener('click', () => {
        //console.log('click');
        fetch(`${link_back}/place_order/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.order) {

                    placeOrderBtn.classList.add('hidden');
                    cancelOrderBtn.classList.remove('hidden');
                    cancelOrderBtn.addEventListener('click', () => { cancel_order(data.order[0].order_id) });
                    let orderHtml = '<p class="pS">Номер заказа:' + data.order[0].order_id + '</p><br>';
                    let sum_order = 0;
                    data.order.forEach(orderItem => {
                        if (orderItem.quantity > 0){
                        //productHtml += '<div class="img-conteiner ratio4"><img class="preview-img-portrait" src="http://127.0.0.1:8000/static/slavichoney_app/images/' + product.image + '"> </div>';
                        orderHtml += '<p class="pS">' + orderItem.product_name + '...';
                        orderHtml += orderItem.price + ' ₽ X ';
                        orderHtml += orderItem.quantity + ' шт <br>';
                        orderHtml += 'Сумма...' + orderItem.price * orderItem.quantity + '  ₽ </p><br>';
                        sum_order += orderItem.price * orderItem.quantity;
                        //console.log(document.getElementById('product_' + product.product_id));
                        }
                    });
                    orderHtml += '<h4>ИТОГО...' + sum_order + '  ₽ </h4>';
                    orderHtml += '<button onclick="confirm_order(' + data.order[0].order_id + ')" id="place-order" class="button btnS">Подтвердить заказ</button>'
                    //orderBtn.show();

                    document.getElementById('products').innerHTML = orderHtml;
                }
                else {
                    alert('В базе нет продуктов');
                }
            }
            )
            .catch(error => console.error('Place order error', error));
    })

    //tg.onEvent('mainButtonClicked', 
    function confirm_order(order_id) {
        console.log('confirm')
        fetch(`${link_back}/confirm_order/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'user': userData,
                'order_id': order_id
            })
        })
            .then(response => response.json())
            .then(data => {
                //console.log(data.message);
                //alert('Заказ подтвержден')
                tg.close();
            }
            )
            .catch(error => console.error('Place order error', error));
    }
    //)

    function cancel_order(order_id) {
        fetch(`${link_back}/cancel_order/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'user': userData,
                'order_id': order_id
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Заказ отменен');
                show_products();
                //tg.close();
            }
            )
            .catch(error => console.error('Cancel order error', error));
    }

    show_products();

    //))
    //});
    /*
    <div class="img-conteiner ratio1">
              <a href="#"><img class="preview-img-portrait" src="images/previewIdentityCorporateStationeryOrange.jpg"
                  alt="identityCorporateStationeryOrange"></a>
            </div>
            */
}