import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import "../data/cart-class.js";
import { loadCart } from "../data/cart.js";

async function loadPage() {
    try {
        // throw 'error1';
        await loadProductsFetch();
        await new Promise((resolve, reject) => {
            // throw 'error 2'
            loadCart(() => {
                // reject();
                resolve();
            });
        });

        renderOrderSummary();
        renderPaymentSummary();
    } catch (error) {
        console.log("Unexpected error. Please try again later.");
    }
}

loadPage();

// Promise.all([
//     loadProductsFetch(),
//     new Promise((resolve) => {
//         loadCart(() => {
//             resolve();
//         });
//     }),
// ]).then((values) => {
//     console.log(values);

//     renderOrderSummary();
//     renderPaymentSummary();
// });

// new Promise((resolve) => {
//     loadProducts(() => {
//         resolve();
//     });
// })
//     .then(() => {
//         return new Promise((resolve) => {
//             loadCart(() => {
//                 resolve();
//             });
//         });
//     })
//     .then(() => {
//         renderOrderSummary();
//         renderPaymentSummary();
//     });
