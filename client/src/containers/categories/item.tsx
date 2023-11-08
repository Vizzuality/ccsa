"use client";

import { LuChevronDown } from "react-icons/lu";

import { CategoryListResponseDataItem } from "@/types/generated/strapi.schemas";

import Datasets from "@/containers/datasets";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CategoriesItem = (category: CategoryListResponseDataItem) => {
  return (
    <AccordionItem key={category?.id} value={`${category?.id}`}>
      <AccordionTrigger className="group text-xl text-gray-900 transition-all hover:underline">
        <span className="mr-4 flex h-6 w-6 items-center justify-center rounded-sm bg-gray-100">
          <LuChevronDown className="h-5 w-5 shrink-0 text-foreground transition-transform duration-100 group-data-[state=open]:rotate-180" />
        </span>

        {category?.attributes?.name}
      </AccordionTrigger>
      <AccordionContent className="mt-5 pb-5">
        {!!category?.id && <Datasets categoryId={category?.id} />}
      </AccordionContent>
    </AccordionItem>
  );
};

export default CategoriesItem;
