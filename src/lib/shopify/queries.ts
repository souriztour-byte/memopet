/**
 * Storefront API GraphQL documents.
 * Reference: https://shopify.dev/docs/api/storefront
 *
 * Every operation that returns shopper-facing text takes `$language` and runs
 * `@inContext(language: $language)`, so translated titles, descriptions, options and policies come back in the
 * shopper's language (Shopify falls back to the store's default language when
 * a translation is missing). A cart created this way also opens Shopify's
 * checkout in that language.
 */

const IMAGE = /* GraphQL */ `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

const PRODUCT_CARD = /* GraphQL */ `
  fragment ProductCardFields on Product {
    id
    handle
    title
    availableForSale
    productType
    tags
    updatedAt
    featuredImage {
      ...ImageFields
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 2) {
      nodes {
        id
        availableForSale
      }
    }
  }
  ${IMAGE}
`;

const PRODUCT_DETAIL = /* GraphQL */ `
  fragment ProductDetailFields on Product {
    ...ProductCardFields
    vendor
    description
    descriptionHtml
    seo {
      title
      description
    }
    options {
      name
      optionValues {
        name
      }
    }
    images(first: 20) {
      nodes {
        ...ImageFields
      }
    }
    allVariants: variants(first: 100) {
      nodes {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          ...ImageFields
        }
      }
    }
  }
  ${PRODUCT_CARD}
`;

const COLLECTION = /* GraphQL */ `
  fragment CollectionFields on Collection {
    id
    handle
    title
    description
    seo {
      title
      description
    }
    image {
      ...ImageFields
    }
  }
`;

const CART = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          amountPerQuantity {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions {
              name
              value
            }
            image {
              ...ImageFields
            }
            product {
              handle
              title
              productType
              tags
              featuredImage {
                ...ImageFields
              }
            }
          }
        }
      }
    }
  }
  ${IMAGE}
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products(
    $first: Int!
    $query: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $language: LanguageCode
  ) @inContext(language: $language) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      nodes {
        ...ProductCardFields
      }
    }
  }
  ${PRODUCT_CARD}
`;

export const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!, $language: LanguageCode) @inContext(language: $language) {
    product(handle: $handle) {
      ...ProductDetailFields
    }
  }
  ${PRODUCT_DETAIL}
`;

export const PRODUCT_HANDLES_QUERY = /* GraphQL */ `
  query ProductHandles($first: Int!) {
    products(first: $first) {
      nodes {
        handle
        updatedAt
      }
    }
  }
`;

export const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections($first: Int!, $language: LanguageCode) @inContext(language: $language) {
    collections(first: $first, sortKey: TITLE) {
      nodes {
        ...CollectionFields
      }
    }
  }
  ${COLLECTION}
  ${IMAGE}
`;

export const COLLECTION_QUERY = /* GraphQL */ `
  query Collection($handle: String!, $language: LanguageCode) @inContext(language: $language) {
    collection(handle: $handle) {
      ...CollectionFields
    }
  }
  ${COLLECTION}
  ${IMAGE}
`;

export const COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  query CollectionProducts(
    $handle: String!
    $first: Int!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $language: LanguageCode
  ) @inContext(language: $language) {
    collection(handle: $handle) {
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        nodes {
          ...ProductCardFields
        }
      }
    }
  }
  ${PRODUCT_CARD}
`;

export const POLICIES_QUERY = /* GraphQL */ `
  query Policies($language: LanguageCode) @inContext(language: $language) {
    shop {
      privacyPolicy {
        title
        body
      }
      refundPolicy {
        title
        body
      }
      shippingPolicy {
        title
        body
      }
      termsOfService {
        title
        body
      }
    }
  }
`;

export const CART_QUERY = /* GraphQL */ `
  query Cart($cartId: ID!, $language: LanguageCode) @inContext(language: $language) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART}
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!], $language: LanguageCode)
  @inContext(language: $language) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
  ${CART}
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $language: LanguageCode)
  @inContext(language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
  ${CART}
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate(
    $cartId: ID!
    $lines: [CartLineUpdateInput!]!
    $language: LanguageCode
  ) @inContext(language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
  ${CART}
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $language: LanguageCode)
  @inContext(language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
  ${CART}
`;
