import { siteData } from "../../content/site-data.mjs";
import { renderInsightArticle } from "./insight-article-shared.mjs";

export function insightsWorldWithinPage(data = siteData, language = "en") {
  return renderInsightArticle({ data, language, key: "insights.worldWithin", route: data.routes.insightsWorldWithin, pdf: "world-within-and-world-without.pdf", sections: ["within", "without", "harmony", "action", "bringing"], exercise: "exercise", metaTitle: "insights.worldWithin.metaTitle", metaDescription: "insights.worldWithin.metaDescription" });
}
