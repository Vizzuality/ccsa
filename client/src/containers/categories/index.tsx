"use client";

import { useGetCategories } from "@/types/generated/category";

import CategoriesItem from "@/containers/categories/item";

import { Accordion } from "@/components/ui/accordion";

const Categories = () => {
  const { data: categoriesData } = useGetCategories({
    "pagination[pageSize]": 100,
    populate: "datasets",
    sort: "name:asc",
  });

  return (
    <Accordion
      type="multiple"
      className="space-y-5"
      defaultValue={categoriesData?.data?.map((c) => `${c?.id}`)}
    >
      {categoriesData?.data?.map((category) => {
        if (!category.id) return null;

        return <CategoriesItem key={category.id} {...category} />;
      })}
    </Accordion>
  );
};

export default Categories;
