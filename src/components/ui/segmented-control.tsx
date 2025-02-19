"use client";

import { For, SegmentGroup } from "@chakra-ui/react";
import * as React from "react";

interface Item {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

/**
 * SegmentedControlProps
 *
 * - extends SegmentGroup.RootProps: Chakra UI의 SegmentGroup과 호환
 * - items: 항목 배열 (문자열 또는 { value, label } 형태)
 * - onValueChange: 선택된 값(들)을 외부에 전달하는 콜백 (Optional)
 */
export interface SegmentedControlProps
  extends Omit<SegmentGroup.RootProps, "onValueChange"> {
  items: Array<string | Item>;

  //선택된 값이 변경될 때 호출되는 콜백 함수
  onValueChange?: (details: { value: string }) => void;
}

/**
 * 문자열/객체 형태의 items를 모두 { value, label } 구조로 통일
 */
function normalize(items: Array<string | Item>): Item[] {
  return items.map((item) => {
    if (typeof item === "string") return { value: item, label: item };
    return item;
  });
}

/**
 * SegmentedControl
 * - forwardRef를 사용해 DOM ref를 전달 (HTMLDivElement)
 * - onValueChange를 받아서 SegmentGroup.Root에 전달
 */
/**
 * SegmentedControl
 * - forwardRef를 사용해 DOM ref를 전달 (HTMLDivElement)
 * - onValueChange를 받아서 SegmentGroup.Root에 전달
 */
export const SegmentedControl = React.forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(function SegmentedControl(props, ref) {
  const { items, onValueChange, ...rest } = props;

  // items를 { value, label } 배열로 통일
  const data = React.useMemo(() => normalize(items), [items]);

  /**
   * Chakra UI의 SegmentGroup.Root는 onValueChange를 다음 형태로 줄 수 있음
   * (details: { value: string }) => void
   */
  return (
    <SegmentGroup.Root ref={ref} {...rest} onValueChange={onValueChange}>
      <SegmentGroup.Indicator />
      <For each={data}>
        {(item) => {
          const isSelected = item.value === rest.value; // 현재 선택된 값인지 확인

          return (
            <SegmentGroup.Item
              key={item.value}
              value={item.value}
              disabled={item.disabled || isSelected} // 선택된 요소 비활성화
              aria-disabled={isSelected}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                transition: "all 0.2s ease-in-out",
                cursor: isSelected ? "default" : "pointer", // 선택된 요소는 커서 기본값
                fontWeight: "bold",
                color: "inherit", // 선택된 요소도 기존 글씨 색 유지
                opacity: isSelected ? 1 : undefined, // 선택된 요소도 투명도 변화 없음
                backgroundColor: isSelected ? "#FFFFFF" : "transparent", // 선택된 요소 배경 변경
              }}
              css={
                isSelected
                  ? {} // 선택된 요소는 hover, active 효과 없음
                  : {
                      "&:hover": {
                        backgroundColor: "gray.200",
                        transform: "scale(1.05)",
                      },
                      "&:active": {
                        backgroundColor: "gray.400",
                        transform: "scale(0.95)",
                      },
                    }
              }
            >
              <SegmentGroup.ItemText>{item.label}</SegmentGroup.ItemText>
              <SegmentGroup.ItemHiddenInput />
            </SegmentGroup.Item>
          );
        }}
      </For>
    </SegmentGroup.Root>
  );
});
