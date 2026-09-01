let searchProducts = [];

async function initGlobalSearch() {

    const input =
        document.getElementById("globalSearchInput");

    const suggestions =
        document.getElementById("globalSearchSuggestions");

    const searchButton =
        document.getElementById("globalSearchButton");

    if (!input || !suggestions) {
        return;
    }

    searchProducts = await getProducts();

    function showSuggestions() {

        const keyword =
            input.value
            .trim()
            .toLowerCase();

        suggestions.innerHTML = "";

        if (!keyword) {
            suggestions.style.display = "none";
            return;
        }

        const results =
            searchProducts.filter(product =>
                product.name.toLowerCase().includes(keyword) ||
                product.category.toLowerCase().includes(keyword)
            );

        results.slice(0, 6).forEach(product => {

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

            suggestions.appendChild(item);
        });

        suggestions.style.display =
            results.length ? "block" : "none";
    }

    input.addEventListener("input", showSuggestions);

    input.addEventListener("focus", showSuggestions);

    input.addEventListener("click", showSuggestions);

    input.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            const keyword = this.value.trim();

            if (!keyword) {
                return;
            }

            suggestions.style.display = "none";

            window.location.href =
                `index.html?search=${encodeURIComponent(keyword)}`;
        }

    });

    if (searchButton) {

        searchButton.addEventListener("click", function (event) {

            event.stopPropagation();

            const keyword =
                input.value.trim();

            if (!keyword) {
                return;
            }

            suggestions.style.display = "none";

            window.location.href =
                `index.html?search=${encodeURIComponent(keyword)}`;

        });

    }
    
document.addEventListener("click", function (event) {

    const searchContainer =
        document.querySelector(".header-search");

    if (!searchContainer) {
        return;
    }

    if (!searchContainer.contains(event.target)) {
        suggestions.style.display = "none";
    }

});

}

initGlobalSearch();