"use client";

import { Label } from "@radix-ui/react-dropdown-menu";
import { useSearchParams } from "next/navigation";
import { Input } from "postcss";
import React from "react";
import { Pagination } from "swiper/modules";
import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import PaginationComponent from "~/components/pagination";
import ProductListMarketplace from "~/components/Product/ProductListMarketplace";
import ProductComboBox from "~/components/ProductCategoryComboBox";
import SearchInput from "~/components/search-component/search-input";
import SelectFilter from "~/components/search-component/select-filter";
import SelectComponent from "~/components/select";
import { api } from "~/trpc/react";
import { SearchParamType } from "~/types/global";

const selectProps: { key: string; value: string }[] = [
  { key: "All Categories", value: "all" },
  { key: "Bag and Luggage", value: "bag" },
  { key: "Phone", value: "phone" },
  { key: "PC/Laptop", value: "pc_laptop" },
  { key: "Clothing", value: "clothing" },
  { key: "Food&Drink", value: "foodanddrink" },
];

const sortProps: { key: string; value: string }[] = [
  { key: "High to low", value: "desc" },
  { key: "Low to high", value: "asc" },
];
const searchQuery: SearchParamType[] = [
  {
    ParamName: "product",
    ParamValue: "",
  },

  {
    ParamName: "category",
    ParamValue: "",
  },
  {
    ParamName: "sort",
    ParamValue: "",
  },
];

const ProductList = () => {
  const searchParams = useSearchParams();
  const items_per_page = 10;
  const currentPageNo = (searchParams.get("pageno") || 1) as number;
  const skipSize = (currentPageNo - 1) * items_per_page;
  const category = searchParams.get("category");
  const sortBy = searchParams.get("sort");
  const product = searchParams.get("product");
  const { data: productList, isLoading } = api.product.getProductList.useQuery({
    skip: skipSize,
    take: items_per_page,
    name: product || "",
    category: category || "",
    sortBy: !sortBy
      ? "asc"
      : sortBy === "asc" || sortBy === "desc"
        ? sortBy
        : "desc",
  });

  const totalPages =
    Math.floor((productList?.count || 0) / items_per_page) +
    ((productList?.count || 0) % items_per_page ? 1 : 0);

  return (
    <MaxWidthWrapper>
      <div className="flex w-full flex-col items-start justify-center">
        <div className="flex w-full sm:justify-start justify-center flex-col sm:flex-row gapy-y-2 gap-x-6">
          <div className="flex w-[200px] items-start gap-1 py-4">
            {/* <ProductComboBox checkBoxHandler={checkBoxHandler} /> */}
            <SelectFilter
              searchQuery={searchQuery}
              path="/pages/product/list"
              keyWord="category"
              selectProps={selectProps}
              label="Category"
              placeHolder="Select Category"
            />
          </div>
          <div className="flex w-[200px] items-start gap-1 py-4">
            {/* <ProductComboBox checkBoxHandler={checkBoxHandler} /> */}
            <SelectFilter
              searchQuery={searchQuery}
              path="/pages/product/list"
              keyWord="sort"
              selectProps={sortProps}
              label="Sort"
              placeHolder="Sort by price"
            />
          </div>
          <div className="flex items-center">
            {/* <input
            className="h-[40px] w-[200px] rounded-l-[5px] border-[1px]"
            placeholder="Search product"
          />
          <button className="h-[40px] items-center justify-center rounded-r-[5px] border-[1px] bg-blue-400 p-[10px]">
            <span>Search</span>
          </button> */}
            <SearchInput
              searchQuery={searchQuery}
              path="/pages/product/list"
              keyWord="product"
            />
          </div>
        </div>
        <ProductListMarketplace
          products={productList?.productList || []}
          isLoading={isLoading}
        />
        <div className="mt-20 flex w-full justify-center">
          <PaginationComponent
            searchQuery={searchQuery}
            path="/pages/product/list"
            keyWord="pageno"
            totalPages={totalPages}
          />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ProductList;
