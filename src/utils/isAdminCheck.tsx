import User from "@/src/data/members_mock_data.json";

const ADMIN_USER_ID = User.data[0].id; // 관리자 계정 ID (value: 숫자 0)

// 관리자 계정이면 true 반환, 일반 user 이면 false 반환하는 함수
export default async function isAdminCheck() {
  try {
    // 로컬스토리지에서 'user' 값을 가져오기
    const userData = localStorage.getItem("user");
    if (!userData) {
      throw new Error("User 정보가 로컬스토리지에 없습니다.");
    }
    // JSON 문자열을 객체로 변환
    const userObject = JSON.parse(userData);
    console.log("관리자 계정인지 체크합니다: ");
    console.log(`${userObject.id === ADMIN_USER_ID}`);
    return userObject.id === ADMIN_USER_ID; // true: admin 계정, false: 일반 user 계정
  } catch (err: any) {
    console.log(err.message || "An unknown error occurred");
    return false; // 기본적으로 관리자 아님
  }
}
