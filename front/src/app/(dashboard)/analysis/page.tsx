import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ExternalLink, BarChart3, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "数据分析 - 管理后台",
};

/**
 * 数据分析页面
 * 由于安全限制，请在新标签页中打开各数据平台
 */
export default function AnalysisPage() {
  const cards = [
    {
      title: "52LA 数据分析平台",
      description: "网站访问统计、用户行为分析",
      buttonText: "打开 52LA",
      link: "https://v6.51.la/report/daily?comId=3146340",
      icon: (
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      ),
    },
    {
      title: "DeepSeek API 统计",
      description: "API 使用量、费用统计",
      buttonText: "打开 DeepSeek",
      link: "https://platform.deepseek.com/usage",
      icon: <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />,
    },
  ];
  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">数据分析</h1>
        <p className="text-muted-foreground">访问以下数据平台查看统计信息</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-start">
        {cards.map((card) => (
          <Card key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
  icon: React.ReactNode;
}
const Card = ({ title, description, buttonText, icon, link }: CardProps) => {
  return (
    <div className="bg-muted p-8 rounded-lg text-center">
      {icon}
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Button asChild size="lg">
        <a href={link} target="_blank" rel="noopener noreferrer">
          {buttonText}
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
};
