// 댓글의 답글
export interface Reply {
  id: number;
  author: string;
  content: string;
  regAt: string;
}

// 댓글
export interface Comment {
  id: number;
  author: string;
  content: string;
  regAt: string;
  replies: Reply[];
}

// 게시글의 콘텐츠 블럭
export interface ContentBlock {
  type: "text" | "image";
  data: string | { src: string }; // alt 속성 제거
}

// 게시글
export interface Task {
  title: string;
  author: string;
  boardCategory: string;
  regAt: string;
  editAt: string;
  content: ContentBlock[]; // ContentBlock 인터페이스 사용
  file: string[]; // 첨부파일
  parent?: {
    title: string;
  };
  commentList: Comment[];
}

export interface TaskCommentsProps {
    comments: Comment[];
  }