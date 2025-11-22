package com.ClassCraft.site.dto.sousmodule;

public record SousModuleDto(
        Long id,
        String name,
        Integer numberOfHours,
        Long moduleId,
        String moduleName,
        Long professorId,
        String professorName
) {
}

