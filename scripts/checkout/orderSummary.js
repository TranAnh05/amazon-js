import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOption.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
    let cartSummaryHTML = "";

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        const matchingItem = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
        const dateString = deliveryDate.format("dddd, MMMM D");

        cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingItem.id} js-cart-item-container">
                <div class="delivery-date">Delivery date: ${dateString}</div>

                <div class="cart-item-details-grid">
                    <img class="product-image" src="${matchingItem.image}" />

                    <div class="cart-item-details">
                        <div class="product-name">${matchingItem.name}</div>
                        <div class="product-price">$${formatCurrency(matchingItem.priceCents)}</div>
                        <div class="product-quantity js-product-quantity-${matchingItem.id}">
                            <span> Quantity: <span class="quantity-label">${cartItem.quantity}</span> </span>
                            <span class="update-quantity-link link-primary"> Update </span>
                            <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${
                                matchingItem.id
                            }" data-product-id="${matchingItem.id}"> Delete </span>
                        </div>
                    </div>

                    <div class="delivery-options">
                        <div class="delivery-options-title">Choose a delivery option:</div>
                        ${deliveryOptionsHTML(matchingItem, cartItem)}   
                    </div>
                </div>
            </div>
        `;
    });

    function deliveryOptionsHTML(matchingItem, cartItem) {
        let html = "";

        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
            const dateString = deliveryDate.format("dddd, MMMM D");

            const priceString =
                deliveryOption.priceCents === 0 ? "FREE" : `$${formatCurrency(deliveryOption.priceCents)} - `;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += `
                    <div class="delivery-option js-delivery-option"
                        data-product-id="${matchingItem.id}"
                        data-delivery-option-id="${deliveryOption.id}"
                    >
                        <input
                            type="radio"
                            ${isChecked ? "checked" : ""}
                            class="delivery-option-input"
                            name="delivery-option-${matchingItem.id}"
                        />
                        <div>
                            <div class="delivery-option-date">${dateString}</div>
                            <div class="delivery-option-price">${priceString} Shipping</div>
                        </div>
                    </div>
                    `;
        });

        return html;
    }

    document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

    document.querySelectorAll(".js-delete-link").forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);

            const deletedContainer = document.querySelector(`.js-cart-item-container-${productId}`);
            deletedContainer.remove();
            renderPaymentSummary();
        });
    });

    document.querySelectorAll(".js-delivery-option").forEach((element) => {
        element.addEventListener("click", () => {
            const { productId, deliveryOptionId } = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
}

/**
 * MVC stands for Model view controller: means split our code into 3 parts
 * 1. model = save and manages the data
 * 2. view = take the data and display it on the page
 * 3. controller = runs some code when we interact with the page
 *
 */
