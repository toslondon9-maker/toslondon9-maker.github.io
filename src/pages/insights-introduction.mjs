import { siteData } from "../../content/site-data.mjs";
import { renderInsightArticle } from "./insight-article-shared.mjs";

export function insightsIntroductionPage(data = siteData, language = "en") {
  return renderInsightArticle({ data, language, key: "insights.introduction", route: data.routes.insightsIntroduction, pdf: "charles-haanel-master-key-system-introduction.pdf", sections: ["mind", "action", "energy", "study"], exercise: "exercise", metaTitle: "insights.introduction.metaTitle", metaDescription: "insights.introduction.metaDescription" });
}
