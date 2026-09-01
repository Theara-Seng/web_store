async function getProducts() {

    const CACHE_KEY = "e2mProducts";
    const CACHE_TIME_KEY = "e2mProductsTime";

    const cacheDuration = 5 * 60 * 1000; // 5 minutes

    const cachedProducts =
        sessionStorage.getItem(CACHE_KEY);

    const cachedTime =
        sessionStorage.getItem(CACHE_TIME_KEY);

    if (
        cachedProducts &&
        cachedTime &&
        Date.now() - Number(cachedTime) < cacheDuration
    ) {
        return JSON.parse(cachedProducts);
    }

    try {

        const response =
            await fetch(CONFIG.API_URL);

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        const products =
            await response.json();

        sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify(products)
        );

        sessionStorage.setItem(
            CACHE_TIME_KEY,
            Date.now()
        );

        return products;

    } catch (error) {

        console.error(error);

        if (cachedProducts) {
            return JSON.parse(cachedProducts);
        }

        return [];
    }
}