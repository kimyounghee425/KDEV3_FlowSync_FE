# FlowSync

### 세계 최강의 PMS 서비스

```
KDEV3_flowSync_FE
├─ app
│  ├─ (home)
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ projects
│  │     └─ [projectId]
│  │        ├─ tasks
│  │        │  ├─ new
│  │        │  │  ├─ edit.css
│  │        │  │  └─ page.tsx
│  │        │  ├─ page.tsx
│  │        │  └─ [taskId]
│  │        │     ├─ edit
│  │        │     │  ├─ edit.css
│  │        │     │  └─ page.tsx
│  │        │     └─ page.tsx
│  │        └─ workflow
│  │           └─ page.tsx
│  ├─ admin
│  │  ├─ layout.tsx
│  │  ├─ members
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  └─ page.tsx
│  │  ├─ organizations
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ favicon.ico
│  ├─ layout.tsx
│  └─ login
│     ├─ find-password
│     │  └─ page.tsx
│     ├─ layout.tsx
│     └─ page.tsx
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ public
│  ├─ complete.png
│  ├─ contract.png
│  ├─ file.svg
│  ├─ FlowSyncLogo.jpg
│  ├─ globe.svg
│  ├─ mockServiceWorker.js
│  ├─ next.svg
│  ├─ running.png
│  ├─ support.png
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ api
│  │  ├─ auth.ts
│  │  ├─ axiosInstance.ts
│  │  ├─ members.ts
│  │  └─ projects.ts
│  ├─ components
│  │  ├─ common
│  │  │  ├─ backButton.tsx
│  │  │  ├─ BoardCategorySelectBox.tsx
│  │  │  ├─ BoardSearchSection.tsx
│  │  │  ├─ BoardStatusSelectBox.tsx
│  │  │  ├─ CommentBox.tsx
│  │  │  ├─ CommentItem.tsx
│  │  │  ├─ Comments.tsx
│  │  │  ├─ CommonTable.tsx
│  │  │  ├─ CustomBox.tsx
│  │  │  ├─ Loading.tsx
│  │  │  ├─ LoginInputForm.tsx
│  │  │  ├─ MembersSearchSection.tsx
│  │  │  ├─ MemberTable.tsx
│  │  │  ├─ MSWComponent.tsx
│  │  │  ├─ Pagination.tsx
│  │  │  ├─ Profile.tsx
│  │  │  ├─ ProgressStepButton.tsx
│  │  │  ├─ ProgressStepSection.tsx
│  │  │  ├─ ProjectInfo.tsx
│  │  │  ├─ ProjectsSearchSection.tsx
│  │  │  ├─ ProjectsStatusCard.tsx
│  │  │  ├─ ProjectsStatusCards.tsx
│  │  │  ├─ ProjectStatusSelectBox.tsx
│  │  │  ├─ ReplyItem.tsx
│  │  │  ├─ SidebarTab.tsx
│  │  │  ├─ TaskComments.tsx
│  │  │  ├─ TaskContent.tsx
│  │  │  └─ TaskForm.tsx
│  │  ├─ layouts
│  │  │  ├─ Drawer.tsx
│  │  │  ├─ Header.tsx
│  │  │  └─ Sidebar.tsx
│  │  ├─ pages
│  │  │  ├─ AdminCreateMemberPage
│  │  │  │  └─ index.tsx
│  │  │  ├─ AdminDashboardPage
│  │  │  │  └─ index.tsx
│  │  │  ├─ AdminMembersPage
│  │  │  │  └─ index.tsx
│  │  │  ├─ AdminOrgsPage
│  │  │  │  └─ index.tsx
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
│  │  │  ├─ ProjectTasksPage
│  │  │  │  └─ index.tsx
│  │  │  └─ WorkFlowPage
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
│  │     ├─ menu.tsx
│  │     ├─ native-select.tsx
│  │     ├─ pagination.tsx
│  │     ├─ popover.tsx
│  │     ├─ provider.tsx
│  │     ├─ radio.tsx
│  │     ├─ segmented-control.tsx
│  │     ├─ select.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ slider.tsx
│  │     └─ tooltip.tsx
│  ├─ context
│  │  ├─ PermissionsContext.tsx
│  │  ├─ RedirectContext.tsx
│  │  └─ SidebarContext.tsx
│  ├─ data
│  │  ├─ 100.json
│  │  ├─ 101.json
│  │  ├─ boardList_mock_data.json
│  │  ├─ comment_mock_data.json
│  │  ├─ members_mock_data.json
│  │  ├─ mock_tasks.json
│  │  ├─ new_task_data.ts
│  │  ├─ organizations_mock_data.json
│  │  ├─ projects_mock_data.json
│  │  ├─ task_comments_data.ts
│  │  ├─ task_data.ts
│  │  └─ users_mock_data.json
│  ├─ hook
│  │  ├─ useMemberList.tsx
│  │  ├─ useProgressData.tsx
│  │  ├─ useProjectBoard.tsx
│  │  ├─ useProjectInfo.tsx
│  │  ├─ useProjectList.tsx
│  │  └─ useRedirectIfLoggedIn.ts
│  ├─ mocks
│  │  ├─ browser.ts
│  │  ├─ handlers.ts
│  │  ├─ index.ts
│  │  └─ server.ts
│  ├─ types
│  │  ├─ api.ts
│  │  ├─ index.ts
│  │  ├─ loginForm.ts
│  │  ├─ member.ts
│  │  ├─ organization.ts
│  │  ├─ pagination.ts
│  │  ├─ profile.ts
│  │  ├─ project.ts
│  │  └─ taskTypes.ts
│  └─ utils
│     └─ isAdminCheck.tsx
└─ tsconfig.json

```
