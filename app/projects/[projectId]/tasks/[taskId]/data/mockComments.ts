type Comment = {
  id: number;
  author: string;
  content: string;
  createdDate: string;
};

export const mockComments = {
  data: [
    {
      taskId: 1,
      comments: [
        {
          id: 1,
          author: "이민석교수님",
          content: "A+",
          createdDate: "2025-01-06",
        },
        {
          id: 2,
          author: "스티브잡스",
          content: "애플에서 일하고 싶나요?",
          createdDate: "2025-01-07",
        },
      ],
    },
    {
      taskId: 2,
      comments: [
        {
          id: 1,
          author: "윤석열",
          content: "계엄령 내릴까요?",
          createdDate: "2025-01-05",
        },
        {
          id: 2,
          author: "이인제디렉터",
          content: "집가세요",
          createdDate: "2025-01-06",
        },
      ],
    },
  ],
};
