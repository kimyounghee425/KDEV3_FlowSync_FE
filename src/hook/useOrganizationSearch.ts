import { useState, useEffect, useRef } from "react";
import { getOrganizationsApi } from "@/src/api/getOrganization";
import { OrganizationProps } from "@/src/types";

export function useOrganizationSearch() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [organizations, setOrganizations] = useState<OrganizationProps[]>([]);
  const [selectedOrganizationId, setSelectedOrganizationId] =
    useState<string>("");
  const [selectedOrganizationName, setSelectedOrganizationName] =
    useState<string>("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const listRefs = useRef<Array<HTMLDivElement | null>>([]);

  // 조직 목록을 가져오는 함수
  const fetchOrganizations = async (searchQuery: string = "") => {
    try {
      const response = await getOrganizationsApi();

      // 검색어가 없으면 전체 목록 반환
      if (!searchQuery.trim()) {
        setOrganizations(response.data.dtoList);
        return;
      }

      // 검색어가 있는 경우 필터링된 목록 반환
      const filteredOrganizations = response.data.dtoList.filter(
        (org: OrganizationProps) =>
          org.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setOrganizations(filteredOrganizations);
    } catch (error) {
      // "업체 데이터를 가져오는 중 오류 발생:"
    }
  };

  // 모달이 열릴 때 조직 목록을 불러옴
  useEffect(() => {
    if (isModalOpen && organizations.length === 0) {
      fetchOrganizations();
    }
  }, [isModalOpen]);

  // 외부 클릭 시 모달 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 검색어 변경 시 자동 검색 실행
  useEffect(() => {
    fetchOrganizations(searchTerm);
    setHighlightedIndex(-1);
  }, [searchTerm]);

  // 키보드 네비게이션 처리
  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < organizations.length) {
        handleSelectOrganization(organizations[highlightedIndex].id);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < organizations.length - 1 ? prevIndex + 1 : prevIndex,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex,
      );
    } else if (event.key === "Escape") {
      setIsModalOpen(false);
    }
  }

  // 조직 선택 시 조직 이름을 저장하고 모달 닫기
  function handleSelectOrganization(orgId: string) {
    const selectedOrg = organizations.find((org) => org.id === orgId);
    setSelectedOrganizationId(selectedOrg ? selectedOrg.id : "");
    setSelectedOrganizationName(selectedOrg ? selectedOrg.name : "");
    setIsModalOpen(false);
  }

  return {
    isModalOpen,
    searchTerm,
    organizations,
    selectedOrganizationId,
    selectedOrganizationName,
    highlightedIndex,
    listRefs,
    modalRef,
    setSearchTerm,
    setIsModalOpen,
    handleSelectOrganization,
    handleSearchKeyDown,
  };
}
