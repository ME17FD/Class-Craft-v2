package com.ClassCraft.site.dto.module;

public record ModuleDto(
        Long id,
        String name,
        String code,
        Integer numberOfHours,
        Long professorId,
        Long semestreId
) {
}

