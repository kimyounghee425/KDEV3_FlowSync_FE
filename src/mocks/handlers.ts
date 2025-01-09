import { HttpResponse, http } from "msw";
import projectsData from "@/src/data/projects_mock_data.json";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const handlers = [
  http.get(`${apiBaseUrl}/projects`, ({ request }) => {
    const url = new URL(request.url);

    // Extract query parameters
    const query = url.searchParams.get("query") || "";
    const filter = url.searchParams.get("filter") || "all";
    const currentPage = parseInt(url.searchParams.get("currentPage") || "0", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "5", 10);

    // All data
    const allData = projectsData.data;

    // Filter logic
    const filteredData = allData.filter(item => {
      const matchesQuery = query === "" || query === null || item.projectName.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "all" || filter === null || item.projectStatus.toLowerCase().includes(filter.toLowerCase());
      return matchesQuery && matchesFilter;
    });

    // Pagination logic
    const start = currentPage * pageSize;
    const pagedData = filteredData.slice(start, start + pageSize);

    // Meta information
    const totalElements = filteredData.length;
    const totalPages = Math.ceil(totalElements / pageSize);

    const response = {
      data: pagedData,
      meta: {
        currentPage,
        pageSize,
        totalPages,
        totalElements,
        isFirstPage: currentPage === 0,
        isLastPage: currentPage === totalPages - 1,
      },
    };

    // Return the response
    return HttpResponse.json(response, { status: 200 });
  }),
  http.get(`${apiBaseUrl}/projects/status-summary`, () => {
    // 모든 데이터 가져오기
    const allData = projectsData.data;

    // 상태별 개수 집계
    const statusSummary = allData.reduce((summary, project) => {
      const status = project.projectStatus;
      summary[status] = (summary[status] || 0) + 1;
      return summary;
    }, {} as Record<string, number>);

    // 응답 데이터 생성
    const response = {
      statusSummary,
      total: allData.length,
    };

    // 응답 반환
    return HttpResponse.json(response, { status: 200 });
  }),
];
