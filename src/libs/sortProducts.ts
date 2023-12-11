export type SortProduct =
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "created_at_asc"
  | "created_at_desc";

export function sortProducts(sort: SortProduct) {
  let orderBy = {};
  switch (sort) {
    case "price_asc":
      orderBy = {
        orderBy: {
          price: "asc",
        },
      };
      break;
    case "price_desc":
      orderBy = {
        orderBy: {
          price: "desc",
        },
      };
      break;
    case "name_asc":
      orderBy = {
        orderBy: {
          name: "asc",
        },
      };
      break;
    case "created_at_asc":
      orderBy = {
        orderBy: {
          createdAt: "asc",
        },
      };
      break;
    case "created_at_desc":
      orderBy = {
        orderBy: {
          createdAt: "desc",
        },
      };
      break;
    default:
      break;
  }

  return orderBy;
}
