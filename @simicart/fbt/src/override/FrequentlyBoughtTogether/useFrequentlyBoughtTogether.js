import gql from 'graphql-tag'
import { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client'
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { CartTriggerFragment } from '@magento/peregrine/lib/talons/Header/cartTriggerFragments.gql';
import { MiniCartFragment } from '@magento/peregrine/lib/talons/MiniCart/miniCartFragments.gql';

export const GET_FBT_PRODUCTS = gql`
    query getfbtProduct($url_key: String!) {
        products(filter: {url_key: {eq: $url_key}}) {
          items {
            __typename
            id
            name
            sku
          fbt_products{
            name
            id
            url_key
            url_suffix
            }
          }
        }
      }
`;

export const ADD_SIMPLE_MUTATION = gql`
    mutation addSimpleProductToCart(
        $cartId: String!
        $quantity: Float!
        $sku: String!
    ) {
        addSimpleProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [{ data: { quantity: $quantity, sku: $sku } }]
            }
        ) @connection(key: "addSimpleProductsToCart") {
            cart {
                id
                # Update the cart trigger when adding an item.
                ...CartTriggerFragment
                # Update the mini cart when adding an item.
                ...MiniCartFragment
            }
        }
    }
    ${CartTriggerFragment}
    ${MiniCartFragment}
`;

export const ADD_CONFIGURABLE_MUTATION = gql`
    mutation addConfigurableProductToCart(
        $cartId: String!
        $quantity: Float!
        $sku: String!
        $parentSku: String!
    ) {
        addConfigurableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [
                    {
                        data: { quantity: $quantity, sku: $sku }
                        parent_sku: $parentSku
                    }
                ]
            }
        ) @connection(key: "addConfigurableProductsToCart") {
            cart {
                id
                # Update the cart trigger when adding an item.
                ...CartTriggerFragment
                # Update the mini cart when adding an item.
                ...MiniCartFragment
            }
        }
    }
    ${CartTriggerFragment}
    ${MiniCartFragment}
`;

const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct', 'ConfigurableProduct'];

export const useFrequentlyBoughtTogether = (props) => {
    const { url_key } = props ? props.url_key : null;

    const { error: fbtError,
        loading: fbtLoading,
        data: fbtData
    } = useQuery(GET_FBT_PRODUCTS, {
        variables: {
            url_key: "silver-sol-earrings"
        },
        fetchPolicy: 'no-cache'
    });

    let derivedErrorMessage;

    if (fbtError) {
        const errorTarget = fbtError;
        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            derivedErrorMessage = errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        } else {
            // A non-GraphQL error occurred.
            derivedErrorMessage = errorTarget.message;
        }
    }

    const [
        addSimpleProductsToCart,
        { error: errorAddingSimpleProduct, loading: isAddSimpleLoading }
    ] = useMutation(
        ADD_SIMPLE_MUTATION
    )

    const [
        addConfigurableProductsToCart,
        { error: errorAddingConfigurableProduct, loading: isAddingConfigurableLoading }
    ] = useMutation(
        ADD_CONFIGURABLE_MUTATION
    )

    // const handleAddToCart = useCallback(
    //     async formValues => {
    //         const { quantity } = formValues
    //         const payload = {
    //             item: product,
    //             productType,
    //             quantity
    //         };

    //         if (isSupportedProductType) {
    //             const variables = {
    //                 cartId,
    //                 product: payload.item,
    //                 quantity: payload.quantity,
    //                 sku: payload.item.sku
    //             };
    //             if (productType === 'SimpleProduct') {
    //                 try {
    //                     await addSimpleProductToCart({
    //                         variables
    //                     });
    //                 } catch {
    //                     return;
    //                 }
    //             }
    //         }
    //     },
    //     [
    //         [
    //             addSimpleProductToCart,
    //             cartId,
    //             isSupportedProductType,
    //             product,
    //             productType,
    //         ]
    //     ]
    // )


    return {
        addSimpleProductsToCart,
        addConfigurableProductsToCart,
        // handleAddToCart,
        fbtData,
        fbtLoading,
        derivedErrorMessage,
    }
}
