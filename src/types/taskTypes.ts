export interface ApiResponse {
  code: number;
  result: string;
  message: string;
  data: Task;
}
// 게시글의 콘텐츠 블럭
export interface ContentBlock {
  type: "paragraph" | "image";
  data: string | { src: string };
}

export interface TaskBoardLink {
  id: number;
  name: string;
  url: string;
}

// 게시글
export interface Task {
  id: number;
  projectid: number;
  number: number;
  parent?: {
    title: string;
  } | null;
  title: string;
  author: string;
  boardCategory: string; // 아직 미사용
  boardStatus: string; // 아직 미사용
  regAt: string;
  editAt: string;
  content: ContentBlock[]; // ContentBlock 인터페이스 사용
  file: string[]; // 첨부파일
  taskBoardLinkList: TaskBoardLink[];
  commentList: Comment[];
}

export interface TaskCommentsProps {
  comments: Comment[];
}

// 댓글
export interface Comment {
  id: number;
  author: string;
  content: string;
  regAt: string;
  editAt: string;
  replies: Reply[];
}

// 댓글의 답글
export interface Reply {
  id: number;
  author: string;
  content: string;
  regAt: string;
  editAt: string;
  parentId: number;
  deletedYn: "Y" | "N";
}
