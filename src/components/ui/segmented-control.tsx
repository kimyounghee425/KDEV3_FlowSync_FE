"use client";

import { Box, For, SegmentGroup } from "@chakra-ui/react";
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
        {(item) => (
          <SegmentGroup.Item
            key={item.value}
            value={item.value}
            disabled={item.disabled}
          >
            <SegmentGroup.ItemText>{item.label}</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        )}
      </For>
    </SegmentGroup.Root>
  );
});
