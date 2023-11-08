import Categories from "@/containers/categories";
import HomeHeader from "@/containers/home/header";

const Home = () => {
  return (
    <div className="h-full overflow-auto">
      <div className="space-y-5 px-5 py-10">
        <h1 className="font-metropolis text-3xl tracking-tight">Explore datasets</h1>

        <div className="space-y-5">
          <HomeHeader />
          <Categories />
        </div>
      </div>
    </div>
  );
};

export default Home;
