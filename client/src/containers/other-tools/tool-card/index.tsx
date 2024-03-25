import { OtherTool } from "@/types/generated/strapi.schemas";

type ToolCardProps = {
  tool?: OtherTool;
};

const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <div className="flex items-center space-x-5 rounded-lg border border-gray-200 p-5">
      <a href={tool?.link} target="_blank" rel="noopener noreferrer">
        <div className="space-y-2">
          <div className="flex justify-between">
            <h2 className="font-metropolis font-semibold text-gray-800">{tool?.name}</h2>
            <div className="rounded-lg bg-gray-100 px-2 text-sm">
              {tool?.other_tools_category?.data?.attributes?.name}
            </div>
          </div>
          <p className="text-sm text-gray-600">{tool?.description}</p>
        </div>
      </a>
    </div>
  );
};

export default ToolCard;
