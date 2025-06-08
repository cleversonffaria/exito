import React from "react";
import { colors } from "@/constants/colors";
import { InputAtom } from "@atom/input";
import SearchIcon from "@assets/svg/search.svg";
import { NExerciseSearch } from "./exercise-search.types";

export function ExerciseSearchComponent({
  searchQuery,
  onSearchChange,
}: NExerciseSearch.Props) {
  return (
    <InputAtom.Root className="-mb-7">
      <InputAtom.Icon
        icon={<SearchIcon width={16} height={16} color={colors.gray[400]} />}
      />

      <InputAtom.Field
        placeholder="Pesquisar exercício"
        value={searchQuery}
        onChangeText={onSearchChange}
      />
    </InputAtom.Root>
  );
}
