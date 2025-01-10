import { HttpResponse, http } from "msw";
import projectsData from "@/src/data/projects_mock_data.json";
import membersData from "@/src/data/members_mock_data.json";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
interface LoginRequest {
  email: string;
  password: string;
}

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

  // 로그인 Handlers
  http.post(`${apiBaseUrl}/login`, async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequest;
    console.log("email: ", email, "password", password);
    // request.json() 반환값이 defaultBodyType으로 추론됨.
    // DefaultBodyType은 msw에서 기본적으로 사용되는 타입으로, 별도의 타입을 지정하지 않으면 any처럼 동작함
    // 명시적 타입 선언: request.json()의 결과를 as LoginRequest로 선언

    // 사용자 검증 (Mock Data)
    const user = membersData.data.find(member => member.email === email && member.pw === password);

    if (!user) {
      return HttpResponse.json({ error: "잘못된 이메일 또는 비밀번호입니다." }, { status: 400 }); // 400 Bad Request :: 클라이언트가 잘못된 요청 데이터를 보냈음
    }

    // 이메일 형식 검사 (정규식 이용)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return HttpResponse.json({ error: "유효한 이메일 주소를 입력하세요." }, { status: 400 }); // 400 Bad Request :: 클라이언트가 잘못된 요청 데이터를 보냈음
    }

    // 로그인 성공 - 응답 데이터 생성
    const response = {
      message: "로그인 성공!",
      token: "accessToken", // Mock JWT 토큰
      user: {
        id: user.id,
        name: user.name,
      },
    };

    // 응답 반환
    return HttpResponse.json(response, { status: 200 });
  }),
];
