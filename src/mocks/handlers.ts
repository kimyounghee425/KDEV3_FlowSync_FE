import { HttpResponse, http } from "msw";
import projectsData from "@/src/data/projects_mock_data.json";
import membersData from "@/src/data/members_mock_data.json";

import task100 from "@/src/data/100.json";
import task101 from "@/src/data/101.json";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
interface LoginRequest {
  email: string;
  password: string;
}

// JSON 파일 매핑
const taskDataMap: Record<string, any> = {
  "100": task100,
  "101": task101,
};

export const handlers = [

  // 프로젝트 목록 조회
  // 특정 TaskId 에 맞는 JSON 데이터 반환
  http.get(`${apiBaseUrl}/posts/:taskId`, ({ params }) => {
    const { taskId } = params;

    // taskId 에 해당하는 데이터 찾기
    const taskData = taskDataMap[taskId as string];

    if (!taskData) {
      return HttpResponse.json(
        { error: `Task ${taskId} not found.` },
        { status: 404 }
      );
    }

    // 성공적으로 JSON 데이터 반환
    return HttpResponse.json(taskData, { status: 200 });
  }),

  // 프로젝트 목록 조회
  http.get(`${apiBaseUrl}/projects`, ({ request }) => {
    const url = new URL(request.url);

    // 쿼리 파라미터 추출
    const query = url.searchParams.get("query") || "";
    const filter = url.searchParams.get("filter") || "전체";
    const currentPage = parseInt(url.searchParams.get("currentPage") || "0", 10);

    const pageSize = parseInt(url.searchParams.get("pageSize") || "5", 10);

    const allData = projectsData.data;

    // 필터 로직
    const filteredData = allData.filter(item => {
      const matchesQuery = query === "" || query === null || item.projectName.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "전체" || filter === null || item.projectStatus.toLowerCase().includes(filter.toLowerCase());

      return matchesQuery && matchesFilter;
    });

    // 페이지네이션 로직
    const start = currentPage * pageSize;
    const pagedData = filteredData.slice(start, start + pageSize);

    // 메타 정보
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

    return HttpResponse.json(response, { status: 200 });
  }),

  // 프로젝트 상태별 개수 집계
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

  // 프로젝트 진행단계별 글 건수 조회 핸들러
  http.get(`${apiBaseUrl}/projects/:projectId/progressCount`, ({params}) => {
    const { projectId } = params; // 연동 전이라 아직 안씀
    
    // 동적 파라미터 확인
    if (!projectId) {
      return HttpResponse.json({ error: "Project ID is required." }, { status: 400 });
    }

    // 동일한 데이터를 반환
    const response = [ // 진행단계별 글 건수
      { id: 1, title: "전체", count: 28 }, // 전체
      { id: 2, title: "요구사항정의", count: 6 }, // 요구사항정의
      { id: 3, title: "화면설계", count: 6 }, // 화면설계
      { id: 4, title: "디자인", count: 8 }, // 디자인
      { id: 5, title: "퍼블리싱", count: 6 }, // 퍼블리싱
      { id: 6, title: "개발", count: 6 }, // 개발
      { id: 7, title: "검수", count: 0 } // 검수
    ];

    return HttpResponse.json(response , { status: 200 });
  }),
  // 프로젝트 정보 조회 핸들러
  http.get(`${apiBaseUrl}/projects/:projectId/projectInfo`, ({ params }) => {
    const { projectId } = params;

    if (!projectId) {
      return HttpResponse.json({ error: "Project ID is required." }, { status: 400 });
    }

    // Mock 데이터 생성
    const response = {
      data: {
        projectTitle: "커넥티드 에듀", // 프로젝트명
        jobRole: "비엔시스템PM", // 직무
        profileImageUrl: "https://i.pravatar.cc/300?u=iu", // 프로필 이미지 URL
        name: "이태영", // 담당자 이름
        jobTitle: "본부장", // 직급
        phoneNum: "010-1234-5678", // 담당자 연락처
        projectStartAt: "2024년 9월 1일", // 프로젝트 시작일
        projectCloseAt: "2024년 12월 31일", // 프로젝트 종료일
      }
    };

    // 응답 반환
    return HttpResponse.json(response, { status: 200 });
  }),

  // 프로젝트별 글 목록 조회
  http.get(`${apiBaseUrl}/projects/:projectId/tasks`, ({ params }) => {
    const { projectId } = params;
  }),

  // 로그인 Handlers
  http.post(`${apiBaseUrl}/login`, async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequest;
    console.log("email: ", email, "password", password);
    // request.json() 반환값이 defaultBodyType으로 추론됨.
    // DefaultBodyType은 msw에서 기본적으로 사용되는 타입으로, 별도의 타입을 지정하지 않으면 any처럼 동작함
    // 명시적 타입 선언: request.json()의 결과를 as LoginRequest로 선언

    // 사용자 검증 (Mock Data)
    const user = membersData.data.find(
      (member) => member.email === email && member.pw === password
    );

    if (!user) {
      return HttpResponse.json(
        { error: "잘못된 이메일 또는 비밀번호입니다." },
        { status: 400 }
      ); // 400 Bad Request :: 클라이언트가 잘못된 요청 데이터를 보냈음
    }

    // 이메일 형식 검사 (정규식 이용)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return HttpResponse.json(
        { error: "유효한 이메일 주소를 입력하세요." },
        { status: 400 }
      ); // 400 Bad Request :: 클라이언트가 잘못된 요청 데이터를 보냈음
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
