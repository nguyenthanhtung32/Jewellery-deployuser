import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const useCartStore = create(
  devtools(
    persist(
      (set, get) => ({
        carts: {},

        addToCart: (
          customerId,
          productId,
          quantity,
          productName,
          imageUrl,
          price,
          discount,
          stock,
          code
        ) => {
          set((state) => {
            const customerCart = state.carts[customerId] || [];
            const existingProductIndex = customerCart.findIndex(
              (item) => item.productId === productId
            );

            const maxQuantity = Math.min(quantity, stock);

            const totalQuantity =
              existingProductIndex !== -1
                ? customerCart[existingProductIndex].quantity + maxQuantity
                : maxQuantity;

            if (totalQuantity > stock) {
              toast.warning("Thêm vào giỏ hàng thất bại!", 1.5);
              alert(
                `Bạn không thể thêm nhiều hơn ${stock} sản phẩm vào giỏ hàng.`
              );
            } else {
              if (existingProductIndex !== -1) {
                customerCart[existingProductIndex].quantity += maxQuantity;
              } else {
                customerCart.push({
                  productId,
                  quantity: maxQuantity,
                  productName,
                  imageUrl,
                  price,
                  discount,
                  stock,
                  code,
                });
              }
            }
            return {
              carts: {
                ...state.carts,
                [customerId]: customerCart,
              },
            };
          });
        },

        addToCartSize: (
          customerId,
          productId,
          quantity,
          productName,
          imageUrl,
          price,
          discount,
          stock,
          code,
          size
        ) => {
          set((state) => {
            const customerCart = state.carts[customerId] || [];
            const existingProductIndex = customerCart.findIndex(
              (item) => item.productId === productId && item.size === size
            );

            const maxQuantity = Math.min(quantity, stock);

            if (existingProductIndex !== -1) {
              customerCart[existingProductIndex].quantity += quantity;
            } else {
              customerCart.push({
                productId,
                quantity: maxQuantity,
                productName,
                imageUrl,
                price,
                discount,
                stock,
                code,
                size,
              });
            }
            return {
              carts: {
                ...state.carts,
                [customerId]: customerCart,
              },
            };
          });
        },

        getCartItems: (customerId) => {
          return get().carts[customerId] || [];
        },

        updateCartItemQuantity: (customerId, productId, quantity) => {
          set((state) => {
            const customerCart = state.carts[customerId] || [];
            const updatedCart = customerCart.map((item) => {
              if (item.productId === productId) {
                return {
                  ...item,
                  quantity: quantity,
                };
              }
              return item;
            });
            return {
              carts: {
                ...state.carts,
                [customerId]: updatedCart,
              },
            };
          });
        },

        removeFromCart: (customerId, productId) => {
          set((state) => {
            const customerCart = state.carts[customerId] || [];
            const updatedCart = customerCart.filter(
              (item) => item.productId !== productId
            );
            return {
              carts: {
                ...state.carts,
                [customerId]: updatedCart,
              },
            };
          });
        },

        removeAllCart: (customerId) => {
          set((state) => ({
            carts: {
              ...state.carts,
              [customerId]: [],
            },
          }));
        },
      }),
      {
        name: "cartStorage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export default useCartStore;
