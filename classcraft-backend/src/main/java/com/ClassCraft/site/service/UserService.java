package com.ClassCraft.site.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ClassCraft.site.dto.user.ProfessorDto;
import com.ClassCraft.site.dto.user.ProfessorRequestDto;
import com.ClassCraft.site.dto.user.StudentDto;
import com.ClassCraft.site.dto.user.StudentRequestDto;
import com.ClassCraft.site.models.User;

public interface UserService extends CrudService<User, Long> {
    Page<StudentDto> findAllStudentsPaged(Pageable pageable);
    StudentDto findStudentById(Long id);
    StudentDto createStudent(StudentRequestDto requestDto);
    StudentDto updateStudent(Long id, StudentRequestDto requestDto);
    boolean deleteStudent(Long id);
    
    Page<ProfessorDto> findAllProfessorsPaged(Pageable pageable);
    ProfessorDto findProfessorById(Long id);
    ProfessorDto createProfessor(ProfessorRequestDto requestDto);
    ProfessorDto updateProfessor(Long id, ProfessorRequestDto requestDto);
    boolean deleteProfessor(Long id);
}

