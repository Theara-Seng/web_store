let allProducts = [];


function showRandomProducts() {

    const availableProducts =
        allProducts.filter(product => product.stock > 0);

    const shuffled =
        [...availableProducts]
        .sort(() => Math.random() - 0.5);

    const randomProducts =
        shuffled.slice(0, 20);

    document.getElementById("productTitle")
        .textContent = "Featured Products";

    displayProducts(randomProducts);
}


function displayProducts(products) {

    const grid =
        document.getElementById("productGrid");

    grid.innerHTML = "";


    if (products.length === 0) {

        grid.innerHTML =
            "<p>No products found.</p>";

        return;
    }


    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";


        const image =
            product.image ||
            "https://placehold.co/400x400?text=No+Image";


        card.innerHTML = `

            <img
                src="${image}"
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

                        <button
                            class="card-minus"
                            type="button"
                        >
                            −
                        </button>

                        <input
                            class="card-quantity-input"
                            type="number"
                            min="1"
                            value="1"
                        >

                        <button
                            class="card-plus"
                            type="button"
                        >
                            +
                        </button>

                    </div>

                </div>

                <div class="card-buttons">

                    <button
                        class="card-add-cart"
                        type="button"
                    >
                        Add to Cart
                    </button>

                    <button
                        class="card-buy-now"
                        type="button"
                    >
                        Buy Now
                    </button>

                </div>

            </div>
        `;

        const quantityInput =
            card.querySelector(".card-quantity-input");

        const minusButton =
            card.querySelector(".card-minus");

        const plusButton =
            card.querySelector(".card-plus");

        const addCartButton =
            card.querySelector(".card-add-cart");

        const buyNowButton =
            card.querySelector(".card-buy-now");

        minusButton.addEventListener("click", function (event) {

            event.stopPropagation();

            let quantity = Number(quantityInput.value) || 1;

            quantity--;

            if (quantity < 1) {
                quantity = 1;
            }

            quantityInput.value = quantity;
        });


        plusButton.addEventListener("click", function (event) {

            event.stopPropagation();

            let quantity = Number(quantityInput.value) || 1;

            quantity++;

            quantityInput.value = quantity;
        });

        addCartButton.addEventListener("click", function (event) {

            event.stopPropagation();

            const quantity =
                Math.max(
                    1,
                    Math.floor(Number(quantityInput.value) || 1)
                );

            addProductToCart(product, quantity);
        });


        buyNowButton.addEventListener("click", function (event) {

            event.stopPropagation();

            const quantity =
                Math.max(
                    1,
                    Math.floor(Number(quantityInput.value) || 1)
                );

            const total =
                Number(product.price) * quantity;

            const message =
        `Hello ${CONFIG.STORE_NAME},

        I would like to order:

        Product: ${product.name}
        Product ID: ${product.id}
        Quantity: ${quantity}
        Price: $${Number(product.price).toFixed(2)}
        Total: $${total.toFixed(2)}`;

            const telegramURL =
                `https://t.me/${CONFIG.TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;

            window.open(
                telegramURL,
                "_blank"
            );
        });

        quantityInput.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        quantityInput.addEventListener("change", function () {

            let quantity = Number(this.value);

            if (!quantity || quantity < 1) {
                quantity = 1;
            }

            this.value = Math.floor(quantity);
        });

        card.addEventListener("click", () => {

            window.location.href =
                `product.html?id=${encodeURIComponent(product.id)}`;

        });


        grid.appendChild(card);

    });

}

function addProductToCart(product, quantity) {

    let cart =
        JSON.parse(
            localStorage.getItem("e2mCart")
        ) || [];

    const existing =
        cart.find(item =>
            String(item.id) === String(product.id)
        );

    if (existing) {

        existing.quantity += quantity;

    } else {

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

    showHomeToast(
        `${quantity} item${quantity > 1 ? "s" : ""} added to cart`
    );
}

function showHomeToast(message) {

    const toast =
        document.createElement("div");

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

    }, 1500);
}

function loadCategories() {

    const select =
        document.getElementById("categorySelect");


    const categories =
        [...new Set(
            allProducts.map(product => product.category)
        )]
        .filter(Boolean)
        .sort();


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        select.appendChild(option);

    });

}


document
.getElementById("categorySelect")
.addEventListener("change", function () {

    const category = this.value;


    if (!category) {

        showRandomProducts();

        return;
    }


    const filtered =
        allProducts.filter(product =>
            product.category === category
        );


    document.getElementById("productTitle")
        .textContent = category;


    displayProducts(filtered);

});


const searchInput =
    document.getElementById("searchInput");

const suggestionBox =
    document.getElementById("searchSuggestions");


function showHomeSuggestions() {

    const search =
        searchInput.value
        .trim()
        .toLowerCase();

    suggestionBox.innerHTML = "";

    if (!search) {
        suggestionBox.style.display = "none";
        return;
    }

    const results =
        allProducts.filter(product =>
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search)
        );


    results
        .slice(0, 6)
        .forEach(product => {

            const item =
                document.createElement("div");

            item.className = "suggestion-item";

            item.innerHTML = `
                <img
                    src="${product.image || "https://placehold.co/80x80?text=No+Image"}"
                    loading="lazy"
                >

                <div>
                    <strong>${product.name}</strong>
                    <div>$${Number(product.price).toFixed(2)}</div>
                </div>
            `;

            item.addEventListener("click", () => {

                window.location.href =
                    `product.html?id=${encodeURIComponent(product.id)}`;

            });

            suggestionBox.appendChild(item);

        });


    suggestionBox.style.display =
        results.length ? "block" : "none";
}

function runHomeSearch() {

    const search =
        searchInput.value
        .trim()
        .toLowerCase();

    if (!search) {
        showRandomProducts();
        suggestionBox.style.display = "none";
        return;
    }

    const results =
        allProducts.filter(product =>
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search)
        );

    document.getElementById("productTitle")
        .textContent =
        `Search Results for "${searchInput.value}"`;

    displayProducts(results);

    suggestionBox.style.display = "none";
}

searchInput.addEventListener(
    "input",
    showHomeSuggestions
);

searchInput.addEventListener(
    "focus",
    showHomeSuggestions
);

searchInput.addEventListener(
    "click",
    showHomeSuggestions
);

searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        runHomeSearch();
    }

});

const searchButton =
    document.getElementById("searchButton");

if (searchButton) {

    searchButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            runHomeSearch();
        }
    );
}

document.addEventListener("click", function (event) {

    const searchContainer =
        document.querySelector(".search-container");

    const suggestionBox =
        document.getElementById("searchSuggestions");

    if (!searchContainer.contains(event.target)) {
        suggestionBox.style.display = "none";
    }

});

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


    document.getElementById("cartCount")
        .textContent = count;

}


async function loadHome() {

    allProducts = await getProducts();

    loadCategories();

    updateCartCount();

    const params =
        new URLSearchParams(window.location.search);

    const search =
        params.get("search");

    if (search) {

        searchInput.value = search;

        const keyword =
            search.toLowerCase();

        const results =
            allProducts.filter(product =>
                product.name
                    .toLowerCase()
                    .includes(keyword)

                ||

                product.category
                    .toLowerCase()
                    .includes(keyword)
            );

        document.getElementById("productTitle")
            .textContent =
            `Search Results for "${search}"`;

        displayProducts(results);

    } else {

        showRandomProducts();
    }
}

loadHome();