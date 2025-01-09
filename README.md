# FlowSync

### 세계 최강의 PMS 서비스

```
KDEV3_flowSync_FE
├─ app
│  ├─ (home)
│  │  ├─ favicon.ico
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ projects
│  │     └─ [projectId]
│  │        ├─ page.tsx
│  │        └─ tasks
│  │           ├─ new
│  │           │  └─ page.tsx
│  │           └─ [taskId]
│  │              ├─ edit
│  │              │  └─ page.tsx
│  │              └─ page.tsx
│  └─ login
│     ├─ favicon.ico
│     ├─ find-password
│     │  └─ page.tsx
│     ├─ layout.tsx
│     └─ page.tsx
├─ package.json
├─ src
│  ├─ api
│  │  ├─ auth.ts
│  │  ├─ axiosInstance.ts
│  │  └─ projects.ts
│  ├─ components
│  │  ├─ common
│  │  │  ├─ backButton.tsx
│  │  │  ├─ BasicTable.tsx
│  │  │  ├─ CommentBox.tsx
│  │  │  ├─ CustomBox.tsx
│  │  │  ├─ Loading.tsx
│  │  │  ├─ LoginInputForm.tsx
│  │  │  ├─ MSWComponent.tsx
│  │  │  ├─ Pagination.tsx
│  │  │  ├─ Profile.tsx
│  │  │  ├─ ProjectsStatusCard.tsx
│  │  │  ├─ ProjectsStatusCards.tsx
│  │  │  ├─ SearchSection.tsx
│  │  │  ├─ SelectBox.tsx
│  │  │  ├─ SidebarTab.tsx
│  │  │  ├─ TaskComments.tsx
│  │  │  ├─ TaskContents.tsx
│  │  │  └─ TaskForm.tsx
│  │  ├─ layouts
│  │  │  ├─ Drawer.tsx
│  │  │  ├─ Header.tsx
│  │  │  └─ Sidebar.tsx
│  │  ├─ pages
│  │  │  ├─ FindPasswordPage
│  │  │  │  └─ index.tsx
│  │  │  ├─ LoginPage
│  │  │  │  └─ index.tsx
│  │  │  ├─ LogoutPage
│  │  │  │  └─ index.tsx
│  │  │  ├─ ProjectApprovalPage
│  │  │  │  └─ index.tsx
│  │  │  ├─ ProjectApprovalsPage
│  │  │  │  └─ index.tsx
│  │  │  ├─ ProjectPage
│  │  │  │  └─ index.tsx
│  │  │  ├─ ProjectsPage
│  │  │  │  └─ index.tsx
│  │  │  ├─ ProjectTaskPage
│  │  │  │  └─ index.tsx
│  │  │  └─ ProjectTasksPage
│  │  │     └─ index.tsx
│  │  └─ ui
│  │     ├─ avatar.tsx
│  │     ├─ button.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ close-button.tsx
│  │     ├─ color-mode.tsx
│  │     ├─ dialog.tsx
│  │     ├─ drawer.tsx
│  │     ├─ field.tsx
│  │     ├─ input-group.tsx
│  │     ├─ link-button.tsx
│  │     ├─ native-select.tsx
│  │     ├─ pagination.tsx
│  │     ├─ popover.tsx
│  │     ├─ provider.tsx
│  │     ├─ radio.tsx
│  │     ├─ segmented-control.tsx
│  │     ├─ select.tsx
│  │     ├─ slider.tsx
│  │     └─ tooltip.tsx
│  ├─ context
│  │  ├─ PermissionsContext.tsx
│  │  ├─ ProjectsFilterContext.tsx
│  │  └─ SidebarContext.tsx
│  ├─ data
│  │  ├─ members_mock_data.json
│  │  ├─ new_task_data.ts
│  │  ├─ projects_mock_data.json
│  │  ├─ task_comments_data.ts
│  │  ├─ task_data.ts
│  │  ├─ users_mock_data.json
│  │  ├─ 목데이터이미지1.jpeg
│  │  └─ 목데이터이미지2.jpeg
│  ├─ mocks
│  │  ├─ browser.ts
│  │  ├─ handlers.ts
│  │  ├─ index.ts
│  │  └─ server.ts
│  ├─ types
│  │  ├─ api.ts
│  │  ├─ index.ts
│  │  ├─ loginActions.ts
│  │  ├─ loginForm.ts
│  │  ├─ pagination.ts
│  │  ├─ profile.ts
│  │  ├─ project.ts
│  │  └─ search.ts
│  └─ utils
│     ├─ getTranslatedStatus.ts
│     └─ styledReset.ts
```
