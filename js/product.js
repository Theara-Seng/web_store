let currentProduct = null;
let allProducts = [];

async function loadProduct() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get("id");


    allProducts =
        await getProducts();


    currentProduct =
        allProducts.find(product =>
            String(product.id) === String(id)
        );


    if (!currentProduct) {

        document.getElementById(
            "productDetails"
        ).innerHTML =
            "<h2>Product not found.</h2>";

        return;
    }

    displayProduct();
    showRelatedProducts(currentProduct);
    updateCartCount();
}

function displayProduct() {

    const image =
        currentProduct.image ||
        "https://placehold.co/600x600?text=No+Image";


    const specifications =
        currentProduct.specification
            ? currentProduct.specification
                .split("\n")
                .map(line =>
                    `<li>${line}</li>`
                )
                .join("")
            : "<li>No specifications available.</li>";


    document.getElementById(
        "productDetails"
    ).innerHTML = `

        <div class="product-image">

            <img
                src="${image}"
                alt="${currentProduct.name}"
            >

        </div>


        <div class="product-content">

            <p class="category">
                ${currentProduct.category}
            </p>

            <h1>
                ${currentProduct.name}
            </h1>

            <p class="price large-price">
                $${Number(
                    currentProduct.price
                ).toFixed(2)}
            </p>

            
            <div class="quantity-box">

                <span>
                    Quantity
                </span>

                <button onclick="changeQuantity(-1)">
                    −
                </button>

                <input
                    type="number"
                    id="quantity"
                    value="1"
                    min="1"
                >

                <button onclick="changeQuantity(1)">
                    +
                </button>

            </div>


            <div class="product-buttons">

                <button
                    class="add-cart"
                    onclick="addToCart()"
                >
                    Add to Cart
                </button>


                <button
                    class="buy-now"
                    onclick="buyNow()"
                >
                    Buy Now
                </button>

            </div>

        </div>

    `;

    // document.getElementById("description").innerHTML =
    //     currentProduct.description ||
    //     "No description available.";


    document.getElementById("specification").innerHTML =
    `
    <ul class="specifications">
    ${specifications}
    </ul>
    `;

    document.getElementById("datasheet").innerHTML =

        currentProduct.datasheet

        ?

        `
        <a href="${currentProduct.datasheet}"
        target="_blank">
        Open Datasheet
        </a>
        `

        :

        "No datasheet available.";



    document.getElementById("video").innerHTML =

        currentProduct.video

        ?

        `
        <a href="${currentProduct.video}"
        target="_blank">
        Watch Video
        </a>
        `

        :

        "No video available.";

}

function openTab(tabName) {


    document
        .querySelectorAll(".tab-content")
        .forEach(tab => {

            tab.classList.remove("active");

        });


    document
        .querySelectorAll(".tab-button")
        .forEach(button => {

            button.classList.remove("active");

        });



    document
        .getElementById(tabName)
        .classList.add("active");



    event.target.classList.add("active");

}

function showRelatedProducts(currentProduct) {

    console.log("Related function started");
    console.log("Current product:", currentProduct);
    console.log("All products:", allProducts);


    const container =
        document.getElementById("relatedProductsGrid");


    if (!container) {
        console.log("No related container found");
        return;
    }


    let otherProducts = allProducts.filter(
        p => String(p.id) !== String(currentProduct.id)
    );


    let sameCategory = otherProducts.filter(
        p => p.category === currentProduct.category
    );


    sameCategory.sort(
        () => Math.random() - 0.5
    );


    let related = sameCategory.slice(0, 3);


    if (related.length < 4) {

        let randomProducts = otherProducts
            .filter(
                p => !related.includes(p)
            )
            .sort(
                () => Math.random() - 0.5
            );


        related = related.concat(
            randomProducts.slice(
                0,
                4 - related.length
            )
        );
    }


    container.innerHTML = "";


related.forEach(product => {

    const card = document.createElement("div");

    card.className = "product-card";


    card.innerHTML = `

        <img
            src="${product.image || 'https://placehold.co/400x400?text=No+Image'}"
            alt="${product.name}"
            loading="lazy"
        >


        <div class="product-info">

            <p class="category">
                ${product.category}
            </p>


            <h3>
                ${product.name}
            </h3>


            <div class="card-price-quantity">


                <p class="price">
                    $${Number(product.price).toFixed(2)}
                </p>


                <div class="card-quantity">

                    <button class="minus">
                        −
                    </button>


                    <input
                    class="card-quantity-input"
                    id="related-qty-${product.id}"
                    value="1"
                    type="number"
                    min="1"
                    >


                    <button class="plus">
                        +
                    </button>

                </div>


            </div>



            <div class="card-buttons">


                <button class="card-add-cart">
                    Add to Cart
                </button>


                <button class="card-buy-now">
                    Buy Now
                </button>


            </div>


        </div>

    `;



    // click anywhere on card -> product page

    card.addEventListener(
        "click",
        function(e){

            if(
                e.target.closest("button") ||
                e.target.closest("input")
            ){
                return;
            }


            window.location.href =
            `product.html?id=${product.id}`;

        }
    );



    // stop buttons from opening product page

    card.querySelector(".card-buttons")
    .addEventListener(
        "click",
        function(e){
            e.stopPropagation();
        }
    );



    card.querySelector(".card-quantity")
    .addEventListener(
        "click",
        function(e){
            e.stopPropagation();
        }
    );



    const qtyInput =
        card.querySelector(".card-quantity-input");



    card.querySelector(".minus")
    .onclick = function(){

        let qty =
        Number(qtyInput.value);

        if(qty > 1){
            qty--;
        }

        qtyInput.value = qty;

    };



    card.querySelector(".plus")
    .onclick = function(){

        qtyInput.value =
        Number(qtyInput.value)+1;

    };


    container.appendChild(card);

    // Add to Cart button
    card.querySelector(".card-add-cart").addEventListener(
        "click",
        function(e){

            e.stopPropagation();

            addRelatedToCart(product.id);

        }
    );


    // Buy Now button
    card.querySelector(".card-buy-now").addEventListener(
        "click",
        function(e){

            e.stopPropagation();

            buyRelatedNow(product.id);

        }
    );

    // Quantity input
    card.querySelector(".card-quantity-input")
    .addEventListener(
        "click",
        function(e){

            e.stopPropagation();

        }
    );


});
}

function goToProduct(id){

    window.location.href =
        `product.html?id=${id}`;

}

function changeRelatedQuantity(id, change) {

    const input =
        document.getElementById(
            `related-qty-${id}`
        );


    let qty = Number(input.value) + change;


    if(qty < 1){
        qty = 1;
    }


    input.value = qty;

}



function addRelatedToCart(id){

    const product =
        allProducts.find(
            p => String(p.id) === String(id)
        );


    const quantity =
        Number(
            document.getElementById(
                `related-qty-${id}`
            ).value
        );


    let cart =
        JSON.parse(
            localStorage.getItem("e2mCart")
        ) || [];


    const existing =
        cart.find(
            item =>
            String(item.id) === String(id)
        );


    if(existing){

        existing.quantity += quantity;

    }
    else{

        cart.push({

            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            quantity: quantity

        });

    }


    localStorage.setItem(
        "e2mCart",
        JSON.stringify(cart)
    );


    updateCartCount();

    showToast("Product added to cart.");

}



function buyRelatedNow(id){

    const product =
        allProducts.find(
            p => String(p.id) === String(id)
        );


    const quantity =
        Number(
            document.getElementById(
                `related-qty-${id}`
            ).value
        );


    const total =
        Number(product.price) * quantity;


    const message = `Hello ${CONFIG.STORE_NAME},

I would like to order:

Product: ${product.name}
Product ID: ${product.id}
Quantity: ${quantity}
Price: $${Number(product.price).toFixed(2)}
Total: $${total.toFixed(2)}`;


    openTelegram(message);

}

function changeQuantity(change) {

    const input =
        document.getElementById("quantity");


    let quantity =
        Number(input.value) + change;


    if (quantity < 1) {
        quantity = 1;
    }


    if (
        currentProduct.stock > 0 &&
        quantity > currentProduct.stock
    ) {

        quantity = currentProduct.stock;
    }


    input.value = quantity;
}


function addToCart() {

    const quantity =
        Number(
            document.getElementById(
                "quantity"
            ).value
        );


    let cart =
        JSON.parse(
            localStorage.getItem("e2mCart")
        ) || [];


    const existing =
        cart.find(item =>
            String(item.id) ===
            String(currentProduct.id)
        );


    if (existing) {

        existing.quantity += quantity;

    } else {

        cart.push({

            id: currentProduct.id,

            name: currentProduct.name,

            price:
                Number(currentProduct.price),

            image:
                currentProduct.image,

            quantity: quantity

        });

    }


    localStorage.setItem(
        "e2mCart",
        JSON.stringify(cart)
    );


    updateCartCount();


    showToast("Product added to cart.");
}

function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast-message";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 1000);
}

function buyNow() {

    const quantity =
        Number(
            document.getElementById(
                "quantity"
            ).value
        );


    const total =
        Number(currentProduct.price)
        * quantity;


    const message = `Hello ${CONFIG.STORE_NAME},

I would like to order:

Product: ${currentProduct.name}
Product ID: ${currentProduct.id}
Quantity: ${quantity}
Price: $${Number(currentProduct.price).toFixed(2)}
Total: $${total.toFixed(2)}`;


    openTelegram(message);
}


function openTelegram(message) {

    const telegramURL =
        `https://t.me/${CONFIG.TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;


    window.open(
        telegramURL,
        "_blank"
    );
}


function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("e2mCart")
        ) || [];


    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    document.getElementById(
        "cartCount"
    ).textContent = count;
}


loadProduct();