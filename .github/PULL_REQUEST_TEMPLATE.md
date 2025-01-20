### 📄 Description of the PR

- 기능 설명 :
- Close # (이슈 번호)

### 🔧 What has been changed?

<!-- 이번 PR에서의 변경점 (- 코드 변경, 기능 추가, 버그 수정 등.)-->

### 📸 Screenshots / GIFs (if applicable)

<!-- 가능하다면 스크린샷이나 GIF를 첨부해주세요 -->

### ⚠️ Precaution & Known issues

<!-- 리뷰할 때 고려해야 할 부분, 수정이 필요한 부분, 아직 해결되지 않는 문제, 개선해야 할 사항 -->

### ✅ Checklist

- [ ] import 시 의도를 명확히 하기 위해 별칭 작성 (예: Provider as ChakraProvider)
- [ ] 컴포넌트를 함수형 컴포넌트로 선언 (예: export default function 컴포넌트명() {})
- [ ] 컴포넌트명은 파스칼 케이스로 작성
- [ ] 변수명 및 함수명은 카멜케이스로 작성하며 식별 가능하도록 명확히 작성 (예: renderMenuByMemberRole)
- [ ] React Hook 사용 순서는 useRef > useState > useEffect > useMemo > useCallback 순서 준수
- [ ] Import 순서는 아래와 같이 정리
      [1. 외부 라이브러리 (react, axios 등) 2. 절대 경로 파일 (@components, @utils 등) 3. 스타일 파일 (.css, .scss 등)]
- [ ] Props 인터페이스는 ‘컴포넌트명’ + Props로 명명 (예: ButtonProps, UserProfileProps)
- [ ] 렌더링과 관련 없는 정적 데이터는 컴포넌트 외부에 선언
- [ ] 상수는 별도의 파일에 모아 관리
- [ ] 공통적인 유틸리티 함수(예: 시간 변환, 문자열 변환)는 utils 폴더에 정리
- [ ] 공통 타입은 types 폴더에서 관리 (공통이 아닌 타입은 페이지 폴더 내부에 작성)
- [ ] 별도 페이지에서만 사용하는 컴포넌트는 해당 pages의 폴더 > components 폴더에 배치
- [ ] 여러 페이지에서 사용하는 공통 컴포넌트는 common 폴더로 이동 (도메인별로 구분)
- [ ] 외부 의존성 최소화하고 순수 함수로 작성
- [ ] 사용하지 않는 임포트문이나 기타 파일들 삭제
- [ ] 주석 성실히 작성
