"use client";

import { CategoryListResponseDataItem } from "@/types/generated/strapi.schemas";

import Datasets from "@/containers/datasets";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CategoriesItem = (category: CategoryListResponseDataItem) => {
  return (
    <AccordionItem key={category?.id} value={`${category?.id}`}>
      <AccordionTrigger>{category?.attributes?.name}</AccordionTrigger>
      <AccordionContent>
        {!!category?.id && <Datasets categoryId={category?.id} />}
      </AccordionContent>
    </AccordionItem>
  );
};

export default CategoriesItem;
