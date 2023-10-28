"use client";

import Categories from "@/containers/categories";

const Home = () => {
  return (
    <div className="h-full overflow-auto">
      <div className="px-5 py-10">
        <h1 className="font-metropolis text-3xl tracking-tight">Explore datasets</h1>

        <Categories />
      </div>
    </div>
  );
};

export default Home;
