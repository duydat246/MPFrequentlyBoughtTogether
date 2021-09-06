import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
export const FETCH_PRODUCT_DETAIL = gql`
    query($sku_product: [String]) {
        products(filter: { sku: { in: $sku_product } }) {
            items {
                sku
                id
                name
                price {
                    regularPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
                small_image {
                    url
                }
                url_key
                url_suffix
                fbt_products{
                    name
                    id
                    small_image {
                        url
                    }
                    price {
                        regularPrice {
                            amount {
                                currency
                                value
                            }
                        }
                    }
                }
            }
            total_count
            page_info {
                current_page
                page_size
                total_pages
            }
        }
    }
`;

export const useProductDetails = props => {
    const { sku_product } = props;
    const {
        error: detailsError,
        loading: detailsLoading,
        data: detailsData
    } = useQuery(FETCH_PRODUCT_DETAIL, {
        variables: {
            sku_product: "VA15-SI-NA"
        },
        fetchPolicy: 'no-cache'
    });
    let deriveErrorMessage;
    if (detailsError) {
        const errorTarget = detailsError;
        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            deriveErrorMessage = errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        } else {
            // A non-GraphQL error occurred.
            deriveErrorMessage = errorTarget.message;
        }
    }

    return {
        detailsData,
        detailsLoading,
        deriveErrorMessage
    };
};
