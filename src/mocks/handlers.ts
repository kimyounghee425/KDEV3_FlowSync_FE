import { HttpResponse, http } from "msw";
import page1 from "@/src/data/projects_page_1.json";
import page2 from "@/src/data/projects_page_2.json";
import page3 from "@/src/data/projects_page_3.json";

const allPages = [page1, page2, page3];

export const handlers = [
  http.get("http://api.example.com/projects", ({ request }) => {
    console.log("Request received:", request.url);
    const url = new URL(request.url)

    // URL 쿼리 파라미터에서 currentPage와 pageSize를 추출
    const currentPage = parseInt(url.searchParams.get("currentPage") || "0", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "5", 10);

    // 요청에 해당하는 페이지 데이터 추출
    const response = allPages.find(
      (page) => page.meta.currentPage === currentPage && page.meta.pageSize === pageSize
    );

    // 데이터가 존재하지 않을 경우 기본 응답
    if (!response) {
      return HttpResponse.json(
        {
          data: [],
          meta: {
            currentPage,
            pageSize,
            totalPages: 0,
            totalElements: 0,
            isFirstPage: true,
            isLastPage: true,
          },
        },
        { status: 200 }
      );
    }

    // 요청된 데이터 반환
    return HttpResponse.json(response, { status: 200 });
  }),
];