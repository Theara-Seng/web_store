let cart =
    JSON.parse(
        localStorage.getItem("e2mCart")
    ) || [];


function displayCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <p>
                    Your cart is empty.
                </p>

                <a href="index.html">
                    Continue Shopping
                </a>

            </div>

        `;


        document.getElementById(
            "checkoutButton"
        ).style.display = "none";


        updateTotal();

        return;
    }


    cart.forEach((item, index) => {

        const element =
            document.createElement("div");


        element.className =
            "cart-item";


        element.innerHTML = `

            <img
                src="${
                    item.image ||
                    "https://placehold.co/150x150?text=No+Image"
                }"
                loading="lazy"
            >


            <div class="cart-product">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    $${Number(
                        item.price
                    ).toFixed(2)}
                </p>

            </div>


            <div class="cart-quantity">

                <button
                    onclick="changeCartQuantity(${index}, -1)"
                >
                    −
                </button>

                <input
                    type="number"
                    min="1"
                    value="${item.quantity}"
                    onchange="setCartQuantity(${index}, this.value)"
                >

                <button
                    onclick="changeCartQuantity(${index}, 1)"
                >
                    +
                </button>

            </div>


            <div class="cart-subtotal">

                $${(
                    item.price *
                    item.quantity
                ).toFixed(2)}

            </div>


            <button
                class="remove-button"
                onclick="removeItem(${index})"
                aria-label="Remove item"
            >
                <img src="images/trash-can.png" alt="Delete">
            </button>

        `;


        container.appendChild(
            element
        );

    });


    updateTotal();
}

function setCartQuantity(index, value) {

    let quantity = Number(value);

    if (!quantity || quantity < 1) {
        quantity = 1;
    }

    cart[index].quantity = Math.floor(quantity);

    saveCart();
}

function changeCartQuantity(index, change) {

    cart[index].quantity += change;


    if (cart[index].quantity < 1) {

        cart[index].quantity = 1;
    }


    saveCart();
}

function updateCartCount() {

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = count;
    }
}

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();
}


function saveCart() {

    localStorage.setItem(
        "e2mCart",
        JSON.stringify(cart)
    );

    displayCart();
    updateCartCount();
}


function updateTotal() {

    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                (
                    Number(item.price) *
                    item.quantity
                ),
            0
        );


    document.getElementById(
        "cartTotal"
    ).textContent =
        `$${total.toFixed(2)}`;
}


function checkout() {

    if (cart.length === 0) {
        return;
    }


    let message =
`Hello ${CONFIG.STORE_NAME},

I would like to place an order:

`;


    let total = 0;


    cart.forEach((item, index) => {

        const subtotal =
            Number(item.price)
            * item.quantity;


        total += subtotal;


        message +=
`${index + 1}. ${item.name}
Product ID: ${item.id}
Quantity: ${item.quantity}
$${Number(item.price).toFixed(2)} × ${item.quantity} = $${subtotal.toFixed(2)}

`;

    });


    message +=
`Total: $${total.toFixed(2)}`;


    const telegramURL =
        `https://t.me/${CONFIG.TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;


    window.open(
        telegramURL,
        "_blank"
    );
}


displayCart();
updateCartCount();